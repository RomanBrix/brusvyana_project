import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as Pay } from "../../svg/generalInfo/Pay.svg"
import { ReactComponent as Delivery } from "../../svg/generalInfo/Delivery.svg"
import { ReactComponent as Guarantee } from "../../svg/generalInfo/Guarantee.svg"
import { ReactComponent as Policy } from "../../svg/generalInfo/Policy.svg"

import { ReactComponent as LeafPattern } from "../../svg/LeafPattern.svg"
import { ReactComponent as BigLogo } from "../../svg/BigLogo.svg"



export default function GeneralInfoLayout() {
    
    const navigate = useNavigate();
    const { pathname } = useLocation();
    return(
        <div className="general-info">
            <div className="content">
                <div className="general-info-header">
                    <ul className="menu">
                        <li 
                            className={pathname === '/general-info' || pathname === '/general-info/pay' ? 'active' : ''} 
                            onClick={()=>{goAnotherPage('/pay')}}
                        >
                            <div className="bg">
                                <LeafPattern/>
                            </div>
                            <span>
                                <Pay/> Оплата
                            </span>
                        </li>
                        <li 
                            className={pathname === '/general-info/delivery' ? 'active' : ''}
                            onClick={()=>{goAnotherPage('/delivery')}}
                        > 
                            <div className="bg">
                                <LeafPattern/>
                            </div>
                            <span>
                                <Delivery/> Доставка
                            </span>
                        </li>
                        <li 
                            className={pathname === '/general-info/guarantee' ? 'active' : ''}
                            onClick={()=>{goAnotherPage('/guarantee')}}
                        > 
                            <div className="bg">
                                <LeafPattern/>
                            </div>
                            <span>
                                <Guarantee/> Гарантія і повернення 
                            </span>
                        </li>
                        <li 
                            className={pathname === '/general-info/policy' ? 'active' : ''}
                            onClick={()=>{goAnotherPage('/policy')}}
                        > 
                            <div className="bg">
                                <LeafPattern/>
                            </div>
                            <span>
                                <Policy/> Угода користувача
                            </span>
                        </li>
                    </ul>
                </div>
                <div className="content-bg">
                    <div className="bg">
                        <BigLogo/>
                    </div>
                    <Outlet/>
                </div>
            </div>
        </div>
    )

    function goAnotherPage(path) {
        navigate('/general-info' + path);
    }
}