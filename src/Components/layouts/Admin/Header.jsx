import { useNavigate } from "react-router-dom"



export default function AdminHeader() {
        
        const navigate = useNavigate();
        return(
            <div className="admin admin-header">
                <div className="content">
                    <ul>
                        <li onClick={()=>{goPage()}}>Statistic</li>
                        <li onClick={()=>{goPage('users')}}>Users</li>
                        <li onClick={()=>{goPage('products')}}>Products</li>
                        <li>Settings</li>
                    </ul>
                </div>
            </div>
        )


        function goPage(url = '') {
            navigate('/admin/'+url)
        }
}