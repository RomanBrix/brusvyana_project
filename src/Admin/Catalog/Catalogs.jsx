// import {  } from "react";
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { createUserAxiosRequest, publicRequestRetail } from "../../requestMethods"




export default function AdminCtg(){
    const [catalogs, setCatalogs] = useState(null);
    const navigate = useNavigate();
    const userRequestRetail = createUserAxiosRequest();
    
    useEffect(()=>{
        getCatalogs();
    },[])


    if(catalogs === null){
        return(
            <div className="ctgs whiteBg">
                <h3>Завантаження...</h3>
            </div>
        )
    }
    if(catalogs.length === 0){
        return(
            <div className="ctgs whiteBg">
                <h3>Каталогів немає</h3>
                <div className="catalogs-container">
                    <div className="cat" onClick={addCatalog}>
                        <span className="material-icons">add</span>
                    </div>
                </div>
            </div>
        )
    }

    console.log(catalogs)
    return (
        <div className="ctgs whiteBg">
            <h1>Каталоги</h1>
            <div className="catalogs-container">
                <div className="cat" onClick={addCatalog}>
                    <span className="material-icons">add</span>
                </div>
                {
                    renderCatalogs()
                }
            </div>
        </div>
    )


    function renderCatalogs(){
        return catalogs.map((ctg, index)=>{
            return(
                <div className="cat" key={index} onClick={()=>{navigate('./' + ctg._id)}}>
                    {ctg.title}
                </div>
            )
        })
    }

    function addCatalog() {
        const title = window.prompt("Введите название каталога", "Новый каталог");
        
        if(title){
            userRequestRetail.post('/catalog', {title}).then(()=>{
                getCatalogs();
            }).catch(err=>{
                console.log(err);
            })
        }
    }

    function getCatalogs() {
        publicRequestRetail.get('/catalog').then(res=>{
            setCatalogs(res.data)
        }).catch(err=>{ 
            console.log(err)
        })
    }
}