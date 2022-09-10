import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PrettyDate, ShowFirstAndLast } from "../../helpers"
import { createUserAxiosRequest } from "../../requestMethods"
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

    const navigate = useNavigate();
    const userRequest = createUserAxiosRequest('user')
    useEffect(()=>{
        loadUsers()
        // eslint-disable-next-line
    }, [])
    // useEffect(()=>{
    //     // setUsers(users.filter(user=>user.username.toLowerCase().includes(search.toLowerCase())))
    // }, [search])
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
                            <th data-name={'_id'} data-type={'string'} onClick={changeSortRule}> {renderArrow('_id')} id</th>
                            <th data-name={'username'} data-type={'string'} onClick={changeSortRule}> {renderArrow('username')} Username</th>
                            <th data-name={'email'} data-type={'string'} onClick={changeSortRule}> {renderArrow('email')} email</th>
                            <th data-name={'isAdmin'} data-type={'boolean'} onClick={changeSortRule}> {renderArrow('isAdmin')} Role</th>
                            <th data-name={'createdAt'} data-type={'date'} onClick={changeSortRule}> {renderArrow('createdAt')} Дата рег.</th>
                        </tr>
                    </thead>
                    <tbody>
                        <RenderUsers/>
                    </tbody>
                </table>
        </div>
    )

    function renderArrow(name){
        if(sortRule.name === name){
            if(sortRule.order === 'asc'){
                return <span>&#9650;</span>
            }else{
                return <span>&#9660;</span>
            }
        }
    }

    function changeSortRule({target}){
        const {name, type} = target.dataset
        // console.log(sortRule.name, name)
        if(name === sortRule.name){
            setSortRule({
                name,
                order: sortRule.order === 'asc' ? 'desc' : 'asc',
                type
            })
        }else{
            setSortRule({
                name,
                order: 'asc',
                type
            })

        }
        // console.log(target.dataset);
    }

    function changeSearchValue(e){
        const {value} = e.target;
        setSearch(value)
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

    function RenderUsers() {
        return users
        .filter(user=>user.username.toLowerCase().includes(search.toLowerCase()))
        .sort((a,b)=>{ return sortFunction(a,b)})
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


    function sortFunction(a,b){
        switch(sortRule.type){
            case 'string':
                if(sortRule.order === 'asc'){
                    return a[sortRule.name].localeCompare(b[sortRule.name])
                }
                return b[sortRule.name].localeCompare(a[sortRule.name])
            case 'boolean':
                if(sortRule.order === 'asc'){
                    return a[sortRule.name] - b[sortRule.name]
                }
                return b[sortRule.name] - a[sortRule.name]
            case 'date':
                if(sortRule.order === 'asc'){
                    return new Date(a[sortRule.name]) - new Date(b[sortRule.name])
                }
                return new Date(b[sortRule.name]) - new Date(a[sortRule.name])
            default:
                return 0
            }
    }
}










