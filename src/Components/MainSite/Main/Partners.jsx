import { ReactComponent as LeafPattern } from "../../../svg/LeafPattern.svg"
import { ReactComponent as Deal } from "../../../svg/Deal.svg"
import { ReactComponent as ArrowRight } from "../../../svg/ArrowRight.svg"
import { partners } from "../../localData"
import { useNavigate } from "react-router-dom"




export default function Partners() {
    const navigate = useNavigate();

    return(
        <div className="main-partners main-info">
            <div className="content">
                <div className="half">
                    <div className="bg bg-svg">
                        <LeafPattern/>
                    </div>
                    <div className="half-content">
                        <div className="head">Партнери</div>

                        <div className="text-blocks">
                            <p>За час існування Брусвяна ми співпрацювали з багатьма компаніями та побудували міцні відносини з більшістю партнерів</p>
                            <Deal/>
                            <p>Маємо позитивний досвід співпраці з компаніями в аграрній,  аграрній та аграрній галузях</p>
                            <Deal/>
                            <p>За рахунок своєчасного виконання покладених на нас обов’язків та задач </p>
                            <Deal/>
                            <p>Текст Текст Текст Текст Текст Текст Текст Текст Текст </p>
                        </div>
                        <div className="btn btn-more" onClick={()=>{navigate('/partners')}}>Дізнатись більше <ArrowRight/> </div>
                    </div>
                </div>

                <div className="half">
                    <div className="partner-blocks">
                        {renderBlocks(partners)}
                    </div>
                </div>
            </div>
        </div>
    )

    function renderBlocks(blocks) {
        
        return blocks.map((block, index) => {
            return <div className="partner-block" key={index}>
                <img src={`/src/${block.logo}`} alt={block}/>
            </div>
        })
    }

}