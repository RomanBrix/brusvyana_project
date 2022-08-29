import {ReactComponent as Logo} from '../../../svg/Logo.svg';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as LeafPattern } from "../../../svg/LeafPattern.svg"
import { ReactComponent as Cart } from "../../../svg/Cart.svg"
import { useSelector } from 'react-redux';



export default function RetailHeader() {
    

    const cartStore = useSelector(state => state.persistedReducer.cart);
    const productCount = cartStore.products.length > 0 ? cartStore.products.reduce((acc, curr)=>{ return acc += +curr.quantity}, 0) : 0;
    const navigate = useNavigate();
    
    return (
        <div className={`header main-black-header`}>
            <div className="head-bg"><LeafPattern/></div>
            <div className="content">
                <ul className="menu main-menu">
                    <li onClick={()=>{changePage('/retail')}}>Роздріб</li>
                    <li onClick={()=>{changePage('/opt')}}>Опт</li>
                    <li onClick={()=>{changePage('/about')}}>Про нас</li>
                    <li onClick={()=>{changePage('/contacts')}}>Контакти</li>
                </ul>
                <div className="logo" onClick={()=>{changePage('/')}}>
                    {/* <img src="/src/img.jpg" alt="Logo" /> */}
                    <Logo className='header-logo'/>
                </div>
                <ul className="menu second-menu">
                    <li onClick={()=>{changePage('/general-info')}}>Загальна інформація</li>
                    <li className='cart' onClick={()=>{changePage('/retail/cart')}}> <Cart/> <div className="count">{ productCount }</div> </li>
                </ul>
            </div>
        </div>
    )

    function changePage(url){
        checkOnMobile();
        navigate(url);
    }
    function checkOnMobile() {
        const header = document.querySelector('.header');
        const btn = document.querySelector('.mobile-header-btn');
        console.log(header);
        if(header.classList.contains('open-mobile-header')){
            header.classList.remove('open-mobile-header');
            btn.classList.remove('open-mobile-btn');
        }
    }
}