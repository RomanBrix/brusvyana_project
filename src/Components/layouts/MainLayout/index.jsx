import { Outlet } from "react-router-dom";
import { MainPageLanguageProvider } from "../../hoc/MainPageLanguageProvider";
import Footer from "./Footer";
import MainHeader from "./Header";



export default function MainLayout() {
    

    return(
        <MainPageLanguageProvider>
            <MainHeader/>
            
            <Outlet/>

            <Footer/>
        </MainPageLanguageProvider>
    )
}