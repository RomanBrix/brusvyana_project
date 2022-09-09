import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { GeneratePassword, PrettyDate, ShowFirstAndLast } from "../../helpers"
import { createUserAxiosRequest } from "../../requestMethods"






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
                addUserModal && <AddUserModal addUserForm={addUserForm} setAddUserForm={setAddUserForm} setAddUserModal={setAddUserModal} addUser={addUser}/>
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










function AddUserModal({addUserForm, setAddUserForm, setAddUserModal, addUser}) {

    return (
        <div className="add-user-modal" onClick={()=>{closeLayer()}}>
            <div className="modal" onClick={(e)=>{e.stopPropagation()}}>
                <div className="modal-header">
                    <h3>Додати користувача</h3>
                    <button className="btn btn-danger" onClick={()=>closeLayer()}>X</button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" id="username" value={addUserForm.username} onChange={changeHandler}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" value={addUserForm.email} onChange={changeHandler}/>
                    </div>
                    <div className="form-group form-pass">
                        <label htmlFor="password">Password</label>
                        <input 
                            type={`${addUserForm.password_show ? 'text' : 'password'}`} 
                            name="password" 
                            id="password" 
                            value={addUserForm.password} 
                            onChange={changeHandler}
                        />
                        <div className="btn" onClick={genPass}>Згенерувати</div>
                    </div>
                    <div className="form-group form-switch">
                        <label htmlFor="role"><span> Admin</span>
                        <div className="switch">
                            <input 
                                type="checkbox" 
                                id='role'
                                onChange={({target})=>{ setAddUserForm((prev)=>({...prev, isAdmin: target.checked})) }}
                            />
                            <span className="slider round"></span>
                        </div>
                        </label>
                        {/* <select name="role" id="role">
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select> */}
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" onClick={()=>{goAdd()}}>Додати</button>
                    </div>
                </div>
            </div>
        </div>
    )

    function closeLayer(){
        setAddUserModal(false);
        setAddUserForm({
            username: "",
            email: "",
            password: "",
            password_show: false,
            isAdmin: false,
        })
    }
    function goAdd(){
        console.log( addUserForm )
        //validate forms
        
        if( addUserForm.username.length < 3 ){
            alert('Username must be at least 3 characters')
            return
        }
        // console.log(addUserForm.email);
        if( !addUserForm.email.includes('@') && !addUserForm.email.includes('.') && addUserForm.email.length < 5 ){
            alert('Email must be valid')
            return
        }
        if( addUserForm.password.length < 6 ){
            alert('Password must be at least 6 characters')
            return
        }

        addUser(addUserForm)


    }
    function changeHandler(e){
        const {name, value} = e.target
        setAddUserForm(prev=>({...prev, [name]: value}))
    }
    function genPass(){
        GeneratePassword(8)
        setAddUserForm(prev=>({...prev, password: GeneratePassword(8), password_show: true}))
    }
}