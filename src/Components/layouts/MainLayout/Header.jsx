import {ReactComponent as Logo} from '../../../svg/Logo.svg';
import {ReactComponent as Lang} from '../../../svg/Lang.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import useMainTranslate from '../../hook/useMainTranslate';


export default function MainHeader() {
    
    const {language, setLanguage} = useMainTranslate();


    const { pathname } = useLocation();
    const navigate = useNavigate();
    // console.log(pathname)
    const languagesLabels = [{label: 'Укр',value: 'ua'}, {label: 'Рус',value: 'ru'},{label: 'Eng',value: 'en'}];
    return (
        <div className={`header ${pathname === '/' ? 'main-header':'main-black-header'}`}>
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
                
                    <li onClick={()=>{navigate('/projects')}}>Проекти</li>
                    <li onClick={()=>{navigate('/achievement')}}>Досягнення</li>
                    <li onClick={()=>{navigate('/wiki')}}>База знань</li>
                    <li onClick={()=>{navigate('/general-info')}}>Загальна інформація</li>
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