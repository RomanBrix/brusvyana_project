import { useDispatch } from "react-redux";
import {  useNavigate, } from "react-router-dom";
import { lengthOfAllCatalogProducts } from "../../Redux/retailApi";
import { ReactComponent as LeafPattern } from "../../svg/LeafPattern.svg"
import useQuery from "./QueryHook";




export default function CatalogItem({title, id}) {
        
    const navigate = useNavigate();
    
    const queryUrl = useQuery();
    const activeCatalog = queryUrl.get("catalog");

    const dispatch = useDispatch();
    
    const active = activeCatalog === id;
    
    
        
        return(
            <div className={`catalog-item ${active && "catalog-item-active"}`} onClick={()=>{clickGo()}}>
                <div className="bg"><LeafPattern/></div>
                <span>{title}</span>
            </div>
        )

        function clickGo(){

            lengthOfAllCatalogProducts(dispatch, activeCatalog);
            
            navigate('./?catalog=' + id)
        }
    }


