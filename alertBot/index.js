const express = require("express");
const app = express();
const dotenv = require("dotenv");
// const mongoose = require("mongoose");
const cors = require("cors");
const BOT = require("./botSettings");
// const Markup = require('telegraf').Markup
// const markup = Extra.markdown()
// console.log(Markup)

const fs = require('fs')
const https = require('https');

// const userRoute = require("./routes/user");
// const authRoute = require("./routes/auth");
// const verify = require("./routes/verify");

dotenv.config();
const PORT = process.env.BOT_PORT || 5000;



app.use(cors());
app.use(express.json());

let alertsIdRaw = fs.readFileSync( __dirname + '/alerts.json');
let alertsId = JSON.parse(alertsIdRaw);
// console.log(alertsId)

app.post("/bot/newOrder", (req, res)=>{
    // console.log(req.body);
    const orderId = req.body.id;
    const client = req.body.user || req.body.guestUser;
    const { paymanetMethod, deliveryMethod, totalPrice, products } = req.body;
    const delivery = getDeliveryName(deliveryMethod);
    const pay = getPayName(paymanetMethod);
    const msgProducts = products.map(product => {
        const str =`${product.title} ${product.variants ? `[ ${product.varTitle} ]` : ''} - ${product.quantity} шт. (${product.price} грн.)`
        return  replaceDots(str);
    }).join('\n');

    const msg = `
Новый заказ № *__${orderId}__*

Сумма: __${totalPrice}__ грн

Доставка: *${delivery}*

Оплата: *${pay}*

Клиент:

    Имя: *${client.name}* *${client.secondName}*
    Телефон: [${replaceDots(client.phone)}](tel:${replaceDots(client.phone)})
    Адрес: *${replaceDots(client.town || '') || '\\-'} ${replaceDots(client.address || '') || '\\-'}*

Товары:

${msgProducts}
`

console.log(msg);

    try{
        for(let i = 0; i < alertsId.length; i++){
            BOT.telegram.sendMessage(alertsId[i], msg, {parse_mode: 'MarkdownV2'});
        }
        // BOT.telegram.sendMessage('5775759209', msg, {parse_mode: 'MarkdownV2'})
        res.status(200).json(true)
    }catch(e){
        res.status(500).json(e)
    }
});


//function to replace all dots in string with underscore
function replaceDots(str){
    let withoutDots =  str.replace(/\./g, '\\.');
    let withoutUnderscore = withoutDots.replace(/\_/g, '\\_');
    let withoutAsterisk = withoutUnderscore.replace(/\*/g, '\\*');
    let withoutDash = withoutAsterisk.replace(/\-/g, '\\-');
    let withoutOpenBracket = withoutDash.replace(/\(/g, '\\(');
    let withoutCloseBracket = withoutOpenBracket.replace(/\)/g, '\\)');
    let withoutOpenSquareBracket = withoutCloseBracket.replace(/\[/g, '\\[');
    let withoutCloseSquareBracket = withoutOpenSquareBracket.replace(/\]/g, '\\]');
    // console.log(withoutCloseSquareBracket);
    return withoutCloseSquareBracket;


}


function getDeliveryName(delivery){
    switch(delivery){
        case 'courier':
            return 'Курьер'
        case 'novaPochta':
            return 'Нова Пошта'
        case 'self':
            return 'Самовывоз'
        default:
            return 'Неизвестно'
    }
}
function getPayName(pay){
    switch(pay){
        case 'cash':
            return 'Наличные'
        case 'card':
            return 'Карта'
        default:
            return 'Неизвестно'
    }
}


if(process.env.DEVELOP === 'develop'){
  app.listen(PORT, () => {
    console.log("Bot is running! port:  " + PORT);
});
}
else{
//   console.log('HELLO')
//   console.log(PORT)
//   console.log(process.env.USER_MONGO_URL)
  var privateKey = fs.readFileSync( '../cert/key.pem' );
  var certificate = fs.readFileSync( '../cert/cert.pem' );

  https.createServer({
      key: privateKey,
      cert: certificate
  }, app).listen(PORT);
}