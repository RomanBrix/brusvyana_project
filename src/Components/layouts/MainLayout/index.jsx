import { Outlet } from "react-router-dom";
import { MainPageLanguageProvider } from "../../hoc/MainPageLanguageProvider";
import Footer from "./Footer";
import MainHeader from "./Header";
import CallMeBack from "../CallMeBack";

export default function MainLayout() {
    return (
        <MainPageLanguageProvider>
            <MainHeader />

            <Outlet />
            <CallMeBack />
            <Footer />
        </MainPageLanguageProvider>
    );
}
