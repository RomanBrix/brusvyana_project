import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProductsByCategory } from "../../Redux/retailApi";
// import { publicRequestRetail } from "../../requestMethods";
import useQuery from "./QueryHook";



export default function Filters ({categories }){

    const queryUrl = useQuery();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const activeCategory = queryUrl.get("category");

    useEffect(()=>{
        if(activeCategory){
            // publicRequestRetail('/products/category/' + activeCategory)
            // // publicRequestRetail('/products/query?' + queryUrl.toString())
            // .then(res => {
            //     console.log(res);
            //     fetchProducts(dispatch, retailStore.countAllProducts);

            // })
            // .catch(err => {
            //     console.log(err);
            // });
            fetchProductsByCategory(dispatch, activeCategory);

            
        } else{
            // console.log('tyt')
        } 
        // eslint-disable-next-line
    }, [activeCategory])
                    
    if(categories === null){
        return (
            <div className="retail-filters retail-filters-loading">
                <h2>Loading</h2>
            </div>
        )
    }
    return(
        <div className="retail-filters">
            <div className="tag-name">Категорії</div>
            <div className="tag-container category-container">

                {categories.length > 0 ? renderCategory(categories) : <h2> Немає доступних категорій </h2>}
            </div>
        </div>
    )


    function renderCategory(categories){
        return categories.map((item, index)=> {
            return <div 
                className={`tag ${activeCategory === item._id && "tag-active"}`} 
                key={index} 
                onClick={()=>{loadCategory(item)}}>
                    {item.title} <span className="count">Продуктів: {item.products.length} </span>
                </div>
        } )
    }

    function loadCategory(category){
        const ct = queryUrl.get("catalog");

        const changeUrl = new URLSearchParams("catalog=null&category=null");
        changeUrl.set("category", category._id);
        changeUrl.set("catalog", ct);

        navigate('./?' + changeUrl.toString(), {replace: true});
    }
} 