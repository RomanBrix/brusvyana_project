import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";





export default function SingleProductRender({id, goSetProductId, getProduct, product}) {
    const params = useParams();
    
    const [selectedVariant, setSelectedVariant] = useState(null);
    
    
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
                    <div className="btn">Изменить Товар</div>
                    <div className="title">{ product.title }</div>
                    <div className="variant-title">{ selectedVariant ? selectedVariant.title : '' }</div>
                    <div className="price">{ selectedVariant ? selectedVariant.price : product.price } $</div>
                    <div className="variants">{ product.variants.length > 1 ? renderVariants() : '' }</div>
                    <div className="quantity">В наличии: {selectedVariant ? selectedVariant.quantity : product.quantity}</div>
                    <div className="description">{ product.description }</div>
                </div>

            </div>
        </div>
    )

    function renderVariants(){
        return product.variants.map((variant, index)=>{
            return (
                <div className="variant" onClick={()=>{setSelectedVariant(variant)}} key={index}>
                    <div className="variant-sub-title">Вариант {index + 1}</div>
                </div>
            )
        }
        )
    }
}