import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { publicRequestRetail } from "../../requestMethods";
import { ReactComponent as Uah} from "../../svg/Uah.svg";
import { ReactComponent as Plus} from "../../svg/Plus.svg";
import { ReactComponent as Minus} from "../../svg/Minus.svg";
import PayForm from "../../Components/Retail/PayForm";
import { goSetProducts } from "../../Redux/cartApi";



export default function Cart(){
    const [totalPrice, setTotalPrice] = useState(0);
    const [products, setProducts] = useState([]);

    
    const cartStore = useSelector(state => state.persistedReducer.cart );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
console.log(cartStore);
// console.log(products);

    useEffect(()=>{
        if(cartStore.products.length > 0){
            let ids = cartStore.products.map(product => product.id);

            publicRequestRetail.get('/products/cart', { params: {ids} })
            .then(res => {
                console.log(res.data);
                const productForSave = doNiceProductViev(res.data);
                setProducts(productForSave);
            }).catch(err => {
                console.log(err);
            })
        }else{
            setProducts([]);
        }
        // eslint-disable-next-line
    },[cartStore.products])

    //set price
    useEffect(()=>{

        if(products.length > 0){
            let price = products.reduce((acc, cur)=>{
                return acc += +cur.price
            } ,0);
            setTotalPrice(price);
        }else{
            setTotalPrice(0);
        }
        // eslint-disable-next-line
    },[products])
    
    return (
        <div className="cart-page">
            <div className="content">
                <div className="products">
                    <div className="btns">
                        <div className="btn btn-back" onClick={()=>{navigate(-1)}}>Продовжити покупки</div>

                        <div className="total">Товара на суму: <b style={{marginLeft: '7px'}}>{totalPrice}</b> <Uah/> </div>
                    </div>
                    
                    <div className="products-container">
                       <div className="product">
                            <div className="img"/>
                            <div className="title"/>
                            <div className="count">Кількість</div>
                            <div className="price">Ціна</div>
                            <div className="delete"> <div className="delete-func" onClick={()=>{removeAll()}}>Видалити все</div></div>
                       </div>

                       { products.length > 0 ? renderProducts(products) : 'НЕМА!' }
                    </div>

                </div>
                <div className="paying-form">
                    <PayForm 
                        products={products} 
                        totalPrice={totalPrice} 
                        user={{
                            user: cartStore.guestUser, 
                            payment: cartStore.prefferedPaymentMethod,
                            delivery: cartStore.prefferedDeliveryMethod
                        }}
                    />
                </div>
            </div>
        </div>
    )




    function removeAll() {
        goSetProducts(dispatch, []);
    }

    //REMOVE BLOCK OF PRODUCT
    function removeBlockCart(position){
        const { products } = cartStore;
        const changeProd = products.filter((item, index) => index !== position);
        goSetProducts(dispatch, changeProd);
    }

    // ADD OR REMOVE ONE PIECE OF PRODUCT
    function manageQuanity(type, position){
        const { products } = cartStore;
        
        let changeProd = [];
        switch(type){
            case 'plus':
                // changeProd[position].quantity += 1;
                changeProd = products.map((item, index) => {
                    if(index === position){
                        console.log(products[position].id)
                        return {
                            ...item,
                            quantity: item.quantity + 1
                        };
                    }
                    return item;
                });
                break;
            case 'minus':
                changeProd = products.map((item, index) => {
                    if(index === position){
                        return {
                            ...item,
                            quantity: item.quantity - 1
                        };
                    }
                    return item;
                });
                break;
            default:
                break;
        }
        if(changeProd[position].quantity === 0){
            changeProd = changeProd.filter((item, index) => index !== position);
        }
        goSetProducts(dispatch, changeProd);
    }



    //RENDER PRODUCT
    function renderProducts(products){

        return products.map((product, key) => {
            return(
                <div className="product" key={key}>
                    <div className="img"><img src={`/src/products/${product.image}`} alt={product.title} /></div>
                    <div className="title">{product.title} {product.variants ? <div className="sub">[ {product.varTitle} ]</div> : '' }</div>
                    <div className="count">
                        <Minus onClick={()=>{manageQuanity('minus', product.position)}}/> 
                        <div className="man-count">{product.quantity}</div> 
                        <Plus onClick={()=>{manageQuanity('plus', product.position)}}/>
                    </div>
                    <div className="price">{product.price} <Uah/></div>
                    <div className="delete"><div className="delete-func" onClick={()=>{removeBlockCart(product.position)}}><Minus/> Видалити </div></div>
                </div>
            )
        })
    }

    function doNiceProductViev(data){

        return cartStore.products.map((item, index)=>{
            const prod = data.find(product => product._id === item.id);
            let price = 0;
            let varTitle = null;
            if(item.variant){
                price = prod.variants.find(variant => variant._id === item.variant).price * item.quantity;
                varTitle = prod.variants.find(variant => variant._id === item.variant).title;
            }else{
                price = prod.price * item.quantity;
            }
            return {...prod, quantity: item.quantity, price, variants: item.variant, varTitle, position: index};
        });
    }
}