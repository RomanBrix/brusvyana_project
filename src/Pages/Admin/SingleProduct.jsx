import { useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import SingleProductRender from "../../Admin/Products/SingleProduct";
import { publicRequestRetail } from "../../requestMethods";



export default function SingleProduct() {
    const params = useParams();
    const [productId, setProductId] = useState(params['*'] || null);
    const [product, setProduct] = useState({
        _id: null,
        title: 'loading',
        description: 'loading',
        price: 0,
        image: 'loading.svg',
        quantity: 0,
        isAvailable: false,
        variants: []
    });

    return (
        <div className="admin admin-single-product">
            <div className="content">
                <Routes>
                        <Route path="/new" element={ <>NEW</>}/>
                        <Route path="/:id/edit" element={ <>EDIT</>}/>
                        <Route path=':id' element={<SingleProductRender goSetProductId={ goSetProductId } id={ productId } getProduct={ getProduct } product={product}/> } />
                        <Route path="*" element={ <h1>Продукт не найден</h1>}/>
                </Routes>

            </div>
        </div>
    )
    function getProduct(id){
        
        publicRequestRetail.get('products/'+id)
        .then(res=>{
            setProduct(res.data);
        }).catch(err=>{
            console.log(err)
        })
    }

    function goSetProductId(id){
        setProductId(id);
    }
}