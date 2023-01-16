import { ReactComponent as BigLogo } from "../svg/BigLogo.svg";
import useMainTranslate from "./hook/useMainTranslate";

export default function InDevelop() {
    const { getLanguageBlock } = useMainTranslate();
    const translate = getLanguageBlock("msgs");

    return (
        <div className="in-develop">
            <div className="content">
                <div className="bg">
                    <BigLogo />
                </div>
                <div className="text">
                    <h1>{translate.inDevelop}</h1>
                    <h3>{translate.sorry}</h3>
                </div>
            </div>
        </div>
    );
}
