import { useEffect } from "react";
import { useState } from "react";
import { Route, Routes, useParams,
    //  useLocation, 
    } from "react-router-dom"
import Catalog from "../../Admin/Products/Catalog";
import Categories from "../../Admin/Products/Categories";
import ImportProducts from "../../Admin/Products/ImportProducts";
import ProductsContainer from "../../Admin/Products/ProductsContainer";
import AdminProductsTable from "../../Admin/Products/ProductsTable";
import { publicRequestRetail } from "../../requestMethods";


export default function Products() {
    // const location = useLocation();
    const params = useParams();
    // console.log(location);
    // console.log(params);
    const [productsIds, setProductsIds] = useState([]);
    const [cataloges, setCataloges] = useState([]);
    const [categories, setCategories] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(params["*"].split('/')[1] || null);

    useEffect(()=>{
        if(!(params["*"].split('/')[1])){
            setSelectedCategory(null);
        }
        if(!(params["*"].split('/')[0])){
            setCategories([])
        }

        // eslint-disable-next-line
    },[params["*"]])


    useEffect(()=>{
        if(selectedCategory){
            let idsArr = categories.filter((category)=> category._id === selectedCategory)[0]?.products
            setProductsIds(idsArr || []);
        }else{
            let idsArr = [];
            categories.forEach((category)=>{
                idsArr = [...idsArr, ...category.products];
            } )
            setProductsIds(idsArr);
        }
        // eslint-disable-next-line
    }, [categories, selectedCategory])
    



    return(
        <div className="admin admin-products admin-right-content">
            <div className="content">
                <ImportProducts/>
                <AdminProductsTable/>
                
                
                {/* <div className="left">
                    <Routes>
                        <Route index element={<Catalog  cataloges={cataloges} getCatalogs={getCatalogs}/>} />
                        <Route path="/:catalog/*" element={<Categories getCategories={getCategories} categories={categories} setSelectedCategory={setSelectedCategory}/>}/>
                    </Routes>
                </div> */}


                {/* <div className="right"> */}
                        {/* {
                            params["*"] ? <ImportProducts/> : ''
                        } */}
                    {/* <Routes> */}
                        {/* <Route path="*" element={<h1>{ }</h1>} /> */}
                        
                        {/* <Route path="*" element={productsIds.length > 0 || selectedCategory ? <ProductsContainer getCategories={getCategories} productsIds={productsIds}/> : <h1>{params["*"] ? 'Выбери категорию' : 'Выбери каталог'}</h1>} />
                    </Routes> */}
                {/* </div> */}
            </div>
        </div>
    )


    // function getCatalogs() {
    //     publicRequestRetail.get('/catalog').then(res=>{
    //         setCataloges(res.data)
    //     }).catch(err=>{ 
    //         console.log(err)
    //     })
    // }

    // function getCategories(catalog) {
    //     publicRequestRetail.get(`/category/?catalog=${catalog}`).then(res=>{
    //             setCategories(res.data)
    //             // console.log(res.data)
    //         }).catch(err=>{ 
    //             console.log(err)
    //         })
    // }
}