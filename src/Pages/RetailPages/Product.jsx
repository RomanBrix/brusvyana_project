// import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { publicRequestRetail } from "../../requestMethods";
import { ReactComponent as Uah} from "../../svg/Uah.svg";
import { ReactComponent as Guar} from "../../svg/Guar.svg";
// import { ReactComponent as Approx} from "../../svg/approx.svg"




export default function Product(){
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);

    // const retailStore = useSelector(state => state.retail);
    // const dispatch = useDispatch();
    
    const navigate = useNavigate();
    
    const params = useParams();
    
    useEffect(()=>{
        if(params.id){
            publicRequestRetail.get('/products/' + params.id)
            .then(res => {
                console.log(res.data);
                setProduct(res.data);
            }).catch(err => {
                console.log(err);
            })
        }else{
            setProduct(null);
        }
        // eslint-disable-next-line
    },[])

    if(product === null){
        return<div className="product-page">
                <div className="content">
                    <h1>Loading</h1>
                </div>
            </div>
    }

    return (
        <div className="product-page">
            <div className="content">
                <div className="img-container">
                    <div className="img-main">
                        <img src={'/src/products/' + product.image} alt={product.name} />
                    </div>
                </div>
                <div className="info-container">
                    
                    <div className="title">{ product.title }</div>
                    { /*
                        product.variants.length > 0 ? 
                        <div className="variant-title">{ selectedVariant ? selectedVariant.title : '' }</div>
                        : null
                    */ }
                    
                    <div className="price"> <Uah/>{ selectedVariant ? selectedVariant.price : product.price }</div>
                    <div className="variants">{ product.variants.length > 0 ? renderVariants() : '' }</div>
                    {/* <div className="quantity">В наличии: {selectedVariant ? selectedVariant.quantity : product.quantity}</div> */}
                    <div className="description">{ product.description }</div>

                    <div className="guar">
                        <Guar/> <span><b>Гарантія.</b> Обмін/повернення товару впродовж 14 днів</span>
                    </div>
                    <div className="btns">
                        <div className="btn btn-second" onClick={()=>{navigate(-1)}}>Назад</div>
                        <div className="btn btn-primary" onClick={()=>{addToCart()}}>Додати в корзину</div>
                    </div>
                </div>
            </div>
        </div>
    )


    function addToCart(){
        if(product.variants.length > 0){
            if(selectedVariant){
                // addToCart(dispatch, selectedVariant._id, 1);
                alert('Варіант добавлений');
                return;
            }else{
                alert('Виберіть варіант');
                return ;
            }
        }

        alert('Товар добавлений')
    }


    function renderVariants(){
        return product.variants.map((variant, index)=>{
            return (
                <div className={`variant ${selectedVariant?._id === variant._id && "variant-active"}`} onClick={()=>{setSelectedVariant(variant)}} key={index}>
                    <div className="variant-sub-title">{variant.title}</div>
                </div>
            )
        }
        )
    }
}