import { useQuery } from "@tanstack/react-query";
import { createUserAxiosRequest } from "../../requestMethods";
import CatalogsTableNew from "../../Admin/Catalog/CatalogTable";
import { Route, Routes } from "react-router-dom";
import AdminCategories from "../../Admin/Catalog/Categories";

export default function Catalog() {
    const adminRequest = createUserAxiosRequest();

    const {
        data: catalogs,
        isError,
        isLoading,
        refetch: updData,
    } = useQuery(["catalogs"], fetchCatalogs, {
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });

    if (isLoading || isError)
        return (
            <div className="admin admin-products admin-right-content">
                <div className="content">
                    {isLoading && <h1>Loading</h1>}
                    {isError && <h1>Error</h1>}
                </div>
            </div>
        );

    // console.log(catalogs);
    return (
        <Routes>
            {/* <Route index element={<Navigate to="/admin/catalog/ctg" replace />} /> */}
            <Route
                index
                element={
                    <div className="admin admin-catalog admin-products admin-right-content">
                        <div className="content">
                            <CatalogsTableNew
                                catalogs={catalogs}
                                updData={updData}
                            />
                        </div>
                    </div>
                }
            />

            {/* <Route path=":id" element={<AdminCategories />} /> */}
            {/* <Route path='ctgr/*' element={<SingleOrder/>} /> */}
        </Routes>
        // <div className="admin admin-catalog admin-products admin-right-content">
        //     <div className="content">
        //         <CatalogsTableNew catalogs={catalogs} />
        //     </div>
        // </div>
    );

    async function fetchCatalogs() {
        const { data } = await adminRequest.get("/catalog");

        return data;
    }
}
