import { Route, Routes } from "react-router-dom";
import AllUser from "../../Admin/Users/AllUsers";
import OneUser from "../../Admin/Users/OneUser";





export default function Users() {
    // const loactaion = useNavigation()
    
    return(
        <div className="admin admin-users admin-right-content">
            <div className="content">
                <Routes>
                    <Route index element={<AllUser/> } />
                    <Route path=":id" element={ <OneUser/> }/>
                </Routes>
            </div>
        </div>
    )
}