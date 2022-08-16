import { Outlet } from "react-router-dom";
import Footer from "../MainLayout/Footer";
import RetailHeader from "./Header";



export default function RetailLayout() {
    

    return(
        <>
            <RetailHeader/>
            
            <Outlet/>

            <Footer/>
        </>
    )
}