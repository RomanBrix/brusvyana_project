import useMainTranslate from "../../../Components/hook/useMainTranslate";

export default function Pay() {
    const { getLanguageBlock } = useMainTranslate();

    const { pay } = getLanguageBlock("Documents");

    return (
        <div className="general-info-text">
            <h1>{pay.head}</h1>
            {rendList(pay.list)}
        </div>
    );

    function rendList(list) {
        const mainList = list.map((item, index) => {
            return <li key={index}>{item}</li>;
        });

        return <ol>{mainList}</ol>;
    }
}
