import {ReactComponent as BigLogo} from '../../../svg/BigLogo.svg';






export default function  AboutText() {
    return(
        <div className="about-main about-main-text">
            <div className="content">
                <div className="bg">
                    <BigLogo/>
                </div>
                <div className="text-content">
                    <h1>Про нас</h1>
                    <div className="head">
                        Текст про компанію
                    </div>
                    <p>Розсадник Брусвяна з 2005 року вирощує садивний матеріал лохини високорослої, малини ремонтантної, суниці альпійської та інших ягідних культур. Починаючи з 50 соток протягом 15 років розсадник збільшив площу до 3 га. Активно розвиваємо напрямок селекції та маємно власних 10 сортів занесених до реєстру України...</p>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste, magnam obcaecati sed vero temporibus deleniti eveniet non fugiat quod dolorem. Error saepe magnam doloremque mollitia?</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat eveniet qui quo amet cumque sit in, ab similique hic at nulla, aliquam eos odit accusantium.</p>
                </div>
            </div>
        </div>
    )
}