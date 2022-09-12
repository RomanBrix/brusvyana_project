import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PrettyDate } from "../../helpers"
import Pagination from "../Pagination";
import { changeSortRule, renderArrow, sortFunction } from "../tableSort";



export default function StatPageOrders({orders,getOrdersData}) {
    const [search, setSearch] = useState('')
    const [sortRule, setSortRule] = useState({
        name: '',
        order: '',
        type: ''
    })

    useEffect(()=>{
        getOrdersData()
        // eslint-disable-next-line
    },[])
    

    let manipulatedOrders = orders
    .filter(order=>order?.id.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b)=>{ return sortFunction(a,b, sortRule)});
    //pagination
    const [page, setPage] = useState(1);
    const [perPage] = useState(5);
    const navigate = useNavigate();
    return (
        <div className="tableOfOrders whiteBg">
            <div className="top">
                <h1>Замовлення </h1>
                <div className="search">
                    <input 
                    type="text" 
                    id="search" 
                    value={search} 
                    onChange={changeSearchValue} 
                    placeholder={'search (Id)'}
                    />
                </div>
                <div className="btns">
                    {/* <button className="btn btn-primary" onClick={()=>{setAddUserModal(true)}}>Додати користувача</button> */}
                </div>
            </div>
                    <table>
                        <thead>
                            <tr>
                                <th
                                    data-name={'id'} 
                                    data-type={'string'} 
                                    onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                                >
                                    {renderArrow('id', sortRule)}
                                    id
                                </th>
                                <th
                                    data-name={'createdAt'} 
                                    data-type={'date'} 
                                    onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                                    className='small'
                                >
                                    {renderArrow('createdAt',sortRule)}
                                    Дата
                                </th>
                                <th
                                    data-name={'totalPrice'} 
                                    data-type={'number'} 
                                    onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                                >
                                    {renderArrow('totalPrice',sortRule)}
                                    Сумма
                                </th>
                                <th
                                    data-name={'status'} 
                                    data-type={'string'} 
                                    onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                                >
                                    {renderArrow('status',sortRule)}
                                    Статус
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <RenderOrders orders={manipulatedOrders}/>
                        </tbody>
                    </table>
                    <Pagination page={page} setPage={setPage} total={orders.length} productsPerPage={perPage}/>
                        <>
                        Total users : {orders.length}
                        </>
                        <br />
                        <>
                        Filtered users : {manipulatedOrders.length}
                        </>
                </div>
    )

    function changeSearchValue(e){
        const {value} = e.target;
        setSearch(value)
        setPage(1)
    }

    function RenderOrders({orders}) {
        
        return orders
        .slice((page-1)*perPage, page*perPage)
        .map(order=>{
            const statusTag = statusFlag(order.status);
            return(
                <tr key={order.id} onClick={()=>{navigate('./' + order._id)}}>
                    <td>{order.id}</td>
                    <td className="small">{PrettyDate(order.createdAt, 'dd/mm hh:mm')}</td>
                    <td>{order.totalPrice} uah</td>
                    <td><span className={`tag -${statusTag.color}`}>{statusTag.text}</span></td>
                    {/* <td>
                        <button onClick={()=>{
                            // navigate(`/admin/stat/${order.id}`)
                        }}>Подробнее</button>
                    </td> */}
                </tr>
            )
        })
    }

    function statusFlag(status){
        switch(status){
            case 'new':
                return {
                    color: 'orange',
                    text: 'Новий'
                }
            case 'payed':
                return {
                    color: 'green',
                    text: 'Оплачено'
                }
            case 'done':
                return {
                    color: 'blue',
                    text: 'Виконано'
                }
            default:
                return {
                    color: 'red',
                    text: 'Не визначено'
                }
        }
    }
    
}