import {ReactComponent as Logo} from '../../../svg/Logo.svg';
import {ReactComponent as Phone} from '../../../svg/socials/Phone.svg';
import {ReactComponent as Instagram} from '../../../svg/socials/Instagram.svg';
import {ReactComponent as Mail} from '../../../svg/socials/Mail.svg';
import {ReactComponent as Facebook} from '../../../svg/socials/Facebook.svg';

export default function Footer(){

    return(
        <div className="footer">
            <div className="content">
                <div className="logo">
                    {/* <img src="/src/img.png" alt="logo" /> */}
                    <Logo className='header-logo'/>
                </div>


                <div className="links-block">
                    <ul className="menu">
                        <li>Роздріб</li>
                        <li>Опт</li>
                        <li>Про нас</li>
                        <li>Контакти</li>
                    </ul>
                </div>

                <div className="links-block">
                    <ul className="menu">
                        <li>Оплата</li>
                        <li>Доставка</li>
                        <li>Гарантія</li>
                        <li>Угода користувача</li>
                    </ul>
                </div>



                <div className="call-block">
                    <div className="call">
                        <div className="head">Оптова торгівля</div>
                        <a href="tel:"><Phone/> Тетяна: +38 067 411 36 91</a>
                    </div>
                    <div className="call">
                        <div className="head">Торгові мережі/ дрібний опт</div>
                        <a href="tel:"><Phone/> Олег: +38 067 411 69 06</a>
                    </div>
                </div>

                <div className="contact-block">
                    <ul>
                        <li><a href="tel:"><Facebook/> Facebook</a></li>
                        <li><a href="tel:"><Instagram/> Instagram</a></li>
                        <li><a href="tel:"><Mail/> E-mail: brusvyana@ukr.net</a></li>
                    </ul>
                </div>

                <div className="address-block call-block">
                    <div className="call">
                        <div className="head">Адреса</div>
                        <a href="tel:">Житомирська обл., Брусилівський р-н, с. Костівці, вул. Польова 1</a>
                    </div>
                </div>
            </div>
        </div>
    )
}