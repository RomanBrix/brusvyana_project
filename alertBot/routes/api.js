const BotUser = require("../models/BotUser");
const BOT = require("../botSettings");

// const { verifyUser, verifyAdmin } = require("./verifyToken");

const router = require("express").Router();

//лень добавлять проверку на токены
router.get("/users", async (req, res) => {
    try {
        const users = await BotUser.find({}).lean();
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.delete("/user", async (req, res) => {
    // console.log();
    const { id } = req.query;
    try {
        if (!id) throw new Error("xx");
        await BotUser.findOneAndRemove({ id: id });
        await BOT.telegram.sendMessage(id, `Вас удалили с бота! Пока`);

        res.status(200).json({ status: true });
    } catch (err) {
        console.log(err);
        if (err.code === 400) {
            return res.status(200).json({
                status: true,
                msg: "Chat is not active or no user with this id",
            });
        }
        res.status(500).json({ status: false, msg: err });
    }
});

router.post("/user", async (req, res) => {
    const { id } = req.body;
    try {
        if (!id) throw new Error("xx");
        const chat = await BOT.telegram.getChat(id);
        const username = chat.username
            ? "@" + chat.username
            : chat.first_name + " " + chat.last_name;
        await BotUser.create({
            id,
            username,
        });
        await BOT.telegram.sendMessage(id, `Вас добавили в бот!`);
        // console.log(chat);
        res.status(200).json({ status: true });
    } catch (err) {
        console.log(err.code);
        if (err.code === 400) {
            return res.status(200).json({
                status: false,
                msg: "Chat is not active or no user with this id",
            });
        } else if (err.code === 11000) {
            return res.status(200).json({
                status: false,
                msg: "User is already added",
            });
        }
        res.status(500).json(err);
    }

    return res.status(200);
});

router.post("/info", async (req, res) => {
    const { msg } = req.body;

    try {
        await sendMsgToAdmins(msg);
        res.status(200).json(true);
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.post("/newOrder", async (req, res) => {
    const orderId = req.body.id;
    const client = req.body.user || req.body.guestUser;
    const { paymanetMethod, deliveryMethod, totalPrice, products } = req.body;
    const delivery = getDeliveryName(deliveryMethod);
    const pay = getPayName(paymanetMethod);
    const msgProducts = products
        .map((product) => {
            const str = `${product.title} ${
                product?.variants && product.variants.length > 0
                    ? `[ ${product.varTitle} ]`
                    : ""
            } - ${product.quantity} шт. (${product.price} грн.)`;
            return replaceDots(str);
        })
        .join("\n");

    const msg = `
Новый заказ № *__${orderId}__*

Сумма: __${totalPrice}__ грн

Доставка: *${delivery}*

Оплата: *${pay}*

Клиент:

    Имя: *${client.name}* *${client.secondName}*
    Телефон: [${replaceDots(client.phone)}](tel:${replaceDots(client.phone)})
    Адрес: *${replaceDots(client.town || "") || "\\-"} ${
        replaceDots(client.address || "") || "\\-"
    }*

Товары:

${msgProducts}
`;

    // console.log(alertsId);

    try {
        // for (let i = 0; i < alertsId.length; i++) {
        //     BOT.telegram.sendMessage(alertsId[i], msg, {
        //         parse_mode: "MarkdownV2",
        //     });
        // }
        await sendMsgToAdmins(msg);
        // BOT.telegram.sendMessage('5775759209', msg, {parse_mode: 'MarkdownV2'})
        res.status(200).json(true);
    } catch (e) {
        res.status(500).json(e);
    }
});

function getDeliveryName(delivery) {
    switch (delivery) {
        case "courier":
            return "Курьер";
        case "novaPochta":
            return "Нова Пошта";
        case "self":
            return "Самовывоз";
        case "ukrpochta":
            return "Укра почта";
        default:
            return "Неизвестно";
    }
}
function getPayName(pay) {
    switch (pay) {
        case "cash":
            return "Наличные";
        case "card":
            return "Карта";
        default:
            return "Неизвестно";
    }
}

async function sendMsgToAdmins(msg) {
    try {
        if (!msg) throw new Error("xx");
        const users = await BotUser.find({}, "id").lean();
        users.forEach((user) => {
            BOT.telegram.sendMessage(user.id, msg, {
                parse_mode: "MarkdownV2",
                disable_web_page_preview: true,
            });
        });
        // console.log(users);
        return true;
    } catch (err) {
        console.log(err);
        return err;
    }
}

function replaceDots(str = "неизвестно") {
    if (typeof str !== "string") str = str + "";
    const specialChars = "|()*#.!_[]`~+-={}"; // Список специальных символов
    let result = "";

    for (let i = 0; i < str.length; i++) {
        if (specialChars.includes(str[i])) {
            result += "\\"; // Добавляем символ "\\" перед специальным символом
            // result += "\\"; // Добавляем символ "\\" перед специальным символом
        }
        result += str[i];
    }

    return result;
}

module.exports = router;
