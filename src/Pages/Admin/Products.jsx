import { useEffect } from "react";
import { useState } from "react";
import { Route, Routes, useParams,
    //  useLocation, 
    } from "react-router-dom"
import Catalog from "../../Admin/Products/Catalog";
import Categories from "../../Admin/Products/Categories";
import ProductsContainer from "../../Admin/Products/ProductsContainer";
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
        <div className="admin admin-products">
            <div className="content">
                <div className="left">
                    <Routes>
                        <Route index element={<Catalog  cataloges={cataloges} getCatalogs={getCatalogs}/>} />
                        <Route path="/:catalog/*" element={<Categories getCategories={getCategories} categories={categories} setSelectedCategory={setSelectedCategory}/>}/>
                    </Routes>
                    {/* пикаем каталог слева */}
                </div>


                <div className="right">
                    
                    <Routes>
                        <Route path="*" element={productsIds.length > 0 ? <ProductsContainer getCategories={getCategories} productsIds={productsIds}/> : <h1>{params["*"] ? 'Выбери категорию' : 'Выбери каталог'}</h1>} />
                    </Routes>
                </div>
            </div>
        </div>
    )


    function getCatalogs() {
        publicRequestRetail.get('/catalog').then(res=>{
            setCataloges(res.data)
        }).catch(err=>{ 
            console.log(err)
        })
    }

    function getCategories(catalog) {
        publicRequestRetail.get(`/category/?catalog=${catalog}`).then(res=>{
                setCategories(res.data)
                // console.log(res.data)
            }).catch(err=>{ 
                console.log(err)
            })
    }
}