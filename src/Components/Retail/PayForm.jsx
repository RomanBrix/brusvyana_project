import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendAceptedOrder } from "../../Redux/botApi";
import { __AcceptOrder } from "../../Redux/cartApi";
import NovaPochta from "./NovaPochta";

export default function PayForm({ totalPrice, products, user }) {
    const [deliveryOption, setDeliveryOption] = useState(user.delivery || "");
    const [payOption, setPayOption] = useState(user.payment || null);
    const [orderId] = useState(generateId());

    const [novaPochtaSelected, setNovaPochtaSelected] = useState({
        city: null,
        warehouse: null,
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // console.log(user)

    const [userFields, setUserFields] = useState({
        name: user.user?.name || "",
        secondName: user.user?.secondName || "",
        phone: user.user?.phone || "",
    });
    const [courierFields, setCourierFields] = useState({
        town: user.user?.town || "",
        address: user.user?.address || "",
    });

    return (
        <div className="payform">
            <div className="user-form block-form">
                <div className="title">Ваші контактні дані</div>
                <div className="form-group">
                    <input
                        type="text"
                        className="text-input"
                        id="secondName"
                        placeholder="Прізвище"
                        name="secondName"
                        onChange={changeUserFieldData}
                        value={userFields.secondName}
                    />
                    <input
                        type="text"
                        className="text-input"
                        id="name"
                        placeholder="Ім'я"
                        name="name"
                        onChange={changeUserFieldData}
                        value={userFields.name}
                    />
                </div>
                <div className="one-input">
                    <input
                        type="text"
                        className="text-input"
                        id="phone"
                        placeholder="Телефон"
                        name="phone"
                        onChange={changeUserFieldData}
                        value={userFields.phone}
                    />
                </div>
            </div>

            <div className="delivery-form block-form">
                <div className="title"> Доставка </div>
                <div
                    className="select-form select-delivery"
                    onChange={changeDeliveryOption}
                >
                    <div className="del box">
                        <label htmlFor="novaPochta">Нова Пошта</label>
                        <input
                            type="radio"
                            value="novaPochta"
                            defaultChecked={deliveryOption === "novaPochta"}
                            id="novaPochta"
                            name="delivery"
                        />
                    </div>

                    <div className="del box">
                        <label htmlFor="self">Самовивіз</label>
                        <input
                            type="radio"
                            value="self"
                            defaultChecked={deliveryOption === "self"}
                            id="self"
                            name="delivery"
                        />
                    </div>
                    {+totalPrice > 5000 ? (
                        <div className="del box">
                            <label htmlFor="courier">Кур'єрська доставка</label>
                            <input
                                type="radio"
                                value="courier"
                                defaultChecked={deliveryOption === "courier"}
                                id="courier"
                                name="delivery"
                            />
                        </div>
                    ) : (
                        ""
                    )}
                </div>
                <div className="delivery-info">{getDeliveryOption()}</div>
            </div>

            <div className="block-form pay-form">
                <div className="title">Оплата</div>
                <div
                    className="select-pay select-form"
                    onChange={changePayOption}
                >
                    <div className="pay box">
                        <label htmlFor="cash">Післяоплата</label>
                        <input
                            type="radio"
                            defaultChecked={payOption === "cash"}
                            value="cash"
                            id="cash"
                            name="pay"
                        />
                    </div>
                    <div className="pay box">
                        <label htmlFor="card">Карткою</label>
                        <input
                            type="radio"
                            defaultChecked={payOption === "card"}
                            value="card"
                            id="card"
                            name="pay"
                        />
                    </div>
                </div>
            </div>

            {payOption && (
                <div
                    className="btn btn-pay"
                    onClick={() => {
                        tryPay();
                    }}
                >
                    {payOption === "card" ? "Оплатити" : "Замовити"}
                </div>
            )}
        </div>
    );

    function acceptOrder(status = "new") {
        if (totalPrice < 1) return;
        // alert('Ваше замовлення прийнято');

        const address = {
            town: null,
            address: null,
        };
        if (deliveryOption === "courier") {
            address.town = courierFields.town;
            address.address = courierFields.address;
        } else if (deliveryOption === "novaPochta") {
            address.town = novaPochtaSelected.city.label;
            address.address = novaPochtaSelected.warehouse.label;
        }
        const productsIds = products.map((product) => product._id);
        const variantsIds = products.map((product) => product.variants);

        const newOrder = {
            id: orderId,
            user: null,
            guestUser: {
                ...userFields,
                ...address,
            },
            status,
            productsWhenBuy: products,
            products: productsIds,
            variants: variantsIds,
            totalPrice: totalPrice,
            paymanetMethod: payOption,
            deliveryMethod: deliveryOption,
        };

        __AcceptOrder(dispatch, newOrder, (orderId) => {
            console.log(orderId);
            sendAceptedOrder(
                {
                    ...newOrder,
                    products: products,
                },
                (status) => {
                    console.log(status);
                    if (status && status.status !== "OK") {
                        // alert('Ваше замовлення прийнято');
                        navigate("../order-success/" + orderId);
                        // history.push('/');
                    } else if (status === "OK") {
                        alert(
                            "Помилка, замовлення прийнято, але не відправлено на модерацію"
                        );
                    } else {
                        alert("Помилка, замовлення не прийнято");
                    }
                }
            );
        });
    }
    function goPayCard() {
        if (totalPrice < 1) return;
        alert(
            "Оплата замовлення поки не доступна, оплатіть замовлення готівкою при отриманні"
        );

        // acceptOrder();
    }
    function tryPay() {
        //validate user fields
        const useValidate = validateUserFields();
        if (!useValidate) {
            alert("Введіть коректні дані");
            return;
        }
        const deliveryValidate = validateDeliveryOption();
        if (!deliveryValidate) {
            alert("Виберіть спосіб доставки");
            return;
        }

        switch (payOption) {
            case "cash":
                acceptOrder();
                break;
            case "card":
                goPayCard();
                break;
            default:
                alert("Виберіть спосіб оплати");
                break;
        }
    }

    function validateDeliveryOption() {
        switch (deliveryOption) {
            case "novaPochta":
                if (novaPochtaSelected.city && novaPochtaSelected.warehouse) {
                    return true;
                } else {
                    return false;
                }

            case "self":
                return true;
            case "courier":
                if (!courierFields.town || !courierFields.address) {
                    return false;
                }
                if (
                    courierFields.town.length < 3 ||
                    courierFields.address.length < 3
                ) {
                    return false;
                }
                return true;
            default:
                return false;
        }
    }

    function validateUserFields() {
        if (!userFields.name || !userFields.secondName || !userFields.phone) {
            return false;
        }
        if (
            userFields.name.length < 3 ||
            userFields.secondName.length < 3 ||
            userFields.phone.length < 3
        ) {
            return false;
        }
        return true;
    }

    function changeUserFieldData(e) {
        setUserFields({
            ...userFields,
            [e.target.name]: e.target.value,
        });
    }

    function changeCourierFieldsData(e) {
        setCourierFields({
            ...courierFields,
            [e.target.id]: e.target.value,
        });
    }

    function courierDelivery() {
        return (
            <>
                <div className="hint">
                    Оплата за доставку стягується окремо під час доставки.
                    Розрахунок вартості доставки здійснює менеджер
                </div>
                <div className="one-input">
                    <label htmlFor="town">Ваше місто</label>
                    <input
                        type="text"
                        className="text-input"
                        id="town"
                        placeholder="Ваше місто"
                        value={courierFields.town}
                        onChange={changeCourierFieldsData}
                    />
                </div>
                <div className="one-input">
                    <label htmlFor="adress">Вулиця та Будинок</label>
                    <input
                        type="text"
                        className="text-input"
                        id="address"
                        placeholder="Вулиця та Будинок"
                        value={courierFields.address}
                        onChange={changeCourierFieldsData}
                    />
                </div>
            </>
        );
    }
    function novaPochtaDelivery() {
        return (
            <NovaPochta
                selectCity={selectCity}
                selectWarehouse={selectWarehouse}
                novaPochtaSelected={novaPochtaSelected}
            />
        );
        function selectWarehouse(warehouse) {
            setNovaPochtaSelected((prev) => {
                return {
                    ...prev,
                    warehouse: warehouse,
                };
            });
        }
        function selectCity(city) {
            setNovaPochtaSelected({
                ...novaPochtaSelected,
                city,
            });
        }
    }

    function selfDelivery() {
        const mapLink =
            "https://www.google.com/maps?ll=50.326674,29.543087&z=16&t=m&hl=ru&gl=UA&mapclient=embed&q=%D0%B2%D1%83%D0%BB%D0%B8%D1%86%D1%8F+%D0%9F%D0%BE%D0%BB%D1%8C%D0%BE%D0%B2%D0%B0,+1+%D0%9A%D0%BE%D1%81%D1%82%D1%96%D0%B2%D1%86%D1%96+%D0%96%D0%B8%D1%82%D0%BE%D0%BC%D0%B8%D1%80%D1%81%D1%8C%D0%BA%D0%B0+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C+12613";

        return (
            <div className="address">
                <div className="hint">Ваше замовлення буде чекати на Вас!</div>
                Наша адреса: <br />
                <a href={mapLink} target="_blank" rel="noreferrer">
                    Житомирська обл., Брусилівський р-н, с. Костівці, вул.
                    Польова 1
                </a>
            </div>
        );
    }

    function getDeliveryOption() {
        switch (deliveryOption) {
            case "courier":
                return courierDelivery();
            case "novaPochta":
                return novaPochtaDelivery();
            case "self":
                return selfDelivery();
            default:
                return "";
        }
    }

    function changePayOption(e) {
        // console.log(e.target.value);
        setPayOption(e.target.value);
    }

    function changeDeliveryOption(e) {
        // console.log(e.target.value);
        setDeliveryOption(e.target.value);
    }

    function generateId(length = 5) {
        let result = "";
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let numbers = "0123456789";
        let charactersLength = characters.length;
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );

        for (let i = 0; i < length; i++) {
            result += numbers.charAt(
                Math.floor(Math.random() * numbers.length)
            );
        }
        return result;
    }
}
