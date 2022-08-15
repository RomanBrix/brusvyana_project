import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as Uah } from "../../svg/Uah.svg";





export default function SingleProductRender({id, goSetProductId, getProduct, product}) {
    const params = useParams();
    
    const [selectedVariant, setSelectedVariant] = useState(null);
    const navigate = useNavigate();

    
    
    useEffect(()=>{
        if(params.id !== id){
            goSetProductId(params.id)
        }
        // eslint-disable-next-line
    },[])
    useEffect(()=>{
        if(id !== product._id){
            
            console.log('go load');
            getProduct(id);
        }
        // eslint-disable-next-line
    },[id])


    console.log(product);
    return (
        <div className="admin admin-single-product">
            <div className="content">
                <div className="left img-side">
                    <img src={`/src/products/${product.image}`} alt={ product.image }/>
                </div>
                <div className="right">
                    <div className="btn" onClick={()=>{navigate('./edit', {replace: true})}}>Изменить Товар</div>
                    <div className="title">{ product.title }</div>
                    <div className="variant-title">{ selectedVariant ? selectedVariant.title : '' }</div>
                    <div className="price"> <Uah/>{ selectedVariant ? selectedVariant.price : product.price }</div>
                    <div className="variants">{ product.variants.length > 0 ? renderVariants() : '' }</div>
                    <div className="quantity">В наличии: {selectedVariant ? selectedVariant.quantity : product.quantity}</div>
                    <div className="description">{ product.description }</div>
                </div>

            </div>
        </div>
    )

    function renderVariants(){
        return product.variants.map((variant, index)=>{
            return (
                <div className={`variant ${selectedVariant?._id === variant._id && "variant-active"}`} onClick={()=>{setSelectedVariant(variant)}} key={index}>
                    <div className="variant-sub-title">Вариант {index + 1}</div>
                </div>
            )
        }
        )
    }
}