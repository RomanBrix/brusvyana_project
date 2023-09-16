import { useQuery } from "@tanstack/react-query";
import { createUserAxiosRequest } from "../../requestMethods";
import CatalogsTableNew from "../../Admin/Catalog/CatalogTable";

export default function Catalog() {
    const adminRequest = createUserAxiosRequest();

    const {
        data: catalogs,
        isError,
        isLoading,
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
        <div className="admin admin-catalog admin-products admin-right-content">
            <div className="content">
                <CatalogsTableNew catalogs={catalogs} />
            </div>
        </div>
    );

    async function fetchCatalogs() {
        const { data } = await adminRequest.get("/catalog");

        return data;
    }
}
