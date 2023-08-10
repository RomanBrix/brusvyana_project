import { Outlet } from "react-router-dom";
import Footer from "../MainLayout/Footer";
import RetailHeader from "./Header";
import CallMeBack from "../CallMeBack";

export default function RetailLayout() {
    return (
        <>
            <RetailHeader />

            <Outlet />
            <CallMeBack />
            <Footer />
        </>
    );
}
