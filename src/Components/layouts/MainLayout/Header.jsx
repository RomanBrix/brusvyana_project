import {ReactComponent as Logo} from '../../../svg/Logo.svg';
import {ReactComponent as Lang} from '../../../svg/Lang.svg';


export default function MainHeader() {
    return (
        <div className="header main-header">
            <div className="content">
                <ul className="menu main-menu">
                    <li>Роздріб</li>
                    <li>Опт</li>
                    <li>Про нас</li>
                    <li>Контакти</li>
                </ul>
                <div className="logo">
                    {/* <img src="/src/img.jpg" alt="Logo" /> */}
                    <Logo className='header-logo'/>
                </div>
                <ul className="menu second-menu">
                    <li>Проекти</li>
                    <li>Досягнення</li>
                    <li>База знань</li>
                    <li>Загальна інформація</li>
                    <li className='language'> 
                        <Lang/>
                        Укр
                    </li>
                </ul>
            </div>
        </div>
    )
}