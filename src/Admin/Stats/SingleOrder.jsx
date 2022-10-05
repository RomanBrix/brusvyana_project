import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { PrettyDate } from "../../helpers";
import { createUserAxiosRequest } from "../../requestMethods";






export default function SingleOrder() {
    const [order, setOrder] = useState(null);
    // eslint-disable-next-line
    const [user, setUser] = useState(null);
    const [note, setNote] = useState('');

    const { id } = useParams();

    const adminRequestUser = createUserAxiosRequest('user');
    const adminRequestRetail = createUserAxiosRequest();
    
    const  userStore = useSelector(state => state.persistedReducer.user);
    
    // console.log(userStore)


    //load first data
    useEffect(()=>{
        adminRequestRetail.get(`/orders/order/${id}`)
        .then(res=>{
            setOrder(res.data)

            if(res.data.user){
                adminRequestUser.get(`/users/find/${res.data.user}`)
                .then(res=>{
                    setUser(res.data)
                })
                .catch(err=>{
                    console.log(err)
                })
            }
        })
        .catch(err=>{
            console.log(err)
        })
        // eslint-disable-next-line
    },[id])

    //load author name`s of note
    useEffect(()=>{
        if(order?.notes.length > 0){
            const ids = order.notes.map(note=>note.author);
            // console.log(ids);
            adminRequestUser.get(`/users/usernames`, {params: {ids} })
            .then(res=>{
                // console.log(res)
                const {data} = res;
                setOrder((prev)=>({
                    ...prev,
                    notes: prev.notes.map(note=>{
                        return {
                            ...note,
                            authorName: data.find(user=>user._id === note.author).username
                        }
                    })
                }))
            })
            .catch(err=>{
                console.log(err)
            })
        }
        // eslint-disable-next-line
    },[order?.notes.length])


    console.log(order);
    if(!order){
        return <div className="whiteBg">
            <h1>Загрузка...</h1>
        </div>
    }
    if(order?.message){
        return <div className="whiteBg">
            <h1>Заказ не найден</h1>
        </div>
    }
    return(
        <div className="oneOrder">
            <div className="whiteBg order-info">
                <div className="top">
                    <h1>Заказ {order.id}</h1>
                    <div className="total"> <span className="material-icons">payments</span>{order.totalPrice} UAH</div>
                </div>
                <div className="small"> <span className="material-icons">schedule</span> {PrettyDate(order.createdAt) }</div>
                <div className="status">
                    Статус: <span className={`tag ${statusFlag(order.status).color}`}>{statusFlag(order.status).text}</span>
                    <ul className="list" onClick={(e)=>{changeStatus(e)}}>
                        <li data-value="done"><span className={`tag blue`}>Виконано</span></li>
                        <li data-value="payed"><span className={`tag green`}>Оплачено</span></li>
                        <li data-value="new"><span className={`tag orange`}>Новий</span></li>
                        <li data-value="none"><span className={`tag red`}>Не визначено</span></li>
                    </ul>
                </div>
                <div className="delivery">
                    <h2><span className="material-icons">local_shipping</span> Доставка</h2>
                    <div className="delivery_type">
                        <h3>Тип доставки:</h3>
                        <p>{retunrDeliveryType(order.deliveryMethod) }</p>
                    </div>
                </div>
                <div className="products">
                    {renderProducts(order.productsWhenBuy)}
                </div>
            </div>

            <div className="whiteBg order-user">
                <h1>Користувач</h1>
                {order.guestUser && !order.user ? renderGuestUser() : renderUser()}
            </div>
            <div className="whiteBg notes">
                <h1>Нотатки</h1>
                <div className="note add-note">
                    <textarea placeholder="Текст нотатка" value={note} onChange={(e)=>{setNote(e.target.value)}}/>
                    <button onClick={addNote}>Додати</button>
                </div>
                    {renderNotes()}
            </div>
        </div>
    )


    function deleteNote(noteId){
        if(!window.confirm('Ви впевнені?')) return;

        const newNotes = order.notes.filter(note=>note._id !== noteId);
        adminRequestRetail.put(`/orders/order/${order._id}`, {notes: newNotes})
        .then(res=>{
            setOrder((prev)=>({
                ...prev,
                notes: res.data.notes
            }))
        })
        .catch(err=>{
            console.log(err)
        })
    }
    function changeStatus({target}){
        if(target.tagName === 'SPAN') {
            target.parentElement.click();
        }
        
        if(target.nodeName !== 'LI') return;

        const status = target.dataset.value;
        console.log(status)
        adminRequestRetail.put(`/orders/order/${order._id}`, {status})
        .then(res=>{
            setOrder((prev)=>({
                ...prev,
                status: res.data.status
            }))
        })
        .catch(err=>{
            console.log(err)
        })
    }

    function addNote(){
        if(note.length < 2) return;
        const createNote = {
            text: note,
            author: userStore.currentUser._id,
        }
        adminRequestRetail.post(`/orders/note`, {note:createNote, id: order._id})
        .then(res=>{
            setOrder(res.data)
            setNote('')
        })
        .catch(err=>{
            console.log(err)
        })
    }

    function renderNotes(){
        if (!order?.notes) return <div className="no-notes">Немає нотаток</div>
        return order?.notes.map((note, index)=>{
            
            return <div className="note" key={index}>
                <div className="text">{note.text}</div>
                <div className="date small"> <span className="material-icons">schedule</span>{PrettyDate(note.date)}</div>
                <div className="author"> <span className="material-icons">account_circle</span>{note?.authorName}</div>
                <button className="delete" onClick={()=>{deleteNote(note._id)}}><span className="material-icons">delete_forever</span></button>
            </div>
        }).reverse()

    }

    function renderUser(){
        return <div className="guest user">
            {/* ПОКА ПОХУЮ */}
        </div>
    }
    function renderGuestUser(){
        return(
            <div className="guest">
                <div className="user-tag"><span className="tag orange">Гість</span> </div>
                <div className="block name"> <span className="material-icons">account_circle</span> {order.guestUser.secondName} {order.guestUser.name}</div>
                <div className="block phone"><span className="material-icons">phone_iphone</span>{order.guestUser.phone}</div>
                <h2>Адреса:</h2>
                <div className="block town"><span className="material-icons">location_city</span> {order.guestUser.town}</div>
                <div className="block address"><span className="material-icons">pin_drop</span> {order.guestUser.address}</div>
            </div>
        )
    }
    function renderProducts(products){
        return products.map((product, index)=>{
            return <div className="product" key={index}>
                {/* <div className="list">{index+1}.</div> */}
                    <h3>{product.title}</h3>
                        {
                            product.varTitle ? <p>Варiант: <b>{product.varTitle}</b> </p> : null
                        }
                    {/* <div className="price">{product.price} UAH</div> */}
                    <div className="count">кількість: <b>{product.quantity}</b> шт.</div>
            </div>
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
    function retunrDeliveryType(type){
        switch(type){
            case 'self':
                return 'Самовывоз'
            case 'courier':
                return 'Курьер'
            case 'novaPochta':
                return 'Нова Почта'
            default:
                return 'Не определено'
        }
    }
        
}