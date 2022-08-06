import {ReactComponent as Arrow} from '../../../svg/ArrowRight.svg';

import {ReactComponent as Phone} from '../../../svg/socials/Phone.svg';
import {ReactComponent as Instagram} from '../../../svg/socials/Instagram.svg';
import {ReactComponent as Mail} from '../../../svg/socials/Mail.svg';
import {ReactComponent as Facebook} from '../../../svg/socials/Facebook.svg';



export default function Intro() {
    
    return (
        <div className="main-intro">
            <div className="content">
                <div className="center">
                    <h1>Розсадник  ягідних культур Брусвяна</h1>
                    <div className="btns">
                        <div className="btn">Роздріб <Arrow/></div>
                        <div className="btn">Опт <Arrow/></div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="social-block">
                        <a href="tel:">
                            <Phone/>
                            <span>Тетяна: +38 067 411 36 91</span>
                        </a>
                    </div>
                    <div className="social-block">
                        <a href="tel:">
                            <Phone/>
                            <span>Олег: +38 067 411 69 06</span>
                        </a>
                    </div>
                    <div className="social-block">
                        <a href="tel:">
                            <Instagram/>
                            <span>Facebook</span>
                        </a>
                    </div>
                    <div className="social-block">
                        <a href="tel:">
                            <Facebook/>
                            <span>Instagram</span>
                        </a>
                    </div>
                    <div className="social-block">
                        <a href="tel:">
                            <Mail/>
                            <span>E-mail: brusvyana@ukr.net</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}