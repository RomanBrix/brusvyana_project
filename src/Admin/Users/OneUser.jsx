import '@material-design-icons/font';
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PrettyDate } from "../../helpers";
import { createUserAxiosRequest } from "../../requestMethods";
import UserModal from './userModal';






export default function OneUser() {
    const [user, setUser] = useState(null);
    const [modalLayer, setModalLayer] = useState(false);
    const [editUserForm, setEditUserForm] = useState({
        ...user,
        password_show: false,
        password: '',
    })


    const {id} = useParams();
    
    const navigate = useNavigate()
    const request = createUserAxiosRequest('user')

    useEffect(()=>{
        request.get(`/users/find/${id}`)
        .then(res=>{
            setUser(res.data)
            setEditUserForm((prev)=>({
                ...prev,
                ...res.data
            }))
        })
        .catch(err=>{
            console.log(err)
        })
        // eslint-disable-next-line
    },[])


    console.log(editUserForm)
    if(user?.message){
            return <div className="whiteBg">
                <h1>Пользователь не найден</h1>
            </div>
    }
    if(!user){
        return <div className="whiteBg">
            <h1>Загрузка...</h1>
        </div>
    }
    return(
        <div className="oneUser">
            {
                modalLayer && <UserModal 
                addUserForm={editUserForm} 
                setAddUserForm={setEditUserForm} 
                setAddUserModal={setModalLayer} 
                addUser={changeUser}
                change={true}
                />
                
            }
            <div className="content">
                <div className="user whiteBg content-block">
                    <h1>Користувач <span className='small'>{user._id}</span></h1>
                    <div className="top">
                        <div className="time small">
                            <div className="role">{user.isAdmin ? <span className="tag">Админ</span> : <span className="tag -green">Користувач</span> }</div>
                            <div className="created"><span className="material-icons">schedule</span>{PrettyDate(user.createdAt)}</div>
                            <div className="updated"><span className="material-icons">more_time</span>{PrettyDate(user.updatedAt)}</div>
                        </div>
                        <div className="btns">
                            <button className="btn" onClick={()=>{setModalLayer(true)}}>Редагувати</button>
                            <button className="btn btn-warning" onClick={()=>{deleteUser(user._id)}}>Видалити</button>
                        </div>
                    </div>

                    <div className="info">
                        <div className="name info-block"> <span className="material-icons">account_circle</span> {user.username}</div>
                        <div className="email info-block"> <span className="material-icons">mail</span> {user.email}</div>
                        
                    </div>
                </div>

                <div className="users-order whiteBg content-block">
                    <h1>Orders</h1>
                </div>

                <div className="users-discounts whiteBg content-block">
                    <h1>Discounts</h1>
                </div>
            </div>
        </div>
    )


    function changeUser(data){
        if(data.password === '') delete data.password
        // console.log(data)
        request.put(`/users/admin/${id}`, data)
        .then(res=>{
            // console.log(res.data)
            setModalLayer(false)
            setUser(res.data)
            setEditUserForm(
                {
                    ...res.data,
                    password_show: false,
                    password: '',
                }
            )
        })
        .catch(err=>{
            console.log(err)
        })
        
        console.log(data)

    }

    function deleteUser(id){
        if(!window.confirm('Ви впевнені?')) return;
        request.delete(`/users/${id}`)
        .then(res=>{
            console.log(res)
            navigate(-1, {replace: true})
        })
        .catch(err=>{
            console.log(err)
        })
    }
}