import { useState, useEffect } from "react";
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
        <div className="admin admin-stat">
            <div className="content">
                <h1>Statistic</h1>
                <div className="tableOfOrders">
                    <table>
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Дата</th>
                                <th>Сумма</th>
                                <th>Статус</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderOrders()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )


    function renderOrders(){
        return orders.map(order=>{
            return(
                <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{prettyDate(order.createdAt)}</td>
                    <td>{order.totalPrice} uah</td>
                    <td>{order.status}</td>
                    <td>
                        <button onClick={()=>{
                            // navigate(`/admin/stat/${order.id}`)
                        }
                        }>Подробнее</button>
                    </td>
                </tr>
            )
        }
        )
    }
    //pretty date with hours and minutes
    function prettyDate(date){
        const dateObj = new Date(date);
        const hours = dateObj.getHours();
        const minutes = dateObj.getMinutes();
        const seconds = dateObj.getSeconds();
        const prettyDate = `${dateObj.getDate()}.${dateObj.getMonth()}.${dateObj.getFullYear()} ${hours}:${minutes}`;
        return prettyDate;
    }

    // function prettyDate(date){
    //     const dateArr = date.split('-');
    //     return `${dateArr[2]}.${dateArr[1]}.${dateArr[0]}`
    // }


    function getOrdersData(){
        userRequestRetail.get('/orders/orders').then(res=>{
            setOrders(res.data)
        }).catch(err=>{
            console.log(err)
        })
    }
}