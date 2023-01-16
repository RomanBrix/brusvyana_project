import useMainTranslate from "../../Components/hook/useMainTranslate";
import AboutText from "../../Components/MainSite/About/AboutText";
import Team from "../../Components/MainSite/About/Team";

export default function About() {
    const { getLanguageBlock } = useMainTranslate();

    const translateText = getLanguageBlock("About");
    return (
        <>
            <AboutText translate={translateText.aboutText} />
            <Team translate={translateText.team} />
        </>
    );
}
