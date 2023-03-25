import { useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import StatPageOrders from "../../Admin/Stats/orders";
import SingleOrder from "../../Admin/Stats/SingleOrder";
import { logoutUser } from "../../Redux/UserApi";
import { createUserAxiosRequest } from "../../requestMethods";

export default function StatPage() {
    const [orders, setOrders] = useState([]);
    const userRequestRetail = createUserAxiosRequest();
    const dispatch = useDispatch();
    // console.log(orders);
    return (
        <div className="admin admin-stat admin-right-content">
            <div className="content">
                <Routes>
                    <Route
                        index
                        element={
                            <StatPageOrders
                                orders={orders}
                                getOrdersData={getOrdersData}
                            />
                        }
                    />
                    <Route path=":id" element={<SingleOrder />} />
                </Routes>
                {/* <StatPageOrders  orders={orders}/> */}
            </div>
        </div>
    );

    function getOrdersData() {
        userRequestRetail
            .get("/orders/orders")
            .then((res) => {
                setOrders(res.data);
            })
            .catch((err) => {
                console.log(err);
                if (err.response.data === "Token is not valid!") {
                    logoutUser(dispatch);
                }
            });
    }
}
