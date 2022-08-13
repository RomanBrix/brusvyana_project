import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";



export default function Categories({categories, setCategories, setSelectedCategory}) {
    const params = useParams();
    const navigate = useNavigate();


    useEffect(()=>{
        axios.get(`http://192.168.1.104:1338/api/category/?catalog=${params.catalog}`).then(res=>{
            setCategories(res.data)
            // console.log(res.data)
        }).catch(err=>{ 
            console.log(err)
        })
        // eslint-disable-next-line
    },[])

  return (
    <div className="categories">
        <h2>Категории</h2>
        <div className="catalog-btn">
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
                </div>
            </div>
        )
    })
}

function goPage(url = '') {
    setSelectedCategory(url);
    navigate('./'+url)
}
}