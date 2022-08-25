import { useNavigate } from "react-router-dom";




export default function NotFound() {
    const navigate = useNavigate();
    
    return(
        <div className="notFound">
            <div className="content">
                <h1>Not Found</h1>
                <div className="btn" onClick={()=>{navigate(-1)}}>Назад</div>
            </div>
        </div>
    )
}