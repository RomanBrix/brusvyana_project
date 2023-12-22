import { publicRequestRetail } from "../requestMethods";
import { setProducts, loadingStart, acceptOrder } from "./cartRedux";

async function goSetProducts(dispatch, prodArray) {
    dispatch(loadingStart());
    // console.log(dispatch);
    try {
        dispatch(setProducts(prodArray));
        // setProducts(prodArray)
    } catch (err) {
        console.log(err);
    }
}

async function __AcceptOrder(dispatch, order, answer) {
    // dispatch(loadingStart());
    // console.log(dispatch);
    // console.log('order')
    // console.log(order)
    try {
        const res = await publicRequestRetail.post(`/orders/newOrder`, order);
        //    console.log(res.data);
        dispatch(
            acceptOrder({
                guestUser: res.data.guestUser,
                prefferedDeliveryMethod: res.data.deliveryMethod,
                prefferedPaymentMethod: res.data.paymanetMethod,
            })
        );
        answer(res.data?.id || res.data);
        // .then((res) => {
        //     console.log(res.data);
        //     dispatch(
        //         acceptOrder({
        //             guestUser: res.data.guestUser,
        //             prefferedDeliveryMethod: res.data.deliveryMethod,
        //             prefferedPaymentMethod: res.data.paymanetMethod,
        //         })
        //     );
        //     answer(res.data.id);
        // });

        // dispatch(setProducts(prodArray))
        // setProducts(prodArray)
    } catch (err) {
        answer(false);
        // if (!(err instanceof Error)) {
        //     err = new Error(err);
        // }
        console.log(err);
        alert(
            err?.response?.data ||
                "Помилка! Дайте нам знати про неї, будь ласка"
        );
    }
}

export { goSetProducts, __AcceptOrder };
