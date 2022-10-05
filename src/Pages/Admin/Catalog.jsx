import { 
    // Navigate, useNavigate,
    Route, Routes  } from "react-router-dom";
import AdminCtg from "../../Admin/Catalog/Catalogs";
import AdminCategories from "../../Admin/Catalog/Categories";



export default function AdminCatalog(){


    // const navigate = useNavigate();

    return(
        
        <div className="admin admin-catalog admin-right-content">
            <div className="content">
                <Routes>
                    {/* <Route index element={<Navigate to="/admin/catalog/ctg" replace />} /> */}
                    <Route index element={<AdminCtg/>} />

                    <Route path=':id' element={<AdminCategories/>} />
                    {/* <Route path='ctgr/*' element={<SingleOrder/>} /> */}
                </Routes>
                {/* <StatPageOrders  orders={orders}/> */}
            </div>
        </div>
    )
}