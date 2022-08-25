import { botPublicRequest } from "../requestMethods"


async function sendAceptedOrder(order, answer) {
    // console.log(dispatch);
    try{
        const send = await botPublicRequest.post('/newOrder',order);
        console.log(send);
        answer(send.data)
    }catch(err){
        console.log(err)
    }
  }


  export { sendAceptedOrder}
