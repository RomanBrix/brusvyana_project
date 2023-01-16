import useMainTranslate from "../../../Components/hook/useMainTranslate";

export default function Policy() {
    const { getLanguageBlock } = useMainTranslate();
    const { policy } = getLanguageBlock("Documents");

    return (
        <div className="general-info-text">
            <h1>{policy.head}</h1>
            {createContent()}

            <h2>{policy.reqi.head}</h2>
            <ul>
                <li>{policy.reqi.fop}</li>
                <li>{policy.reqi.ipn}</li>
                <li>{policy.reqi.iban}</li>
            </ul>
        </div>
    );

    function createContent() {
        const content = [];
        for (let i in policy) {
            // console.log(i.includes("block"));

            if (i.includes("block")) {
                const block = [];
                block.push(<h2 key={"head"}>{policy[i].head}</h2>);

                const MainList = policy[i].list.map((item, index) => {
                    if (typeof item === "string") {
                        return <li key={index}>{item}</li>;
                    } else {
                        const miniList = [];
                        for (let a = 0; a < item.length; a++) {
                            miniList.push(
                                <li key={a + item.length + 100}>{item[a]}</li>
                            );
                        }

                        return <ol key={index}>{miniList}</ol>;
                    }
                });
                block.push(<ol key={"contentList"}>{MainList}</ol>);

                content.push(block);
            }
        }
        return content;
    }
}
