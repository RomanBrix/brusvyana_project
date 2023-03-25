import { useParams } from "react-router-dom";

export default function OrderSuccess() {
    const { id } = useParams();
    return (
        <div className="order-success order-final-msg">
            <h1>Спасибі за замовлення!</h1>
            <h3>
                Номер вашого замовлення: <b>{id}</b>
            </h3>
            <p>
                Найближчим часом із Вами зв'яжеться наш менеджер для уточнення
                деталей замовлення.
            </p>
        </div>
    );
}
