import { useQuery } from "@tanstack/react-query";
import { publicRequestRetail } from "../../requestMethods";
import CatalogItem from "../../Components/Retail/CatalogItem";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cart from "./Cart";
import { useSelector } from "react-redux";
import ProductsContainer from "../../Components/Retail/Products";
import Filters from "../../Components/Retail/Filters";

export default function RetailCatalog() {
    const navigate = useNavigate();
    const cartStore = useSelector((state) => state.persistedReducer.cart);
    const productCount =
        cartStore.products.length > 0
            ? cartStore.products.reduce((acc, curr) => {
                  return (acc += +curr.quantity);
              }, 0)
            : 0;

    const [searchParams, setSearchParams] = useSearchParams();
    const [activeCatalog, setActiveCatalog] = useState(
        searchParams.get("catalog") || ""
    );
    const [activeCategory, setActiveCategory] = useState(
        searchParams.get("category") || ""
    );
    const [activePage, setActivePage] = useState(
        searchParams.get("page") || ""
    );

    const {
        data: catalogs,
        isError: catalogsError,
        isLoading: catalogsLoad,
    } = useQuery(["catalogs"], fetchCatalogs, {
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
    const {
        data: products,
        isError: productsError,
        isLoading: productsLoad,
    } = useQuery(
        ["products", activeCatalog, activeCategory, activePage],
        () => fetchProducts(activeCatalog, activeCategory, activePage),
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false,
            enabled: !!activeCatalog,
        }
    );
    const { data: productsCount } = useQuery(
        ["prodCount", activeCatalog, activeCategory],
        () => fetchProductsCount(activeCatalog, activeCategory),
        { enabled: !!activeCatalog }
    );
    const { data: categories = [] } = useQuery(
        ["categories", activeCatalog],
        () => fetchCatalogsCategory(activeCatalog),
        {
            enabled: !!activeCatalog,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        }
    );

    // console.log(productsCount);
    //change catalogs
    useEffect(() => {
        if (catalogs && !activeCatalog && catalogs.length > 0) {
            setActiveCatalog(catalogs[0].SKU);
        }
        if (activeCatalog) {
            changeSearchParams("catalog", activeCatalog);
            setActivePage(1);
            setActiveCategory("");
        }
    }, [catalogs, activeCatalog]);

    useEffect(() => {
        changeSearchParams("category", activeCategory);
        setActivePage(1);
    }, [activeCategory]);
    useEffect(() => {
        changeSearchParams("page", activePage);
        // setActivePage(1);
    }, [activePage]);

    // console.log(products);
    return (
        <div className="retail retail-catalog">
            <div className="content">
                <div className="catalog-header">
                    <RenderCatalogHeader
                        catalogs={catalogs}
                        state={{ error: catalogsError, loading: catalogsLoad }}
                        setActiveCatalog={setActiveCatalog}
                    />
                </div>
                <div className="retail-content">
                    <div
                        className="mobile-cart"
                        onClick={() => {
                            navigate("/retail/cart");
                        }}
                    >
                        <Cart /> <div className="count">{productCount}</div>
                    </div>
                    <Filters
                        categories={categories}
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                    />
                    <ProductsContainer
                        products={products}
                        state={{ loading: productsLoad, error: productsError }}
                        productsCount={productsCount}
                        activePage={activePage}
                        changePage={changePage}
                    />
                </div>
            </div>
        </div>
    );

    function changePage(state = true) {
        setActivePage((prev) => {
            if (typeof state === "number") return state;
            if (state) return +prev + 1;

            if (+prev === 1) return 1;
            return --prev;
        });
    }

    async function fetchCatalogs() {
        const { data } = await publicRequestRetail("/catalog");
        return data;
    }

    async function fetchProductsCount(catalog, category) {
        const { data } = await publicRequestRetail("/productsV2/prod-count", {
            params: {
                catalog,
                category,
            },
        });
        return data;
    }
    async function fetchCatalogsCategory(catalog) {
        const { data } = await publicRequestRetail(
            "/productsV2/catalogs-category",
            {
                params: {
                    catalog,
                },
            }
        );
        return data;
    }
    async function fetchProducts(catalog, category, page) {
        const { data } = await publicRequestRetail("/productsV2/catalog-prod", {
            params: {
                catalog,
                category,
                page,
            },
        });
        return data;
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
}

function RenderCatalogHeader({ catalogs, state, setActiveCatalog }) {
    if (state.error) return <h1>Error Load Menu</h1>;
    if (state.loading) return <h1>Завантаження меню</h1>;
    return catalogs.map((catalog) => {
        return (
            <CatalogItem
                title={catalog.title}
                id={catalog.SKU}
                key={catalog.SKU}
                setActiveCatalog={setActiveCatalog}
            />
        );
    });
}
