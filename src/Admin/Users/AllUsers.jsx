import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PrettyDate, ShowFirstAndLast } from "../../helpers"
import { createUserAxiosRequest } from "../../requestMethods"
import Pagination from "../Pagination"
import {changeSortRule, renderArrow, sortFunction } from "../tableSort"
import UserModal from "./userModal"






export default function AllUser() {
    const [users, setUsers] = useState([])
    

    const [addUserModal, setAddUserModal] = useState(false)


    const [addUserForm, setAddUserForm] = useState({
        username: "",
        email: "",
        password: "",
        password_show: false,
        isAdmin: false,
    })

    const [sortRule, setSortRule] = useState({
        name: '',
        order: '',
        type: ''
    })
    const [search, setSearch] = useState('')
    let manipulatedUsers = users
    .filter(user=>user.username.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b)=>{ return sortFunction(a,b, sortRule)});
    //pagination
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);


    const navigate = useNavigate();
    const userRequest = createUserAxiosRequest('user')
    useEffect(()=>{
        loadUsers()
        // eslint-disable-next-line
    }, [])
    
    return(
        <div className="all-users whiteBg">
            {
                addUserModal && <UserModal addUserForm={addUserForm} setAddUserForm={setAddUserForm} setAddUserModal={setAddUserModal} addUser={addUser}/>
            }
            <div className="top">
                <h1>Користувачi </h1>
                <div className="search">
                    <input type="text" id="search" value={search} onChange={changeSearchValue} placeholder={'search (username)'}/>
                </div>
                <div className="btns">
                    <button className="btn btn-primary" onClick={()=>{setAddUserModal(true)}}>Додати користувача</button>
                </div>
            </div>
            
                <table>
                    <thead>
                        <tr>
                            
                            <th 
                                data-name={'_id'} 
                                data-type={'string'} 
                                onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                            > 
                                {renderArrow('_id', sortRule)} 
                                id
                            </th>
                            <th 
                                data-name={'username'} 
                                data-type={'string'} 
                                onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                            >
                                {renderArrow('username',sortRule)}
                                 Username
                            </th>
                            <th 
                                data-name={'email'} 
                                data-type={'string'} 
                                onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                            >
                                {renderArrow('email',sortRule)}
                                 email
                            </th>
                            <th 
                                data-name={'isAdmin'} 
                                data-type={'boolean'} 
                                onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                            >
                                {renderArrow('isAdmin',sortRule)}
                                 Role
                            </th>
                            <th 
                                data-name={'createdAt'} 
                                data-type={'date'} 
                                onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                            >
                                {renderArrow('createdAt', sortRule)}
                                 Дата рег.
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <RenderUsers users={manipulatedUsers}/>
                    </tbody>
                </table>
                <Pagination page={page} setPage={setPage} total={manipulatedUsers.length} productsPerPage={perPage}/>
                <>
                Total users : {users.length}
                </>
                <br />
                <>
                Filtered users : {manipulatedUsers.length}
                </>
        </div>
    )


    function changeSearchValue(e){
        const {value} = e.target;
        setSearch(value)
        setPage(1)
    }

    function addUser(data){
        userRequest.post('/auth/add', data).then(res=>{
            console.log(res)
            if(res.data){
                setAddUserForm({
                    username: "",
                    email: "",
                    password: "",
                    password_show: false,
                    isAdmin: false,
                });
                setAddUserModal(false)
                loadUsers()
            }
        }).catch(err=>{
            console.log(err)
        })
    }

    function loadUsers(){
        userRequest.get('/users').then(res=>{
            // console.log(res.data)
            setUsers(res.data)
        }).catch(err=>{
            console.log(err)
        })
    }

    function RenderUsers({users}) {
        return users
        
        // .filter(user=>user.username.toLowerCase().includes(search.toLowerCase()))
        .slice((page-1)*perPage, page*perPage)
        // .sort((a,b)=>{ return sortFunction(a,b, sortRule)})
        .map(user=>{
            const date = PrettyDate(user.createdAt, 'dd/mm/yyyy');
            const smallId = ShowFirstAndLast(user._id)
            const role = user.isAdmin ? 'Адмін' : 'Користувач'
            return(
                <tr className="clickable" key={smallId} onClick={()=>{navigate(`./${user._id}`)}}>
                    <td className="small">{smallId}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td><span className={`tag ${user.isAdmin ? '' : '-green'}`}>{role}</span></td>
                    <td className="small">{date}</td>
                </tr>
            )
        })
    }


    
}










