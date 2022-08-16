import { useNavigate } from "react-router-dom";
import { ReactComponent as LeafPattern } from "../../svg/LeafPattern.svg"




export default function CatalogItem({title, active, id}) {
        
    const navigate = useNavigate();
    
        
        return(
            <div className={`catalog-item ${active && "catalog-item-active"}`} onClick={()=>{navigate('../' + id)}}>
                <div className="bg"><LeafPattern/></div>
                <span>{title}</span>
            </div>
        )
    }