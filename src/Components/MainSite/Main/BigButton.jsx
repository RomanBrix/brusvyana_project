import { ReactComponent as LeafBtnPatternOne } from "../../../svg/LeafBtnPatternOne.svg";
import { ReactComponent as LeafBtnPatternTwo } from "../../../svg/LeafBtnPatternTwo.svg";

import { ReactComponent as ArrowRight } from "../../../svg/ArrowRight.svg";
import { useNavigate } from "react-router-dom";

export default function BigButton({ translate }) {
    const navigate = useNavigate();
    return (
        <div className="main-big-button">
            <div className="content">
                <div className="half">
                    <div className="bg">
                        <LeafBtnPatternTwo className="big" />
                        <LeafBtnPatternTwo className="small" />
                    </div>
                    <div className="half-content">
                        <div className="head">{translate.btnWholesale}</div>
                        <div
                            className="btn"
                            onClick={() => {
                                navigate("/opt");
                            }}
                        >
                            {translate.click} <ArrowRight />
                        </div>
                    </div>
                </div>
                <div className="half">
                    <div className="bg">
                        <LeafBtnPatternOne className="big" />
                        <LeafBtnPatternOne className="small" />
                    </div>
                    <div className="half-content">
                        <div className="head">{translate.btnRetail}</div>
                        <div
                            className="btn"
                            onClick={() => {
                                navigate("/retail/products");
                            }}
                        >
                            {translate.click} <ArrowRight />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
