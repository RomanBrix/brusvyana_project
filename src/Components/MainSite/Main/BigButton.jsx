import { ReactComponent as LeafBtnPatternOne } from "../../../svg/LeafBtnPatternOne.svg"
import { ReactComponent as LeafBtnPatternTwo } from "../../../svg/LeafBtnPatternTwo.svg"

import { ReactComponent as ArrowRight } from "../../../svg/ArrowRight.svg"




export default function BigButton() {
    return(
        <div className="main-big-button">
            <div className="content">
                <div className="half">
                    <div className="bg">
                        <LeafBtnPatternOne className='big'/>
                        <LeafBtnPatternOne className='small'/>
                    </div>
                    <div className="half-content">
                        <div className="head">Роздрібні пропозиції від Брусвяна</div>
                        <div className="btn">Переглянути <ArrowRight/></div>

                    </div>
                </div>
                <div className="half">
                    <div className="bg">
                        <LeafBtnPatternTwo className='big'/>
                        <LeafBtnPatternTwo className='small'/>
                    </div>
                    <div className="half-content">
                        <div className="head">Оптові пропозиції від Брусвяна</div>
                        <div className="btn">Переглянути <ArrowRight/></div>
                    </div>
                </div>
            </div>
        </div>
    )
}