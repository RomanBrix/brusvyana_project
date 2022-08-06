import { ReactComponent as LeafPattern } from "../../../svg/LeafPattern.svg"

import { ReactComponent as First } from "../../../svg/infoblocks/First.svg"
import { ReactComponent as Second } from "../../../svg/infoblocks/Second.svg"
import { ReactComponent as Third } from "../../../svg/infoblocks/Third.svg"


export default function InfoBlocks() {
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
                            <div className="head">2 000 000</div>
                            <div className="add">рослин вирощено в рік</div>
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
                            <div className="head">200</div>
                            <div className="add">сортів в колекції</div>
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
                            <div className="head">1000 гектарів</div>
                            <div className="add">наших рослин в Україні</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}