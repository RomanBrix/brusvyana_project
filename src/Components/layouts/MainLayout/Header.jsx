import {ReactComponent as Logo} from '../../../svg/Logo.svg';
import {ReactComponent as Lang} from '../../../svg/Lang.svg';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


export default function MainHeader() {
    
    const [activeLanguage, setActiveLanguage] = useState('ua');


    const { pathname } = useLocation();
    const navigate = useNavigate();
    // console.log(pathname)
    const languagesLabels = [{label: 'Укр',value: 'ua'}, {label: 'Рус',value: 'ru'},{label: 'Eng',value: 'en'}];
    return (
        <div className={`header ${pathname === '/' ? 'main-header':'main-black-header'}`}>
            <div className="content">
                <ul className="menu main-menu">
                    <li onClick={()=>{navigate('/ss')}}>Роздріб</li>
                    <li onClick={()=>{navigate('/')}}>Опт</li>
                    <li onClick={()=>{navigate('/')}}>Про нас</li>
                    <li onClick={()=>{navigate('/')}}>Контакти</li>
                </ul>
                <div className="logo" onClick={()=>{navigate('/')}}>
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
                        {renderMainLang()}
                        <ul>
                            {renderLanguages()}
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    )
    
    function renderMainLang() {
        let lang = languagesLabels.find(lang => lang.value === activeLanguage); 
        return lang.label;
    }
    function renderLanguages() {
        return languagesLabels.filter(item => item.value !== activeLanguage).map( (item, index) => {
            return (
                <li key={index} onClick={()=>{setActiveLanguage(item.value)}}>{item.label}</li>
            )
        } )
    }
}