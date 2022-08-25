import { publicRequestRetail } from "../requestMethods";
import { setProducts, loadingStart, acceptOrder } from "./cartRedux";



async function goSetProducts(dispatch, prodArray) {
    dispatch(loadingStart());
    // console.log(dispatch);
    try{

        dispatch(setProducts(prodArray))
        // setProducts(prodArray)
    }catch(err){
        console.log(err)
    }
  }

  async function __AcceptOrder(dispatch, order, answer) {
    // dispatch(loadingStart());
    // console.log(dispatch);
    console.log('order')
    // console.log(order)
    try{
        publicRequestRetail.post(`/orders/newOrder`, order)
        .then(res => {
            console.log(res.data)
            dispatch(acceptOrder({
                guestUser: res.data.guestUser,
                prefferedDeliveryMethod: res.data.deliveryMethod,
                prefferedPaymentMethod: res.data.paymanetMethod
            }))
            answer(res.data.id)
        })
        
        // dispatch(setProducts(prodArray))
        // setProducts(prodArray)
    }catch(err){
        console.log(err)
    }
  }



  export { goSetProducts, __AcceptOrder }
