// eslint-disable-next-line
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import CatalogItem from "../../Components/Retail/CatalogItem";
import Filters from "../../Components/Retail/Filters";
import ProductsContainer from "../../Components/Retail/Products";
import useQuery from "../../Components/Retail/QueryHook";
import { getAllCataloges, getCategoriesOfCatalog, fetchProducts, clearCatalog, lengthOfAllCatalogProducts } from "../../Redux/retailApi";

import { ReactComponent as Cart } from "../../svg/Cart.svg"




export default function RetailCatalog(){



    const retailStore = useSelector(state => state.retail);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryUrl = useQuery();
    const location = useLocation();

    const activeCatalog = queryUrl.get("catalog");
    const activeCategory = queryUrl.get("category");

    /*
    for mobile cart
    */
    const {cart: {products}} = useSelector(state => state.persistedReducer);
    const productCount = products.length > 0 ? products.reduce((acc, curr)=>{ return acc += +curr.quantity}, 0) : 0;
    


// console.log(activeCatalog);

useEffect(()=>{
    if(location.pathname !== '/retail/products/'){
        // console.log('clear');
        clearCatalog(dispatch)
    }
    // eslint-disable-next-line
},[location.pathname]);
    //get catalogs
    useEffect(()=>{
        // console.log(retailStore.catalogs.length);
        if(retailStore.catalogs.length < 1){
            getAllCataloges(dispatch, (activeFirst)=>{
                let goTo = activeFirst;
                if(activeCatalog){
                    goTo = activeCatalog;
                }
                // console.log('asdasdasd')
                if(activeCatalog){
                    queryUrl.set("catalog", goTo);
                    
                    navigate('./?'+queryUrl.toString(), {replace: true});

                }else{
                    navigate('./?catalog='+goTo, {replace: true});
                }
                    
            });
        }

       //eslint-disable-next-line
    },[retailStore.catalogs]);

    //get categories
    useEffect(()=>{
        // console.log(activeCatalog)
        
        if(activeCatalog){
            getCategoriesOfCatalog(dispatch, activeCatalog, (err)=>{
                if(err){
                    console.log(err)
                    navigate('../', {replace: true});
                }
            });


        }
        //eslint-disable-next-line
    },[activeCatalog]);


    //load products
    useEffect(()=>{
        
        if((retailStore.countAllProducts !== null && retailStore.countAllProducts !== 0) && activeCategory === null){
            // if(retailStore.categories.length < 1){
            //     thereIsNoProducts(dispatch)
            // }
            if(retailStore.countAllProducts > 0){

                const categoriesId = retailStore.categories.map((item)=>{
                    return item._id;
                });

                fetchProducts(dispatch, categoriesId);
            }else{
                // thereIsNoProducts(dispatch)
            }
        }else if(( retailStore.countAllProducts === null || retailStore.countAllProducts === 0) && activeCategory === null && activeCatalog !== null){
            console.log('first')
            lengthOfAllCatalogProducts(dispatch, activeCatalog);
            if(retailStore.categories){
                const categoriesId = retailStore.categories.map((item)=>{
                    return item._id;
                });

                fetchProducts(dispatch, categoriesId);
            }
        }
        // eslint-disable-next-line
    },[retailStore.categories, activeCategory]);


    console.log(retailStore);

    return(
        <div className="retail retail-catalog">
            <div className="content">
                <div className="catalog-header">
                    <Routes>
                        
                        <Route path="*" element={<RenderCatalogHeader catalogs={retailStore.catalogs}/>} />
                        {/* <Route path="/:catalog/*" element={<Categories getCategories={getCategories} categories={categories} setSelectedCategory={setSelectedCategory}/>}/> */}
                    </Routes>
                </div>
                <div className="retail-content">
                    <div className="mobile-cart" onClick={()=>{navigate('/retail/cart')}}>
                        <Cart /> <div className="count">{ productCount }</div> 
                    </div>

                <Routes>
                        
                        <Route path="*" element={retailStore.categories ? <Filters categories={retailStore.categories}/> : <h2>Loading...</h2> } />
                        {/* <Route path="/:catalog/*" element={<Categories getCategories={getCategories} categories={categories} setSelectedCategory={setSelectedCategory}/>}/> */}
                    </Routes>
                     
                    <ProductsContainer 
                    products={retailStore.products} 
                    categories={retailStore.categories} 
                    fetchLoading={retailStore.fetchLoading} 
                    productsCount={retailStore.countAllProducts}
                    loadingProducts = {retailStore.loadingProduct}
                    />
                </div>
            </div>
        </div>
    )
    
}



function RenderCatalogHeader({catalogs}){
    return catalogs.map((catalog, index)=> {
        return <CatalogItem title={catalog.title}  id={catalog._id} key={index} />
    })
}


/*
{retailStore.catalogs.map((item, index)=> {
                        return <CatalogItem title={item.title} active={item._id === activeCatalog} id={item._id} key={index} />
                    } )}
                    */