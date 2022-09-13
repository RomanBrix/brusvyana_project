import { ReactComponent as Uah} from "../../svg/Uah.svg";
// import { ReactComponent as Approx} from "../../svg/approx.svg"
import {  useNavigate } from "react-router-dom";
import ProductPagination from "./ProductPagination";
import useQuery from "./QueryHook";
import { Suspense, useEffect } from "react";
import { changePageQuery } from "../../Redux/retailApi";
import { useDispatch } from "react-redux";
import { SuspenseImg } from "./LazyImg";


export default function ProductsContainer({products,  categories, productsCount, fetchLoading, loadingProducts}){
    const navigate = useNavigate();

    const queryUrl = useQuery();
    const dispatch = useDispatch();
    // console.log(productsCount)

    const initActivePage = queryUrl.get("page");
    const activePage = queryUrl.get("page") || 1;
    const catalog = queryUrl.get("catalog");
    const activeCategory = queryUrl.get("category");

    useEffect(()=>{
        
        if(initActivePage && catalog && categories && productsCount && !fetchLoading){
            console.log('go');
            let options ={
                catalog: catalog,
                category: activeCategory,
                page: activePage
            }

            changePageQuery(dispatch, options)
            
        }
        // eslint-disable-next-line
    },[activePage, categories, productsCount, fetchLoading])
    // console.log(activePage);

    if(products === null || fetchLoading){
        return (
            <div className="retail-products retail-products-loading">
                <h2>Loading</h2>
            </div>
        )
    }

    // console.log(activeCategory);
    if (categories?.length === 0 || products?.length === 0){
        return (
            <div className="retail-products retail-products-empty">
                <h2>Немає продуктів</h2>
                {
                    activeCategory === null ? <h3>Виберіть другий каталог</h3> : <div className="btn" onClick={()=>{}}>Показати всі продукти каталога </div>
                }
                
            </div>
        )
    }
    console.log(loadingProducts);
    if(loadingProducts){
        //fill empty products array
        let productsLoad = new Array(10);
        // console.log(productsLoad)
      return  <div className="retail-products">
            <div className="filter-btn" onClick={(e)=>{toggleFilters(e)}}>
                <div className="line"/>
                <div className="line"/>
                <div className="line"/>
            </div>
            {renderProduct(productsLoad, true)}
        </div>
    }
    return(
        <div className="retail-products">
            <div className="filter-btn" onClick={(e)=>{toggleFilters(e)}}>
                <div className="line"/>
                <div className="line"/>
                <div className="line"/>
            </div>
            {renderProduct(products)}
            <ProductPagination countAllProducts={productsCount} activePage={activePage} setActivePage={setActivePage}/>
        </div>
    )

    
    function toggleFilters({target}){
        if(!target.classList.contains("filter-btn")){
            document.querySelector(".filter-btn").click()
            return
        }

        const filtersBlock = document.querySelector(".retail-filters");

        if(filtersBlock.classList.contains("active-filters")){
            filtersBlock.classList.remove("active-filters");
            target.classList.remove("active-filters-btn");
        }else{
            filtersBlock.classList.add("active-filters");
            target.classList.add("active-filters-btn");

        }

    }
    

 function renderProduct(products, preload = false){
    return products.map((item, index)=> {
        return(
            <div className={`product-item ${preload ? 'preload-product-item' : ''}`} key={index} onClick={()=>{preload ? console.log('hi') : navigate('../product/' + item._id)}}>
                <div className="borders">
                    <div className="border border-top"/>
                    <div className="border border-right"/>
                    <div className="border border-bottom"/>
                    <div className="border border-left"/>
                </div>
                <div className="product-image">
                    {
                        preload ?
                        <span className="material-icons">image</span>
                        :
                        <Suspense fallback={<div className="preloadImg"><span className="material-icons">image</span></div>  }>
                        {/* // <img src={'/src/products/'+item.image} alt={item.title} loading="lazy"/> */}
                            <SuspenseImg alt="" src={'/src/products/'+item.image}/>
                        </Suspense>
                    }
                    
                </div>
                <div className="product-title">
                    {preload ? '' : item.title}
                </div>
                <div className="product-info">
                    <div className="product-price">
                        Від {preload ? '-' : item.price }  <Uah/>
                    </div>
                    <div className="description">
                        {preload ? '' :cutDescription(item.description, 55)}
                    </div>
                </div>
            </div>
        )
    } )
 }

    function setActivePage(page){

        if(!initActivePage){
            queryUrl.append("page", page);
            console.log(queryUrl.toString());
            navigate('./?' + queryUrl.toString());
        }else{
            queryUrl.set("page", page);
            navigate('./?' + queryUrl.toString());
        }
    }
 //cut description text to n symbols
    function cutDescription(description, n = 20 ){
        if(description.length > n){
            return description.substring(0, n) + "..."
        }
        return description
    }


}