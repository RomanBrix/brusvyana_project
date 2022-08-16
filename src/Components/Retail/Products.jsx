import { ReactComponent as Uah} from "../../svg/Uah.svg";
import { ReactComponent as Approx} from "../../svg/approx.svg"
import {  useNavigate } from "react-router-dom";


export default function ProductsContainer({products, setActiveCategory, activeCategory}){
    const navigate = useNavigate();


    if(products === null){
        return (
            <div className="retail-products retail-products-loading">
                <h2>Loading</h2>
            </div>
        )
    }

    console.log(activeCategory);
    if (products.length === 0){
        return (
            <div className="retail-products retail-products-empty">
                <h2>Немає продуктів</h2>
                {
                    activeCategory === null ? <h3>Виберіть другий каталог</h3> : <div className="btn" onClick={()=>{setActiveCategory(null)}}>Показати всі продукти каталога </div>
                }
                
            </div>
        )
    }
    return(
        <div className="retail-products">
            {renderProduct(products)}
        </div>
    )

    
    

 function renderProduct(products){
    return products.map((item, index)=> {
        return(
            <div className="product-item" key={index} onClick={()=>{ navigate('../product/' + item._id)}}>
                <div className="borders">
                    <div className="border border-top"/>
                    <div className="border border-right"/>
                    <div className="border border-bottom"/>
                    <div className="border border-left"/>
                </div>
                <div className="product-image">
                    <img src={'/src/products/'+item.image} alt={item.title}/>
                </div>
                <div className="product-title">
                    {item.title}
                </div>
                <div className="product-info">
                    <div className="product-price">
                        <Approx/> { item.price }  <Uah/>
                    </div>
                    <div className="description">
                        {cutDescription(item.description, 35)}
                    </div>
                </div>
            </div>
        )
    } )
 }

 //cut description text to n symbols
    function cutDescription(description, n = 20 ){
        if(description.length > n){
            return description.substring(0, n) + "..."
        }
        return description
    }


}