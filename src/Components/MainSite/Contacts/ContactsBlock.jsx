import { ReactComponent as BigLogo } from "../../../svg/BigLogo.svg";
import { ReactComponent as Phone } from "../../../svg/socials/Phone.svg";

import { ReactComponent as Instagram } from "../../../svg/socials/Instagram.svg";
import { ReactComponent as Mail } from "../../../svg/socials/Mail.svg";
import { ReactComponent as Facebook } from "../../../svg/socials/Facebook.svg";
import { ContactsInfo } from "../../localData";

export default function ContactsBlock({ translate }) {
    const mapLink =
        "https://www.google.com/maps?ll=50.326674,29.543087&z=16&t=m&hl=ru&gl=UA&mapclient=embed&q=%D0%B2%D1%83%D0%BB%D0%B8%D1%86%D1%8F+%D0%9F%D0%BE%D0%BB%D1%8C%D0%BE%D0%B2%D0%B0,+1+%D0%9A%D0%BE%D1%81%D1%82%D1%96%D0%B2%D1%86%D1%96+%D0%96%D0%B8%D1%82%D0%BE%D0%BC%D0%B8%D1%80%D1%81%D1%8C%D0%BA%D0%B0+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C+12613";

    return (
        <div className="contact-page">
            <div className="content">
                <div className="bg">
                    <BigLogo />
                </div>
                <div className="social-content">
                    <h1>{translate.head}</h1>
                    <div className="socials">
                        <ul>
                            <li>
                                <div className="call">
                                    <div className="head">
                                        {translate.smalPhone}
                                    </div>
                                    <a href={`${ContactsInfo.smallPhone}`}>
                                        <Phone /> {ContactsInfo.smallPhoneLabel}
                                    </a>
                                </div>
                            </li>
                            <li>
                                <div className="call">
                                    <div className="head">
                                        {translate.wholesale}
                                    </div>
                                    <a href={`${ContactsInfo.bigPhone}`}>
                                        <Phone /> {ContactsInfo.bigphoneLabel}
                                    </a>
                                </div>
                            </li>
                            <li>
                                <div className="call">
                                    <div className="head">
                                        {translate.retail}
                                    </div>
                                    <a href={ContactsInfo.phone}>
                                        <Phone /> {ContactsInfo.phoneLabel}
                                    </a>
                                </div>
                            </li>
                        </ul>

                        <ul>
                            <li>
                                <a href={ContactsInfo.facebook} target="_blank">
                                    <Facebook /> Facebook
                                </a>
                            </li>
                            <li>
                                <a
                                    href={ContactsInfo.facebook2}
                                    target="_blank"
                                >
                                    <Facebook /> Facebook
                                </a>
                            </li>
                            <li>
                                <a
                                    href={ContactsInfo.instagram}
                                    target="_blank"
                                >
                                    <Instagram /> Instagram
                                </a>
                            </li>
                            <li>
                                <a
                                    href={ContactsInfo.instagram2}
                                    target="_blank"
                                >
                                    <Instagram /> Instagram
                                </a>
                            </li>
                            <li>
                                <a href={`mail:${ContactsInfo.mail}`}>
                                    <Mail /> E-mail: {ContactsInfo.mail}
                                </a>
                            </li>
                            <li>
                                <div className="call">
                                    <div className="head">Адреса</div>
                                    <a
                                        href={mapLink}
                                        rel="noreferrer"
                                        target="_blank"
                                    >
                                        {translate.address}
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="map">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2547.137950673155!2d29.540898315940826!3d50.32667750415638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x472b5df6db88df4d%3A0xe89ec35ac99d8380!2z0LLRg9C70LjRhtGPINCf0L7Qu9GM0L7QstCwLCAxLCDQmtC-0YHRgtGW0LLRhtGWLCDQltC40YLQvtC80LjRgNGB0YzQutCwINC-0LHQu9Cw0YHRgtGMLCAxMjYxMw!5e0!3m2!1sru!2sua!4v1659867078124!5m2!1sru!2sua"
                            width="600"
                            height="450"
                            allowFullScreen=""
                            loading="lazy"
                            title="map"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
