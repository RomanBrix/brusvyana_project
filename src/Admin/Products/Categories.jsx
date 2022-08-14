// import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userRequestRetail } from "../../requestMethods";



export default function Categories({categories, setSelectedCategory, getCategories}) {
    const params = useParams();
    const navigate = useNavigate();


    useEffect(()=>{
        getCategories(params.catalog)
        // eslint-disable-next-line
    },[])

  return (
    <div className="categories">
        <h2>Категории</h2>
        <div className="catalog-btn" onClick={()=>{addCategory()}}>
            Добавить категорию
        </div>
        {renderCategories()}
    </div>
  );
  function renderCategories(){
    return categories.map(category=>{
        return(
            <div className="category" key={category._id} onClick={()=>{goPage(category._id)}}>
                <h2>{category.name}</h2>
                <div className="catalog-btn">
                    {category.title} [ {category.products.length} ]
                    <div className="delete" onClick={(e)=>{
                            e.stopPropagation();
                            deleteCategory(category._id)
                        }}>
                            X
                    </div>
                </div>
            </div>
        )
    })
}


function deleteCategory(id) {
    if(window.confirm("Вы уверены?")){
        userRequestRetail.delete('/category/'+id).then(res=>{
            
                getCategories(params.catalog)
        
        }).catch(err=>{
            console.log(err);

        })
    }
}

function addCategory() {
    const title = window.prompt("Введите название категории", "Новая категория");
    
    if(title){
        userRequestRetail.post('/category', {title, catalog: params.catalog}).then(res=>{
            getCategories(params.catalog)
        }).catch(err=>{
            console.log(err);
        }).finally(()=>{
            setSelectedCategory(null)
        }
        )
    }
}

function goPage(url = '') {
    setSelectedCategory(url);
    navigate('./'+url)
}
}