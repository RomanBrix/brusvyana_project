import { ReactComponent as LeafPattern } from "../../../svg/LeafPattern.svg"
import { ReactComponent as Deal } from "../../../svg/Deal.svg"
import { ReactComponent as ArrowRight } from "../../../svg/ArrowRight.svg"
import { partners } from "../../localData"
import { useNavigate } from "react-router-dom"




export default function Partners({translate}) {
    const navigate = useNavigate();

    return(
        <div className="main-partners main-info">
            <div className="content">
                <div className="half">
                    <div className="bg bg-svg">
                        <LeafPattern/>
                    </div>
                    <div className="half-content">
                        <div className="head">{translate.head}</div>

                        <div className="text-blocks">
                            <p>{translate.text[0]}</p>
                            <Deal/>
                            <p>{translate.text[1]}</p>
                            <Deal/>
                            <p>{translate.text[2]}</p>
                            <Deal/>
                            <p>{translate.text[3]}</p>
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