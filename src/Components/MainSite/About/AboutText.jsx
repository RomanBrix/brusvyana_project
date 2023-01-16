import { ReactComponent as BigLogo } from "../../../svg/BigLogo.svg";

export default function AboutText({ translate }) {
    return (
        <div className="about-main about-main-text">
            <div className="content">
                <div className="bg">
                    <BigLogo />
                </div>
                <div className="text-content">
                    <h1>{translate.head}</h1>
                    <div className="head">{translate.miniHead}</div>
                    <p>{translate.text1}</p>
                    <div className="head">{translate.minihead2}</div>
                    <p>{translate.text2}</p>
                    <p>{translate.text22}</p>
                    <div className="imgs">
                        <img src="/src/about/selection1.jpg" alt="" />
                        <img src="/src/about/selection2.jpg" alt="" />
                        <img src="/src/about/selection3.jpg" alt="" />
                    </div>
                    <div className="head">{translate.minihead3}</div>
                    <p>{translate.text31}</p>
                    <p>{translate.text32}</p>
                    <p>{translate.text33}</p>
                    <p>{translate.text34}</p>
                    <p>{translate.text35}</p>
                    <div className="imgs">
                        <img src="/src/about/history1.jpg" alt="" />
                        <img src="/src/about/history2.jpg" alt="" />
                        <img src="/src/about/history3.jpg" alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
}
