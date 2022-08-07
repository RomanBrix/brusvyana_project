import {ReactComponent as BigLogo} from '../../../svg/BigLogo.svg';
import {ReactComponent as Phone} from '../../../svg/socials/Phone.svg';

import {ReactComponent as Instagram} from '../../../svg/socials/Instagram.svg';
import {ReactComponent as Mail} from '../../../svg/socials/Mail.svg';
import {ReactComponent as Facebook} from '../../../svg/socials/Facebook.svg';



export default function ContactsBlock() {
    return (
        <div className="contact-page">
            <div className="content">
                <div className="bg">
                    <BigLogo/>
                </div>
                <div className="social-content">
                    <h1>Контактні данні</h1>
                    <div className="socials">
                        <ul>
                            <li>
                                <div className="call">
                                    <div className="head">Торгові мережі/ дрібний опт</div>
                                    <a href="tel:"><Phone/> Олег: +38 067 411 69 06</a>
                                </div>
                            </li>
                            <li>
                                <div className="call">
                                    <div className="head">Оптова торгівля</div>
                                    <a href="tel:"><Phone/> Тетяна: +38 067 411 36 91</a>
                                </div>
                            </li>
                            <li>
                                <div className="call">
                                    <div className="head">Роздрібна торгівля</div>
                                    <a href="tel:"><Phone/> +380 67 411 69 08</a>
                                </div>
                            </li>
                        </ul>


                        <ul>
                            <li><a href="tel:"><Facebook/> Facebook</a></li>
                            <li><a href="tel:"><Instagram/> Instagram</a></li>
                            <li><a href="tel:"><Mail/> E-mail: brusvyana@ukr.net</a></li>
                            <li>
                                <div className="call">
                                    <div className="head">Адреса</div>
                                    <a href="tel:">Житомирська обл., Брусилівський р-н, с. Костівці, вул. Польова 1</a>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="map">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2547.137950673155!2d29.540898315940826!3d50.32667750415638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x472b5df6db88df4d%3A0xe89ec35ac99d8380!2z0LLRg9C70LjRhtGPINCf0L7Qu9GM0L7QstCwLCAxLCDQmtC-0YHRgtGW0LLRhtGWLCDQltC40YLQvtC80LjRgNGB0YzQutCwINC-0LHQu9Cw0YHRgtGMLCAxMjYxMw!5e0!3m2!1sru!2sua!4v1659867078124!5m2!1sru!2sua" width="600" height="450" allowFullScreen="" loading="lazy" title='map' referrerPolicy="no-referrer-when-downgrade"/>
                    </div>
                </div>
            </div>
        </div>
    )
}