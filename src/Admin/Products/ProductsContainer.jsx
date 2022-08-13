import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { checkAAA, userRequestRetail } from "../../requestMethods";



export default function ProductsContainer({productsIds}){
    const [products, setProducts] = useState([]);
    
    const params = useParams();
    console.log(params)

    useEffect(()=>{
        //get products
        getProductsData()
    },[productsIds])
    

    return(
        <>
            <div className="top">
                <div className="btn add-product">Добавить</div>
                <div className="btn load-product">Загрузить товар</div>
            </div>


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
        axios.get('http://localhost:1338/api/products/ids', {params:{ids:productsIds}}).then(res=>{
            setProducts(res.data)
        }).catch(err=>{
            console.log(err)
        })
    }
    function deleteProduct(id){
        // axios.delete('http://localhost:1338/api/products/'+id).then(res=>{
        //     console.log(res)
        //     getProductsData()
        // }).catch(err=>{
        //     console.log(err)
        // })
        if(window.confirm('Удалить?')){
            checkAAA()
            userRequestRetail.delete('products/'+id).then(res=>{
                console.log(res)
                getProductsData()
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
                    <td>
                        <img src={`/src/products/${product.image}`} alt={product.image}/>
                    </td>
                    <td>{product.title}</td>
                    <td>{product.description}</td>
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
}