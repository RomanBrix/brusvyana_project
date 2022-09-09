import { PrettyDate } from "../../helpers"



export default function StatPageOrders({orders}) {

    return (
        <div className="tableOfOrders whiteBg">
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
                            <RenderOrders/>
                        </tbody>
                    </table>
                </div>
    )


    function RenderOrders(){
        return orders.map(order=>{
            return(
                <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{PrettyDate(order.createdAt, 'dd/mm hh:mm')}</td>
                    <td>{order.totalPrice} uah</td>
                    <td>{order.status}</td>
                    <td>
                        <button onClick={()=>{
                            // navigate(`/admin/stat/${order.id}`)
                        }}>Подробнее</button>
                    </td>
                </tr>
            )
        })
    }
    
}