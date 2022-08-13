import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";




export default function Catalog({cataloges, setCataloges}){
    // const [cataloges, setCataloges] = useState([]);
    const navigate = useNavigate();
    
    useEffect(()=>{
        axios.get('http://192.168.1.104:1338/api/catalog').then(res=>{
            setCataloges(res.data)
            console.log(res.data)
        }).catch(err=>{ 
            console.log(err)
        })
        // eslint-disable-next-line
    },[])

    return(
        <div className="catalog">
            <h2>Каталоги</h2>
            {renderCataloges()}
        </div>
    )
    function renderCataloges(){
        return cataloges.map(catalog=>{
            return(
                <div className="catalog" key={catalog._id} onClick={()=>{goPage(catalog._id)}}>
                    <h2>{catalog.name}</h2>
                    <div className="catalog-btn">
                        {catalog.title}
                    </div>
                </div>
            )
        })
    }

    function goPage(url = '') {
        navigate('/admin/products/'+url)
    }
} 