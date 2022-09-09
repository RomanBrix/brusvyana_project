import { useState, useEffect } from "react";
import StatPageOrders from "../../Admin/Stats/orders";
import { createUserAxiosRequest } from "../../requestMethods";




export default function StatPage() {
    const [orders, setOrders] = useState([]);
    const userRequestRetail = createUserAxiosRequest();
    
    
    useEffect(()=>{
        getOrdersData()
        // eslint-disable-next-line
    },[])

    console.log(orders);
    return(
        <div className="admin admin-stat admin-right-content">
            <div className="content">
                <StatPageOrders  orders={orders}/>
            </div>
        </div>
    )


    function getOrdersData(){
        userRequestRetail.get('/orders/orders').then(res=>{
            setOrders(res.data)
        }).catch(err=>{
            console.log(err)
        })
    }
}