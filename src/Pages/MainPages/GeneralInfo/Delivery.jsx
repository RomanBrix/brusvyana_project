import useMainTranslate from "../../../Components/hook/useMainTranslate";

export default function Delivery() {
    const { getLanguageBlock } = useMainTranslate();

    const { delivery } = getLanguageBlock("Documents");

    return (
        <div className="general-info-text">
            <h1>{delivery.head}</h1>
            <p>{delivery.text}</p>
            {rendList(delivery.list)}
        </div>
    );

    function rendList(list) {
        const mainList = list.map((item, index) => {
            return <li key={index}>{item}</li>;
        });

        return <ol>{mainList}</ol>;
    }
}
