

export default function Pay() {
    return (
        <div className="general-info-text">
            <h1>Оплата</h1>
            
            <p>Оплата карткою при доставці кур'єром магазину можлива лише у випадку, якщо заявка була оформлена з авторизацією на сайті чи в додатку.</p>
            <p>Щоб оплатити замовлення при доставці кур'єром</p>
            <ul>
                <li>При оформленні заявки виберіть тип оплати "Оплата при отриманні товару".</li>
                <li>Заповніть решту даних для замовлення і натисніть "Замовлення підтверджую".</li>
                <li>Під час доставки замовлення, зчитайте QR-код з мобільного додатку кур'єра і підтвердьте оплату на своєму мобільному пристрої.</li>
                <li>Чек про оплату можна завантажити лише на сторінці замовлення в особистому кабінеті. Паперовий чек в такому випадку не надається.</li>
            </ul>
            
            <p>Зверніть увагу: такий спосіб оплати можливий лише при повній оплаті замовлення.</p>
            <p>Часткова оплата у разі відмови від товару поки неможлива. В такому разі, замовлення необхідно буде оплатити готівкою.</p>
            <p>Вартість замовлення не може перевищувати 149 999 грн.</p>
            <p>Також, поки не можна оплатити карткою при доставці товари з розділу алкогольні та тютюнові вироби.</p>
        </div>
    )
}