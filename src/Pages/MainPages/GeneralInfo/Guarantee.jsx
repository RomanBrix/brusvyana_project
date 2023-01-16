import useMainTranslate from "../../../Components/hook/useMainTranslate";

export default function Guarantee() {
    const { getLanguageBlock } = useMainTranslate();
    const { refund } = getLanguageBlock("Documents");

    return (
        <div className="general-info-text">
            <h1>{refund.head} </h1>
            <p>{refund.text}</p>
            {rendList(refund.list)}
        </div>
    );

    function rendList(list) {
        const mainList = list.map((item, index) => {
            return <li key={index}>{item}</li>;
        });

        return <ol>{mainList}</ol>;
    }
}
