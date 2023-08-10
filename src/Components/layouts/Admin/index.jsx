import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";

import AdminHeader from "./Header";
import { logoutUser } from "../../../Redux/UserApi";
import { useDispatch } from "react-redux";

export default function AdminLayout({ user }) {
    const dispatch = useDispatch();

    const { pathname } = useLocation();
    useEffect(() => {
        const loged = Cookies.get("login");
        // console.log(loged)
        if (!loged) {
            logoutUser(dispatch);
        }
        // eslint-disable-next-line
    }, [pathname]);

    return (
        <>
            <div className="mmm">
                {user ? <AdminHeader /> : null}
                {/* <AdminHeader/> */}
                <Outlet />
            </div>
        </>
    );
}
