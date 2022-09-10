
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../../Redux/UserApi";



export default function Login() {
        const [inputs, setInputs] = useState({
            login:'',
            password:''
        })
        const {loading, error, currentUser} = useSelector(state => state.persistedReducer.user);
        const dispatch = useDispatch();


        return(
            <div className="admin admin-login">
                <div className="content">
                    <div className="login-form" onKeyDown={(e)=>{
                        if (e.key === 'Enter') {
                            goEnter()
                          }
                    }}>
                        {/* <h1>Login</h1> */}
                        <input type="text" name='login' placeholder="Login" value={inputs.login} onChange={(e)=>{handleChangeValue(e)}}/> 
                        <br />
                        <input type="password" name='password' placeholder="Password" value={inputs.password} onChange={(e)=>{handleChangeValue(e)}}/>
                        <br />
                        <div className="error"> { error && 'Error' }</div>
                        {
                            loading ? <div className="loading">Loading...</div> : <button onClick={()=>{goEnter()}}>Enter</button>
                        }
                        {
                            
                            currentUser ? currentUser.isAdmin ?  <div>Hello Admin</div> : <div>Don`t enough rights!</div> : ''
                        }
                    </div>           
                </div>
            </div>
        )
        function goEnter(){
            if(inputs.login.length > 3 && inputs.password.length > 3){
                adminLogin(dispatch, inputs.login, inputs.password);

            }
            
        }
        function handleChangeValue (e) {
            setInputs({
                ...inputs,
                [e.target.name]: e.target.value
            })
        }
    }