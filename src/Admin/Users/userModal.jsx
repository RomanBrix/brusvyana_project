import { GeneratePassword } from "../../helpers"




export default function UserModal({addUserForm, setAddUserForm, setAddUserModal, addUser, change}) {

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
                                checked={addUserForm.isAdmin}
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
                        <button className="btn btn-primary" onClick={()=>{goAdd()}}>{change ? 'Змiнити' : 'Додати'}</button>
                    </div>
                </div>
            </div>
        </div>
    )

    function closeLayer(){
        setAddUserModal(false);
        // setAddUserForm({
        //     username: "",
        //     email: "",
        //     password: "",
        //     password_show: false,
        //     isAdmin: false,
        // })
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
        // if( addUserForm.password.length < 6 ){
        //     alert('Password must be at least 6 characters')
        //     return
        // }

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