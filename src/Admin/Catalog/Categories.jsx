import { createUserAxiosRequest, publicRequestRetail } from "../../requestMethods"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom";




export default function AdminCategories(){
    const [categories, setCategories] = useState(null);
    const [catalogName, setCatalogName] = useState('Превью каталога');
    const navigate = useNavigate();
    const userRequestRetail = createUserAxiosRequest();
    const params = useParams();
    
    useEffect(()=>{
        getCategories(params.id);
        getCatalogName()
        // eslint-disable-next-line
    },[])


    if(categories === null){
        return(
            <div className="ctgs whiteBg">
                <h3>Завантаження...</h3>
            </div>
        )
    }
    if(categories.length === 0){
        return(
            <div className="ctgs whiteBg">
                <div className="top">
                    <h3>{catalogName} (Категорій немає)</h3>
                    <button onClick={deleteCatalog}>Видалити Каталог</button>
                </div>
                <div className="catalogs-container">
                    <div className="cat" onClick={addCategory}>
                        <span className="material-icons">add</span>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="ctgs whiteBg">
            <div className="top">
                <h1>{catalogName}</h1>
                <button onClick={deleteCatalog}>Видалити Каталог</button>
            </div>

            <div className="catalogs-container">
                <div className="cat" onClick={addCategory}>
                    <span className="material-icons">add</span>
                </div>
                {
                    renderCategories()
                }
            </div>
        </div>
    )

    function getCatalogName(){
        publicRequestRetail.get(`/catalog/${params.id}`).then(res=>{
            // setCategories(res.data)
            console.log(res.data)
            setCatalogName(res.data.title);
        }).catch(err=>{ 
            console.log(err)
        })
    }
    function deleteCatalog() {
        if(!window.confirm("Видалити каталог?")) return;

        const id = params.id;
        userRequestRetail.delete('/catalog/'+id).then(res=>{
            navigate('..', {replace: true})
            // getCatalogs();
        }).catch(err=>{
            console.log(err);
            if(err.response.status === 400 ){
                alert( "Catalog has products")
            }
        })
    }
    function addCategory() {
        const title = window.prompt("Введите название категории", "Новая категория");
        
        if(title){
            userRequestRetail.post('/category', {title, catalog: params.id}).then(res=>{
                getCategories(params.id)
            }).catch(err=>{
                console.log(err);
            })
        }
    }

    function renderCategories(){
        return categories.map((ctg, index)=>{
            return(
                <div className="cat ctgrs" key={index} onClick={()=>{deleteCategory(ctg._id)}}>
                    <span className="title">
                        {ctg.title}
                    </span>
                    <span className="material-icons">delete_forever</span>
                </div>
            )
        })
    }


    function deleteCategory(id) {
        if(window.confirm("Видалити категорію?")){
            userRequestRetail.delete('/category/'+id).then(res=>{
                
                    getCategories(params.id)
            
            }).catch(err=>{
                console.log(err);
    
            })
        }
    }

    function getCategories(catalog) {

        publicRequestRetail.get(`/category/?catalog=${catalog}`).then(res=>{
                setCategories(res.data)
                // console.log(res.data)
            }).catch(err=>{ 
                console.log(err)
                navigate('..', {replace: true})
            })
    }
}