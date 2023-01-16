import Info from "../../Components/MainSite/Main/Info";
import InfoBlocks from "../../Components/MainSite/Main/InfoBlocks";
import Intro from "../../Components/MainSite/Main/Intro";
import BigButton from "../../Components/MainSite/Main/BigButton";
import Partners from "../../Components/MainSite/Main/Partners";
import useMainTranslate from "../../Components/hook/useMainTranslate";

export default function MainPage() {
    const { getLanguageBlock } = useMainTranslate();
    const translateText = getLanguageBlock("MainPage");
    // console.log(translateText);
    return (
        <>
            <Intro translate={translateText.intro} />
            <Info translate={translateText.info} />
            <InfoBlocks translate={translateText.infoBlocks} />
            <BigButton translate={translateText.bigBtns} />
            {/* <Partners translate={translateText.partners}/> */}
        </>
    );
}
