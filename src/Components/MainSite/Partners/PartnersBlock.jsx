import { partners } from "../../localData"
import { ReactComponent as ArrowRight } from "../../../svg/ArrowRight.svg"



export default function PartnersBlock() {
    
    return (
        <div className="main-partners-blocks">
            <div className="content">
                <h1>Партнери</h1>
                <div className="partners-blocks">
                    {renderBlocks(partners)}
                </div>
            </div>
        </div>
    )
    function renderBlocks(blocks) {
        
        return blocks.map((block, index) => {
            return <div className="partner-block" key={index}>
                <div className="img">
                    <img src={`/src/${block.logo}`} alt={block}/>
                </div>
                <div className="text">
                    <div className="title">{block.name}</div>
                    <div className="description">{block.description}</div>
                </div>
                <div className="btns">
                    <div className="cupon">{block.cupon}</div>
                    <div className="btn" onClick={()=>{alert('ok')}}>Перейти <ArrowRight/> </div>
                </div>
            </div>
        })
    }
}