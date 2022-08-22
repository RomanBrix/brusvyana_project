import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { logoutUser } from "../../../Redux/UserApi";



export default function AdminHeader() {
        
        const navigate = useNavigate();
        const dispatch = useDispatch();
        
        return(
            <div className="admin admin-header">
                <div className="content">
                    <ul>
                        <li onClick={()=>{goPage()}}>Statistic</li>
                        <li onClick={()=>{goPage('users')}}>Users</li>
                        <li onClick={()=>{goPage('products')}}>Products</li>
                        <li>Settings</li>
                        <li onClick={()=>{
                            logoutUser(dispatch);
                            navigate('/admin')
                        }}>LogOut</li>
                    </ul>
                </div>
            </div>
        )


        function goPage(url = '') {
            navigate('/admin/'+url)
        }
}