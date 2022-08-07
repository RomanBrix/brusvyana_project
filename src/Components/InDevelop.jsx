import {ReactComponent as BigLogo} from '../svg/BigLogo.svg';





export default function InDevelop() {
    return(
        <div className="in-develop">
            <div className="content">
                <div className="bg">
                    <BigLogo/>
                </div>
                <div className="text">
                    <h1>Сторінка знаходиться в розробці</h1>
                    <h3>ВИБАЧТЕ ЗА ТИМЧАСОВІ НЕЗРУЧНОСТІ</h3>
                </div>
            </div>
        </div>
    )
}