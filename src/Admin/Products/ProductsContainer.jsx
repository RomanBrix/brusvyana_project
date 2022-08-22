import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import {  createUserAxiosRequest, publicRequestRetail } from "../../requestMethods";



export default function ProductsContainer({productsIds, getCategories}){
    const [products, setProducts] = useState([]);

    
    const userRequestRetail = createUserAxiosRequest();
    
    const params = useParams();
    const navigate = useNavigate();
    
    console.log(params);
    useEffect(()=>{
        //get products
        getProductsData()
        // eslint-disable-next-line
    },[productsIds])
    

    return(
        <>
            


            <div className="admin admin-products">
                <h1>Всего продуктов {productsIds.length}</h1>
                {/* products table */}
                <table>
                    <thead>
                        <tr>
                            <th>img</th>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Цена</th>
                            <th>кол-во</th>
                            <th>наличие</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderProducts()}
                    </tbody>
                </table>

            </div>
        </>
        
    )


    function getProductsData (){
        console.log(productsIds)
        // axios.get('http://localhost:1338/api/products/ids', {params:{ids:productsIds}}).then(res=>{
        //     setProducts(res.data)
        // }).catch(err=>{
        //     console.log(err)
        // })
        publicRequestRetail.get('/products/ids', {params:{ids:productsIds}}).then(res=>{
            setProducts(res.data)
        }).catch(err=>{
            console.log(err)
        })

    }
    function deleteProduct(id){
        
        if(window.confirm('Удалить?')){
            const catalogId = params["*"].split('/')[0] || params["*"];
            
            userRequestRetail.delete('products/'+id).then(res=>{
                // console.log(res)
                getProductsData()
                getCategories(catalogId)
            }).catch(err=>{
                console.log(err)
                if(err.response.data === 'Token is not valid!'){
                    window.localStorage.removeItem('persist:root');
                    window.location.reload();
                }
            })
        }
        
    }

    function renderProducts(){
        return products.map(product=>{
            return(
                <tr key={product._id}>
                    <td onClick={()=>{navigate('/admin/product/' + product._id)}}>
                        <img src={`/src/products/${product.image}`} alt={product.image}/>
                    </td>
                    <td>{product.title}</td>
                    <td>{cutDescription(product.description, 25)}</td>
                    <td>{product.price}</td>
                    <td>{product.quantity}</td>
                    <td>{product.isAvailable ? 'Да' : 'Нет'}</td>
                    <td>
                        <div className="btn delete-product" onClick={()=>{deleteProduct(product._id)}}>Удалить</div>
                        {/* Удалить */}
                    </td>
                </tr>

            )
        } )
    }
    //cut description to n symbols
    function cutDescription(description, n= 30){
        if(description.length > n){
            return description.slice(0, n) + '...'
        }
        return description
    }
}