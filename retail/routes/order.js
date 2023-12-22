const { default: axios } = require("axios");
const Order = require("../models/Order");

const router = require("express").Router();
const { verifyUser, verifyAdmin } = require("./verifyToken");

router.post("/newOrder", async (req, res) => {
    // console.log(req.body);
    try {
        // const { deliveryMethod } = req.body;
        let orderData = req.body;
        const order = new Order(req.body);

        if (orderData.deliveryMethod === "ukrpochta") {
            // console.log(orderData.guestUser);
            const price =
                orderData.paymanetMethod === "cash" ? orderData.totalPrice : 0;
            const ttn = await goUkrPochta(orderData.guestUser, price);
            console.log("tth is: ", ttn);

            if (!ttn || ttn === "ZIP") {
                await order.save();
                throw new Error(ttn || "UKRGOVNO");
            }
            order.ttn = ttn.barcode;
            order.notes.push({
                text: `Barcode: ${ttn.barcode} || Ship ID: ${ttn.shipId} || Доставка: ${ttn.deliveryPrice}UAH || Постоплата (ком): ${ttn.postPayDeliveryPrice} UAH`,
                author: "UkrPochta_Bot",
            });
        }

        await order.save();
        res.status(200).send(order);
    } catch (err) {
        if (!(err instanceof Error)) {
            err = new Error(err);
        }
        // console.log(typeof err);
        // console.log(err);
        console.log(err);
        if (err.message === "ZIP") {
            return res
                .status(500)
                .send("Поштовий індекс вказано невірно, перевірте будь ласка");
        } else if (err.message === "UKRGOVNO") {
            return res
                .status(500)
                .send(
                    "Вибачте, але УкрПочта має збої в системі, виберіть інший тип доставки"
                );
        } else if (err?.code === 11000) {
            if (err.keyValue?.id) {
                return res.status(200).send(err.keyValue?.id);
            }
        } else {
            return res
                .status(500)
                .send("Помилка, будь ласка, дайте нам знати про неї");
        }
    }
});

router.get("/orders", verifyAdmin, async (req, res) => {
    // console.log("aasdasd");
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

        res.status(201).send(orders);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/order/:id", verifyAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).lean();
        res.status(201).send(order);
    } catch (err) {
        res.status(200).send({ message: "Order not found" });
    }
});

router.post("/note", verifyAdmin, async (req, res) => {
    const { id, note } = req.body;
    // console.log(note, id);
    try {
        const order = await Order.findById(id);
        if (order.notes) {
            order.notes.push(note);
        } else {
            order.notes = [note];
        }
        // console.log(order)
        await order.save();
        res.status(201).send(order);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.put("/order/:id", verifyAdmin, async (req, res) => {
    // console.log(req.body);
    // console.log(req.params.id);
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

async function goUkrPochta(userInfo, price = 0) {
    const zip = userInfo.town;
    const [street, building] = userInfo.address.split("/");

    const addAddressData = {
        postcode: zip,
        country: "UA",
        street: street,
        houseNumber: building,
    };
    // console.log(addAddressData);
    const ukrPostUrl = "https://dev.ukrposhta.ua/ecom/0.0.1/";
    const bearer = "Bearer 009df62f-17d9-392d-89d4-5f63d4ae8392";
    const token = "a0a2ff17-ebfb-4792-a85e-1bdf9b578ad3";
    // const senderAddressId = 5645121;
    // const senderId = "1b8946dd-b881-4e95-8222-409627fa9351"; //"uuid":
    const senderId = "5849f2ed-34d2-45fd-98f1-0bab708da338"; //"uuid": from postman

    const api = axios.create({
        baseURL: ukrPostUrl,
        headers: { Authorization: bearer },
        // rejectUnauthorized: false, // asdasdasdasdasd
    });
    try {
        const { data: newAddress } = await api.post(
            `addresses`,
            addAddressData
        );

        const { detailedInfo: addressDetailedInfo, id: addressId } = newAddress;

        const newClientData = {
            firstName: userInfo.name,
            lastName: userInfo.secondName,
            middleName: "Батькович",
            addressId: addressId,
            phoneNumber: userInfo.phone,
            type: "INDIVIDUAL",
        };
        const { data: newClient } = await api.post(
            `clients?token=${token}`,
            newClientData
        );
        const { uuid: clientId } = newClient;
        // console.log(newClient);
        console.log(addressDetailedInfo, addressId);
        console.log(clientId);
        //

        const shipData = {
            sender: { uuid: senderId },
            recipient: {
                uuid: clientId,
            },
            deliveryType: "W2W",
            paidByRecipient: true,
            postPay: price,
            type: "STANDARD",
            parcels: [
                {
                    declaredPrice: price,
                    weight: 1000,
                    length: 70,
                },
            ],
        };

        const { data: newShip } = await api.post(
            `shipments?token=${token}`,
            shipData
        );
        const {
            uuid: shipId,
            calculationDescription,
            barcode,
            deliveryPrice,
            postPayDeliveryPrice,
            returnDeliveryPrice,
        } = newShip;

        // console.log(newShip);
        return {
            shipId,
            calculationDescription,
            barcode,
            deliveryPrice,
            postPayDeliveryPrice,
            returnDeliveryPrice,
        };
    } catch (err) {
        console.log(err.response.data);
        if (
            err.response.data?.code === "UPE02002" ||
            err.response.data?.code === "UPE01002"
        ) {
            console.log("ZIP CODE ERROR");
            return "ZIP";
        } else {
            return "";
        }
    }
}

module.exports = router;
