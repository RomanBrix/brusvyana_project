import { useState } from "react";
// import { useMemo } from "react";
// import { useRef } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PrettyDate } from "../../helpers";
import {
    createUserAxiosRequest,
    publicRequestRetail,
} from "../../requestMethods";

export default function AdminProductsTable() {
    const [limit, setLimit] = useState(50);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchReq, setSearchReq] = useState(false);

    const [loadMore, setLoadMore] = useState(false);
    const [lastPage, setLastPage] = useState(false);
    const [products, setProducts] = useState(null);

    const [newProductLayer, setNewProductLayer] = useState(false);

    const [scrollY, setScrollY] = useState(window.scrollY);
    const [bodyHeight, setBodyHeight] = useState(document.body.offsetHeight);

    // const anchorRef = useRef();
    // const isInViewport1 = useIsInViewport(anchorRef);
    // console.log(scrollY);
    // console.log(bodyHeight);

    const adminRequest = createUserAxiosRequest();

    // console.log(page)
    // console.log(loadMore)
    console.log(products);

    useEffect(() => {
        // console.log(!loadMore && !lastPage && products);
        if (!loadMore && !lastPage && products) {
            setLoadMore(true);

            adminRequest
                .get("/products/adminRequest", {
                    params: {
                        options: {
                            page,
                            search,
                        },
                        limit,
                    },
                })
                .then((res) => {
                    console.log(res.data);
                    if (res.data.length === 0) {
                        setLastPage(true);
                        // setPage(newPage);
                        setLoadMore(false);
                    } else {
                        // setPage(newPage);
                        setLoadMore(false);
                        console.log(searchReq);
                        if (searchReq) {
                            setProducts(res.data);
                            setSearchReq(false);
                        } else {
                            setProducts([...products, ...res.data]);
                        }
                    }
                })
                .catch((err) => console.log(err));
        }
    }, [search, page, limit]);

    useEffect(() => {
        if (window.innerHeight + scrollY >= bodyHeight) {
            if (bodyHeight !== 0) {
                console.log("load");
                loadMoreProducts();
            }
            // alert("you're at the bottom of the page");
        }
    }, [scrollY]);

    useEffect(() => {
        setLoadMore(true);
        adminRequest
            .get("/products/adminRequest", {
                params: {
                    options: {
                        page,
                    },
                    limit,
                },
            })
            .then((res) => {
                console.log(res.data);
                setProducts(res.data);
                setLoadMore(false);
            })
            .catch((err) => console.log(err));

        const handleScroll = () => {
            setScrollY(window.scrollY);
            setBodyHeight(document.body.offsetHeight);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="all-users whiteBg">
            {scrollY > 150 ? (
                <button
                    className="btn btn-primary btn-top"
                    onClick={() => window.scrollTo(0, 0)}
                >
                    Наверх
                </button>
            ) : null}
            {newProductLayer && (
                <NewProductLayer setNewProductLayer={setNewProductLayer} />
            )}
            <div className="top">
                <h1>Товари </h1>
                <div className="search">
                    <input
                        type="text"
                        id="search"
                        value={search}
                        onChange={({ target }) => {
                            setSearch(target.value);
                            setSearchReq(true);
                            setPage(1);
                            setLastPage(false);
                        }}
                        placeholder={"Пошук (Назва)"}
                    />
                </div>
                <div className="btns">
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            // /admin/product/:catalog/new
                            setNewProductLayer(true);
                        }}
                    >
                        Додати Продукт
                    </button>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th
                            data-name={"_id"}
                            data-type={"string"}
                            // onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                        >
                            {/* {renderArrow('_id', sortRule)}  */}
                            Image
                        </th>
                        <th
                            data-name={"username"}
                            data-type={"string"}
                            // onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                        >
                            {/* {renderArrow('username',sortRule)} */}
                            Назва
                        </th>
                        <th
                            data-name={"email"}
                            data-type={"string"}
                            // onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                        >
                            {/* {renderArrow('email',sortRule)} */}
                            Ціна
                        </th>
                        <th
                            data-name={"category"}
                            data-type={"string"}
                            // onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                        >
                            {/* {renderArrow('email',sortRule)} */}
                            Категорія
                        </th>
                        <th
                            data-name={"isAdmin"}
                            data-type={"boolean"}
                            // onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                        >
                            {/* {renderArrow('isAdmin',sortRule)} */}
                            Вартіанти
                        </th>
                        <th
                            data-name={"createdAt"}
                            data-type={"date"}
                            // onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                        >
                            {/* {renderArrow('createdAt', sortRule)} */}
                            Дата ств.
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {products &&
                        products.map((product, index) => {
                            return (
                                <RenderProducts
                                    key={index}
                                    index={index}
                                    allLength={products.length}
                                    product={product}
                                />
                            );
                        })}
                </tbody>
            </table>
        </div>
    );

    function loadMoreProducts() {
        if (loadMore) {
            console.log("w8");
            return;
        }
        if (lastPage) {
            console.log("last page");
            return;
        }

        // let newPage = page + 1;
        setPage((pg) => pg + 1);
    }
    // function renderProducts(products){
    //     if(!products || products.length === 0){
    //         return <tr >
    //             <td> Немає продуктів </td>
    //             <td> Немає продуктів </td>
    //             <td> Немає продуктів </td>
    //             <td> Немає продуктів </td>
    //             <td> Немає продуктів </td>
    //             <td> Немає продуктів </td>
    //         </tr>
    //     }

    //     return products.map((product, index)=>{
    //         const date = PrettyDate(product.createdAt, 'dd/mm/yyyy');
    //         return (
    //             <tr key={product._id} ref={(el)=>{
    //                 if(index === products.length - 1){
    //                     console.log(el);
    //                     anchorRef.current = el;
    //                 }
    //             }}>
    //                 <td><img src={product.image} alt={product.image} /></td>
    //                 <td>{product.title}</td>
    //                 <td>{product.price} UAH</td>
    //                 <td>{product.category ? product.category.title :  'Немає'}</td>
    //                 <td>{product.variants.length }</td>
    //                 <td>{date}</td>
    //             </tr>
    //         )
    //     })
    // }
}

function RenderProducts({ product, index, allLength }) {
    // const anchorRef = useRef()
    const navigate = useNavigate();

    // console.log(anchorRef);
    if (!product) {
        return (
            <tr>
                <td> Немає продуктів </td>
                <td> Немає продуктів </td>
                <td> Немає продуктів </td>
                <td> Немає продуктів </td>
                <td> Немає продуктів </td>
                <td> Немає продуктів </td>
            </tr>
        );
    }

    const date = PrettyDate(product.createdAt, "dd/mm/yyyy");
    return (
        <tr
            key={product._id}
            onClick={() => {
                navigate("/admin/product/" + product._id);
            }}
        >
            <td>
                <img
                    src={"/src/products/" + product.image}
                    alt={product.image}
                />
            </td>
            <td>{product.title}</td>
            <td>{product.price} UAH</td>
            <td>{product.category ? product.category.title : "Немає"}</td>
            <td>{product?.variants.length}</td>
            <td>{date}</td>
        </tr>
    );
}

function NewProductLayer({ setNewProductLayer }) {
    const [catalogs, setCatalogs] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        getCatalogs();
    }, []);
    // console.log(catalogId);
    return (
        <div
            className="import-product-layer"
            onClick={() => {
                setNewProductLayer(false);
            }}
        >
            <div
                className="import-product-layer_content"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>Виберiть каталог:</h2>
                <div className="catalogs-container">{renderCatalogs()}</div>
            </div>
        </div>
    );

    function renderCatalogs() {
        return catalogs.map((catalog) => {
            return (
                <div
                    className="catalog_item"
                    key={catalog._id}
                    onClick={() => {
                        navigate(`/admin/product/${catalog._id}/new`);
                    }}
                >
                    {catalog.title}
                </div>
            );
        }, []);
    }

    function getCatalogs() {
        publicRequestRetail
            .get("/catalog")
            .then((res) => {
                setCatalogs(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

// eslint-disable-next-line
const useIsInViewport = (element, rootMargin = 0) => {
    const [isVisible, setState] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setState(entry.isIntersecting);
            },
            { rootMargin }
        );

        element.current && observer.observe(element.current);

        return () => observer.unobserve(element.current);
    }, []);

    return isVisible;
};
