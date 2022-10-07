import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
import { createUserAxiosRequest, publicRequestRetail } from "../../requestMethods";




export default function ImportProducts(){

    const [csv, setCsv] = useState(null);
    const [zip, setZip] = useState(null);

    const [importProductLayer, setImportProductLayer] = useState(false); 
    const [catalogId, setCatalogId] = useState(null);
    const [productLoad, setProductLoad] = useState(false);


    const userRequestRetail = createUserAxiosRequest();
    // const params = useParams();
    // const navigate = useNavigate();
    
    // const catalogId = params['*'];
    // console.log(catalogId);
    useEffect(()=>{
        if(csv){
            loadManyProducts()
        }
        // eslint-disable-next-line
    },[csv]);
    useEffect(()=>{
        if(zip){
            loadManyPhotos()
        }
        // eslint-disable-next-line
    },[zip]);
    return(
        <div className="import-products whiteBg">
                {/* <button className="btn add-product" onClick={()=>{navigate(`/admin/product/${params['*'].split('/')[0]}/new`)}}>Добавить</button> */}
                <button className="btn load-product" onClick={()=>{
                    // document.getElementById('csv').click();
                    setImportProductLayer(true);
                }}>Загрузить товар</button>
                <input type="file" name="csv" id="csv" onChange={(e)=>{onChangeCsv(e)}} accept=".csv" style={{display: 'none'}}/>
                <input type="file" name="zip" id="zip" onChange={(e)=>{onChangeZip(e)}} accept=".zip, .rar" style={{display: 'none'}}/>

                <button className="btn load-product" onClick={()=>{
                    document.getElementById('zip').click();
                }}>Загрузить Фото</button>

                {
                    importProductLayer && 
                    <ImportProductLayer
                        setImportProductLayer={setImportProductLayer} 
                        setCatalogId={setCatalogId} 
                        productLoad={productLoad}
                        catalogId={catalogId}
                    />

                }
            </div>
    )


    
    function onChangeCsv(e){
        setCsv(e.target.files[0]);
    }
    function onChangeZip(e){
        setZip(e.target.files[0]);
    }




    function loadManyPhotos(){
        // alert('go load')

        if(!zip) return;

        const formData = new FormData();
        formData.append('zip', zip);

        userRequestRetail.post('/products/productMagick', formData)
        .then(res=>{
            console.log(res.data);
            if(res.data){
                alert('Фото загружены, обновление страницы');
                setZip(null);
                window.location.reload();
            }
        })
        .catch(err=>{console.log(err)})
    }




    
    function loadManyProducts(){
        if(!csv) return;
        if(!catalogId) return;

        setProductLoad(true);
        
        const formData = new FormData();
        formData.append('csv', csv);
        formData.append('catalogId', catalogId);

        userRequestRetail.post('/products/fileMagick', formData)
        .then(res=>{
            console.log(res.data)
            if(res.data.status){
                const {addedProducts, addedVariants, addedCategories} = res.data;
                alert(`Загружено ${addedProducts} продуктов, ${addedVariants} вариантов и созданно ${addedCategories} категорий. Теперь загрузите изображения для продуктов.`)   
                setCsv(null);
                setProductLoad(false);
                setImportProductLayer(false);

            }
        }).catch(err=>{
            console.log(err)
            setCsv(null);
                setProductLoad(false);
                setImportProductLayer(false);
            if(err.response.data?.message){
                alert(err.response.data?.message);
            }
        })
    }
}






function ImportProductLayer({setImportProductLayer, setCatalogId, productLoad,catalogId }){
    const [catalogs, setCatalogs] = useState([]);
    useEffect(()=>{
        getCatalogs();

    },[])
    // console.log(catalogId);
    return(
        <div className="import-product-layer" onClick={()=>{setImportProductLayer(false)}}>
            <div className="import-product-layer_content" onClick={e=> e.stopPropagation()}>
                {
                    productLoad ? <div className="load">
                        <h2>Зачекайте...</h2>
                        <div className="loader"/>
                    </div>
                    :
                    <>
                        <h2>Виберiть каталог:</h2>
                        <div className="catalogs-container">
                            {renderCatalogs()}
                        </div>
                        {
                            catalogId && <button className="btn" onClick={()=>{document.getElementById('csv').click()}}>Загрузить товар</button>
                        }
                    </>
                }
            </div>
        </div>
    )

    function renderCatalogs(){

        
        return catalogs.map((catalog)=>{
            return (
                <div className="catalog_item" key={catalog._id}onClick={({target})=>{activateCatalog(target, catalog._id)}}>{catalog.title}</div>
            )
        },[])
    }

    function activateCatalog(target, id){
        document.querySelector('.catalog_item-active')?.classList.remove('catalog_item-active');
        target.classList.add('catalog_item-active');
        setCatalogId(id);
    }
    function getCatalogs() {
        publicRequestRetail.get('/catalog').then(res=>{
            setCatalogs(res.data)
        }).catch(err=>{ 
            console.log(err)
        })
    }
}