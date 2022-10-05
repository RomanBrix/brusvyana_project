import { ReactComponent as LeafPattern } from "../../../svg/LeafPattern.svg"

import { ReactComponent as First } from "../../../svg/infoblocks/First.svg"
import { ReactComponent as Second } from "../../../svg/infoblocks/Second.svg"
import { ReactComponent as Third } from "../../../svg/infoblocks/Third.svg"


export default function InfoBlocks({translate}) {
    return(
        <div className="main-info-blocks">
            <div className="content">


                <div className="block">
                    <div className="bg">
                        <LeafPattern/>
                    </div>
                    <div className="block-content">
                        <div className="logo">
                            <First/>
                        </div>
                        <div className="text">
                            <div className="head">{translate.block1.text} </div>
                            <div className="add"> {translate.block1.title}</div>
                        </div>
                    </div>
                </div>


                <div className="block">
                    <div className="bg">
                        <LeafPattern/>
                    </div>
                    <div className="block-content">
                        <div className="logo">
                            <Second/>
                        </div>
                        <div className="text">
                            <div className="head">{translate.block2.text} </div>
                            <div className="add">{translate.block2.title}</div>
                        </div>
                    </div>
                </div>


                <div className="block">
                    <div className="bg">
                        <LeafPattern/>
                    </div>
                    <div className="block-content">
                        <div className="logo">
                            <Third/>
                        </div>
                        <div className="text">
                            <div className="head">{translate.block3.text} </div>
                            <div className="add">{translate.block3.title}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}