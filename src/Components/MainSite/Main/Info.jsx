import { ReactComponent as Leaf } from "../../../svg/Leaf.svg";
import { ReactComponent as LeafRight } from "../../../svg/LeafRight.svg";
import { ReactComponent as LeafPattern } from "../../../svg/LeafPattern.svg";

import Half_bg_right from "./src/half_bg_right.jpg";

export default function Info({ translate }) {
    return (
        <div className="main-info">
            <div className="content">
                <div className="half">
                    <div className="bg bg-svg">
                        <LeafPattern />
                    </div>
                    <div className="half-content">
                        <div className="head">{translate.headLeft}</div>

                        <div className="text-blocks">
                            <p>{translate.leftParagraph[0]}</p>
                            <Leaf />
                            <p>{translate.leftParagraph[1]}</p>
                            <Leaf />
                            <p>{translate.leftParagraph[2]}</p>
                            <Leaf />
                            <p>{translate.leftParagraph[3]}</p>
                            <Leaf />
                            <p>{translate.leftParagraph[4]}</p>
                            <Leaf />
                            <p>{translate.leftParagraph[5]}</p>
                            <Leaf />
                            <p>{translate.leftParagraph[6]}</p>
                        </div>
                    </div>
                </div>
                <div className="half">
                    <div
                        className="bg bg-img"
                        style={{ backgroundImage: `url(${Half_bg_right})` }}
                    />
                    <div className="half-content sec-half-content">
                        {/* <div className="head">{translate.headRight}</div> */}
                        <div className="center-img">{/* <LeafRight /> */}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
