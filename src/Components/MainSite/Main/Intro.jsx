import {ReactComponent as Arrow} from '../../../svg/ArrowRight.svg';

import {ReactComponent as Phone} from '../../../svg/socials/Phone.svg';
import {ReactComponent as Instagram} from '../../../svg/socials/Instagram.svg';
import {ReactComponent as Mail} from '../../../svg/socials/Mail.svg';
import {ReactComponent as Facebook} from '../../../svg/socials/Facebook.svg';
import { ContactsInfo } from '../../localData';



export default function Intro({translate}) {
    
    return (
        <div className="main-intro">
            <div className="bgvideo">
                <video autoPlay muted loop id="bgVideo">
                    <source src="/src/bg.mp4" type="video/mp4"/>
                </video>
            </div>
            
            <div className="content">
                <div className="center">
                    <h1>{translate.title}</h1>
                    <div className="btns">
                        <div className="btn">{translate.btnRetail} <Arrow/></div>
                        <div className="btn">{translate.btnWholesale} <Arrow/></div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="social-block">
                        <a href={ContactsInfo.smallPhone}>
                            <Phone/>
                            <span>{ContactsInfo.smallPhoneLabel}</span>
                        </a>
                    </div>
                    <div className="social-block">
                        <a href={ContactsInfo.bigPhone}>
                            <Phone/>
                            <span>{ContactsInfo.bigphoneLabel}</span>
                        </a>
                    </div>
                    <div className="social-block">
                        <a href={ContactsInfo.facebook} target='_blank' rel="noreferrer">
                            <Instagram/>
                            <span>Facebook</span>
                        </a>
                    </div>
                    <div className="social-block">
                        <a href={ContactsInfo.instagram} target='_blank' rel="noreferrer">
                            <Facebook/>
                            <span>Instagram</span>
                        </a>
                    </div>
                    <div className="social-block">
                        <a href={`mailto:${ContactsInfo.mail}`}>
                            <Mail/>
                            <span>{ContactsInfo.mail}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}