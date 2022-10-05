// import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserAxiosRequest } from "../../requestMethods";




export default function Catalog({cataloges,  getCatalogs}){
    const navigate = useNavigate();
    const userRequestRetail = createUserAxiosRequest();
    useEffect(()=>{
        getCatalogs();
        // eslint-disable-next-line
    },[])

    return(
        <div className="catalog">
            <h2>Каталоги</h2>
            <div className="catalog" onClick={()=>{addCatalog()}}>
                <div className="catalog-btn">
                    Добавить каталог
                </div>
            </div>
            {renderCataloges()}
        </div>
    )
    function renderCataloges(){
        return cataloges.map(catalog=>{
            return(
                <div className="catalog" key={catalog._id} onClick={()=>{goPage(catalog._id)}}>
                    <div className="catalog-btn">
                        {catalog.title}

                        <div className="delete" onClick={(e)=>{
                            e.stopPropagation();
                            deleteCatalog(catalog._id)
                        }}>
                            X
                        </div>
                    </div>
                </div>
            )
        })
    }
    
    function deleteCatalog(id) {
        userRequestRetail.delete('/catalog/'+id).then(res=>{
            console.log(res.data)
            getCatalogs();
        }).catch(err=>{
            console.log(err);
            if(err.response.status === 400 ){
                alert( "Catalog has products")
            }
        })
    }

    function addCatalog() {
        const title = window.prompt("Введите название каталога", "Новый каталог");
        
        if(title){
            userRequestRetail.post('/catalog', {title}).then(res=>{
                getCatalogs();
            }).catch(err=>{
                console.log(err);
            })
        }
    }

    function goPage(url = '') {
        navigate('/admin/products/'+url)
    }
} 