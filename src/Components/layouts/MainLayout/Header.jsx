import {ReactComponent as Logo} from '../../../svg/Logo.svg';
import {ReactComponent as Lang} from '../../../svg/Lang.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import useMainTranslate from '../../hook/useMainTranslate';
import { ReactComponent as LeafPattern } from "../../../svg/LeafPattern.svg"


export default function MainHeader() {
    
    const {language, setLanguage} = useMainTranslate();


    const { pathname } = useLocation();
    const navigate = useNavigate();
    // console.log(pathname)
    const languagesLabels = [{label: 'Укр',value: 'ua'}, {label: 'Рус',value: 'ru'},{label: 'Eng',value: 'en'}];
    return (
        <div className={`header ${pathname === '/' ? 'main-header':'main-black-header'}`}>
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
                    <li onClick={()=>{changePage('/projects')}}>Проекти</li>
                    <li onClick={()=>{changePage('/achievement')}}>Досягнення</li>
                    <li onClick={()=>{changePage('/wiki')}}>База знань</li>
                    <li onClick={()=>{changePage('/general-info')}}>Загальна інформація</li>
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
    
    function renderMainLang() {
        let lang = languagesLabels.find(lang => lang.value === language); 
        return lang.label;
    }
    function renderLanguages() {
        return languagesLabels.filter(item => item.value !== language).map( (item, index) => {
            return (
                <li key={index} onClick={()=>{setLanguage(item.value)}}>{item.label}</li>
            )
        } )
    }
}