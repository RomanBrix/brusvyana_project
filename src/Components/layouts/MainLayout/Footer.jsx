import { ReactComponent as Logo } from "../../../svg/Logo.svg";
import { ReactComponent as Phone } from "../../../svg/socials/Phone.svg";
import { ReactComponent as Instagram } from "../../../svg/socials/Instagram.svg";
import { ReactComponent as Mail } from "../../../svg/socials/Mail.svg";
import { ReactComponent as Facebook } from "../../../svg/socials/Facebook.svg";
import { ContactsInfo } from "../../localData";
import { useNavigate } from "react-router-dom";
export default function Footer() {
    const navigate = useNavigate();
    return (
        <div className="footer">
            <div className="content">
                <div className="logo">
                    {/* <img src="/src/img.png" alt="logo" /> */}
                    <Logo className="header-logo" />
                </div>

                <div className="links-block">
                    <ul className="menu">
                        <li
                            onClick={() => {
                                navigate("/retail");
                            }}
                        >
                            Роздріб
                        </li>
                        <li
                            onClick={() => {
                                navigate("/opt");
                            }}
                        >
                            Опт
                        </li>
                        <li
                            onClick={() => {
                                navigate("/about");
                            }}
                        >
                            Про нас
                        </li>
                        <li
                            onClick={() => {
                                navigate("/contacts");
                            }}
                        >
                            Контакти
                        </li>
                        <li
                            onClick={() => {
                                navigate("/vacancy");
                            }}
                        >
                            Вакансії
                        </li>
                    </ul>
                </div>

                <div className="links-block">
                    <ul className="menu">
                        <li
                            onClick={() => {
                                navigate("/general-info");
                            }}
                        >
                            Оплата
                        </li>
                        <li
                            onClick={() => {
                                navigate("/general-info/delivery");
                            }}
                        >
                            Доставка
                        </li>
                        <li
                            onClick={() => {
                                navigate("/general-info/guarantee");
                            }}
                        >
                            Гарантія
                        </li>
                        <li
                            onClick={() => {
                                navigate("/general-info/policy");
                            }}
                        >
                            Угода користувача
                        </li>
                    </ul>
                </div>

                <div className="call-block">
                    <div className="call">
                        <div className="head">Оптова торгівля</div>
                        <a href="tel:380674113691">
                            <Phone />
                            +38 067 411 36 91
                        </a>
                    </div>
                    <div className="call">
                        <div className="head">Торгові мережі/ дрібний опт</div>
                        <a href={ContactsInfo.phonePost}>
                            <Phone />
                            {ContactsInfo.phonePostLabel}
                        </a>
                    </div>
                </div>

                <div className="contact-block">
                    <ul>
                        <li>
                            <a href={ContactsInfo.facebook} target="_blank">
                                <Facebook /> Facebook
                            </a>
                        </li>
                        <li>
                            <a href={ContactsInfo.instagram} target="_blank">
                                <Instagram /> Instagram
                            </a>
                        </li>
                        <li>
                            <a href={`mailto:${ContactsInfo.mail}`}>
                                <Mail />
                                {ContactsInfo.mail}
                            </a>
                        </li>
                        <li>
                            <a href={`mailto:${ContactsInfo.mailRetail}`}>
                                <Mail />
                                {ContactsInfo.mailRetail}
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="address-block call-block">
                    <div className="call">
                        <div className="head">Адреса</div>
                        <a href="tel:">
                            Житомирська обл., Брусилівський р-н, с. Костівці,
                            вул. Польова 1
                        </a>
                    </div>
                </div>

                <div className="btm">
                    <img src="/src/mc_logo.png" alt="" className="mclogo" />
                    <img src="/src/np_logo.png" alt="" className="np_logo" />
                    <img src="/src/ukrposhta.svg" alt="" className="np_logo" />
                </div>
            </div>
        </div>
    );
}
