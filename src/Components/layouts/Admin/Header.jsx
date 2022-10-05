import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { logoutUser } from "../../../Redux/UserApi";

import { ReactComponent as Home} from "./svg/Home.svg"
import { ReactComponent as Catalog} from "./svg/Catalog.svg"
import { ReactComponent as Products} from "./svg/Products.svg"
import { ReactComponent as Settings} from "./svg/Settings.svg"
import { ReactComponent as Exit} from "./svg/Exit.svg"
import { ReactComponent as Users} from "./svg/Users.svg"



export default function AdminHeader() {
        
        const navigate = useNavigate();
        const dispatch = useDispatch();
        
        return(
            <div className="admin admin-header">
                <div className="content">
                    <ul>
                        <li onClick={(e)=>{goPage(e)}}> <Home/> Продажі</li>
                        <li onClick={(e)=>{goPage(e,'users')}}><Users/> Користувачі</li>
                        <li onClick={(e)=>{goPage(e,'catalog')}}><Catalog/>Каталог</li>
                        <li onClick={(e)=>{goPage(e,'products')}}><Products/>Товар</li>
                        <li onClick={(e)=>{goPage(e,'settings')}}><Settings/> Налаштування</li>
                        <li onClick={()=>{
                            logoutUser(dispatch);
                            navigate('/admin')
                        }}><Exit/>Вихід</li>
                    </ul>
                </div>
            </div>
        )


        function goPage({target}, url = '', ) {
            // console.log(target.tagName );
            let addClass = target;
            if(addClass.tagName !== 'LI'){
                
                addClass = addClass.parentElement;
            }
            document.getElementsByClassName('active-menu')[0]?.classList.remove('active-menu');
            addClass.classList.add('active-menu');
            
            navigate('/admin/'+url)
        }
}