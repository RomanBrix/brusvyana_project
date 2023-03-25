import { ReactComponent as Arrow } from "../../../svg/ArrowRight.svg";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Phone } from "../../../svg/socials/Phone.svg";
import { ReactComponent as Instagram } from "../../../svg/socials/Instagram.svg";
import { ReactComponent as Mail } from "../../../svg/socials/Mail.svg";
import { ReactComponent as Facebook } from "../../../svg/socials/Facebook.svg";
import { ContactsInfo } from "../../localData";

export default function Intro({ translate }) {
    //const navigate = useNavig
    const navigate = useNavigate();
    return (
        <div className="main-intro">
            <div className="bgvideo">
                <video autoPlay muted loop id="bgVideo">
                    <source src="/src/bg.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="content">
                <div className="center">
                    <h1>{translate.title}</h1>
                    <div className="btns">
                        <div
                            className="btn"
                            onClick={() => {
                                navigate("/opt");
                            }}
                        >
                            {translate.btnWholesale} <Arrow />
                        </div>
                        <div
                            className="btn"
                            onClick={() => {
                                navigate("/retail/products");
                            }}
                        >
                            {translate.btnRetail} <Arrow />
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="social-block">
                        <a href={ContactsInfo.phonePost}>
                            <Phone />
                            <span>{ContactsInfo.phonePostLabel}</span>
                        </a>
                    </div>
                    <div className="social-block">
                        <a href={ContactsInfo.phone}>
                            <Phone />
                            <span>{ContactsInfo.phoneLabel}</span>
                        </a>
                    </div>
                    <div className="social-block">
                        <a
                            href={ContactsInfo.facebook}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Facebook />

                            <span>Facebook</span>
                        </a>
                    </div>
                    <div className="social-block">
                        <a
                            href={ContactsInfo.instagram}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Instagram />
                            <span>Instagram</span>
                        </a>
                    </div>
                    <div className="social-block">
                        <a href={`mailto:${ContactsInfo.mail}`}>
                            <Mail />
                            <span>{ContactsInfo.mail}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
