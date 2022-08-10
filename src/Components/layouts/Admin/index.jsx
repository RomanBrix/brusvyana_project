import { Outlet } from "react-router-dom";
import AdminHeader from "./Header";



export default function AdminLayout() {
    
    return(
        <>
            <AdminHeader/>
            <Outlet/>
        </>
    )
}
