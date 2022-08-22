import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createUserAxiosRequest } from "../../requestMethods";




export default function ImportProducts(){

    const [csv, setCsv] = useState(null);
    const [zip, setZip] = useState(null);

    const userRequestRetail = createUserAxiosRequest();
    const params = useParams();
    const navigate = useNavigate();
    
    const catalogId = params['*'];
    console.log(catalogId);
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
        <div className="top">
                <div className="btn add-product" onClick={()=>{navigate(`/admin/product/${params['*'].split('/')[0]}/new`)}}>Добавить</div>
                <div className="btn load-product" onClick={()=>{
                    document.getElementById('csv').click();
                }}>Загрузить товар</div>
                <input type="file" name="csv" id="csv" onChange={(e)=>{onChangeCsv(e)}} accept=".csv" style={{display: 'none'}}/>

                <div className="btn load-product" onClick={()=>{
                    document.getElementById('zip').click();
                }}>Загрузить Фото</div>
                <input type="file" name="zip" id="zip" onChange={(e)=>{onChangeZip(e)}} accept=".zip, .rar" style={{display: 'none'}}/>
            </div>
    )


    
    function onChangeCsv(e){
        setCsv(e.target.files[0]);
    }
    function onChangeZip(e){
        setZip(e.target.files[0]);
    }




    function loadManyPhotos(){
        alert('go load')

        if(!zip) return;

        const formData = new FormData();
        formData.append('zip', zip);

        userRequestRetail.post('/products/productMagick', formData)
        .then(res=>{
            console.log(res.data);
            if(res.data){
                alert('Фото загружены, обновите страницу')
                setZip(null);
            }
        })
        .catch(err=>{console.log(err)})
    }




    
    function loadManyProducts(){
        if(!csv) return;

        const formData = new FormData();
        formData.append('csv', csv);

        userRequestRetail.post('/products/fileMagick/' + catalogId, formData)
        .then(res=>{
            console.log(res.data)
            if(res.data.status){
                const {addedProducts, addedVariants, addedCategories} = res.data;
                alert(`Загружено ${addedProducts} продуктов, ${addedVariants} вариантов и созданно ${addedCategories} категорий. Теперь загрузите изображения для продуктов.`)   
                setCsv(null);
            }
        }).catch(err=>{
            console.log(err)
            if(err.response.data?.message){
                alert(err.response.data?.message);
            }
        })

    }
}