import {ReactComponent as Logo} from '../../../svg/Logo.svg';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as LeafPattern } from "../../../svg/LeafPattern.svg"
import { ReactComponent as Cart } from "../../../svg/Cart.svg"



export default function RetailHeader() {
    

    const navigate = useNavigate();
    
    return (
        <div className={`header main-black-header`}>
            <div className="head-bg"><LeafPattern/></div>
            <div className="content">
                <ul className="menu main-menu">
                    <li onClick={()=>{navigate('/retail')}}>Роздріб</li>
                    <li onClick={()=>{navigate('/opt')}}>Опт</li>
                    <li onClick={()=>{navigate('/about')}}>Про нас</li>
                    <li onClick={()=>{navigate('/contacts')}}>Контакти</li>
                </ul>
                <div className="logo" onClick={()=>{navigate('/')}}>
                    {/* <img src="/src/img.jpg" alt="Logo" /> */}
                    <Logo className='header-logo'/>
                </div>
                <ul className="menu second-menu">
                    <li onClick={()=>{navigate('/general-info')}}>Загальна інформація</li>
                    <li> <Cart/> </li>
                </ul>
            </div>
        </div>
    )
}