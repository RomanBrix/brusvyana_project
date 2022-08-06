import { ReactComponent as Leaf } from "../../../svg/Leaf.svg"
import { ReactComponent as LeafRight } from "../../../svg/LeafRight.svg"
import { ReactComponent as LeafPattern } from "../../../svg/LeafPattern.svg"

import  Half_bg_right from "./src/half_bg_right.png"




export default function Info() {
    return (
        <div className="main-info">
            <div className="content">
                <div className="half">
                    <div className="bg bg-svg">
                        <LeafPattern/>
                    </div>
                    <div className="half-content">
                        <div className="head">Масштабний підхід та якість перевірена роками</div>

                        <div className="text-blocks">
                            <p>Брусвяна - розсадник ягідних культур з понад 15-річним досвідом роботи. Займаємося оптовою та роздрібною торгівлею по всій Україні.</p>
                            <Leaf/>
                            <p>Розпочали роботу у 2005 році. Одними з перших почали розвивати популярну нині культуру - лохину високорослу. </p>
                            <Leaf/>
                            <p>Надаємо комплексну підтримку клієнту для забезпечення гарного результату, від вибору культури та сорту до агротехнічних заходів.</p>
                            <Leaf/>
                            <p>Основними культурами виробництва є лохина високоросла, малина ремонтантна, суниця альпійська.</p>
                        </div>
                    </div>
                </div>
                <div className="half">
                    <div className="bg bg-img" style={{backgroundImage: `url(${Half_bg_right})`}}/>
                    <div className="half-content sec-half-content">
                        <div className="head">16 років успішної роботи на ринку України та за її межами</div>
                        <div className="center-img">
                            <LeafRight/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}