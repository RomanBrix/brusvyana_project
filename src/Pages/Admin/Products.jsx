import { useEffect, useState } from "react";
import { createUserAxiosRequest } from "../../requestMethods";
import { useQuery } from "@tanstack/react-query";
import ProductsTableNew from "../../Admin/Products/ProductsTableNew";
import { useSearchParams } from "react-router-dom";

export default function Products() {
    const adminRequest = createUserAxiosRequest();
    let [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(
        searchParams.get("search") || ""
    );
    const [pageQuery, setPageQuery] = useState(searchParams.get("page") || 1);

    useEffect(() => {
        changeSearchParams("search", searchQuery);
    }, [searchQuery]);
    useEffect(() => {
        changeSearchParams("page", pageQuery);
    }, [pageQuery]);

    const {
        data: products,
        isLoading,
        isError,
    } = useQuery(
        ["products", searchQuery, pageQuery],
        () => fetchProducts({ searchQuery, pageQuery }),
        {
            keepPreviousData: true,
            refetchOnWindowFocus: true,
            // refetchInterval: 2000,
        }
    );
    const { data: productsCount = 0 } = useQuery(
        ["productsCount"],
        () => fetchProductsCount(),
        {
            keepPreviousData: false,
            refetchOnWindowFocus: false,
            // refetchInterval: 2000,
        }
    );

    if (isLoading || isError)
        return (
            <div className="admin admin-products admin-right-content">
                <div className="content">
                    {isLoading && <h1>Loading</h1>}
                    {isError && <h1>Error</h1>}
                </div>
            </div>
        );
    return (
        <div className="admin admin-products admin-right-content">
            <div className="content">
                {/* productsCount: {productsCount} */}
                <ProductsTableNew
                    productsCount={productsCount}
                    products={products}
                    search={{
                        setSearchQuery,
                        searchQuery,
                    }}
                    // changeSearchParams={changeSearchParams}
                    changePage={changePage}
                />
            </div>
        </div>
    );
    function changePage(state = true) {
        setPageQuery((prev) => {
            if (typeof state === "number") return state;
            if (state) return +prev + 1;

            if (+prev === 1) return 1;
            return --prev;
        });
    }

    function changeSearchParams(key, value) {
        if (value) {
            if (searchParams.has(key)) {
                searchParams.set(key, value);
            } else {
                searchParams.append(key, value);
            }
        } else {
            searchParams.delete(key);
        }
        setSearchParams(searchParams);
    }

    async function fetchProducts({ searchQuery, pageQuery }) {
        const { data } = await adminRequest.get("/productsV2/products", {
            params: {
                searchQuery,
                pageQuery,
            },
        });
        return data;
    }
    async function fetchProductsCount() {
        const { data } = await adminRequest.get("/productsV2/prod-count");
        return data;
    }
}
