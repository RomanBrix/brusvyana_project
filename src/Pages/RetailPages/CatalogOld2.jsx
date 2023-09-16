import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CatalogItem from "../../Components/Retail/CatalogItem";
import Filters from "../../Components/Retail/Filters";
import ProductsContainer from "../../Components/Retail/Products";
import { getAllCataloges, getCategoriesOfCatalog, fetchProducts } from "../../Redux/retailApi";



export default function RetailCatalog(){
    


    const params = useParams();
    const [activeCatalog, setActiveCatalog] = useState(params.catalog === 'search' ? null : params.catalog);
    const [activeCategory, setActiveCategory] = useState(null);

    
    const navigate = useNavigate();
    
    
    const retailStore = useSelector(state => state.retail);
    const dispatch = useDispatch();
    
    // console.log(params.catalog)
    // console.log(retailStore)

    // initial page load
    useEffect(()=>{
        if(params.catalog === 'search'){
            //load all catalogs and set active first
            getAllCataloges(dispatch, (activeFirst)=>{
                navigate('../'+activeFirst, {replace: true});
            });
        }else{
            setActiveCatalog(params.catalog);
            // load category and products
            getCategoriesOfCatalog(dispatch, params.catalog, (err)=>{
                if(err){
                    console.log(err)
                    navigate('../search', {replace: true});
                }
            });
            
        }
        setActiveCategory(null)
        // eslint-disable-next-line
    },[params.catalog]);


    //load products
    useEffect(()=>{
        if(retailStore.countAllProducts !== null){
            // if(retailStore.categories.length < 1){
            //     thereIsNoProducts(dispatch)
            // }
            if(retailStore.countAllProducts?.length > 0){
                console.log('go load');
                fetchProducts(dispatch, retailStore.countAllProducts);
            }else{
                // thereIsNoProducts(dispatch)
            }
        }
        // eslint-disable-next-line
    },[retailStore.countAllProducts]);


    //load products by category
    useEffect(()=>{
        if(activeCategory != null){
            fetchProducts(dispatch, activeCategory.products);
        }else{
            if(retailStore.countAllProducts?.length > 0){
                fetchProducts(dispatch, retailStore.countAllProducts);
            }
        }
        // eslint-disable-next-line
    }, [activeCategory])

    return(
        <div className="retail retail-catalog">
            <div className="content">
                <div className="catalog-header">
                    {retailStore.catalogs.map((item, index)=> {
                        return <CatalogItem title={item.title} active={item._id === activeCatalog} id={item._id} key={index} />
                    } )}
                </div>
                <div className="retail-content">
                    <Filters categories={retailStore.categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>
                    <ProductsContainer products={retailStore.products} setActiveCategory={setActiveCategory} activeCategory={activeCategory} categories={retailStore.categories}/>
                </div>
            </div>
        </div>
    )
}