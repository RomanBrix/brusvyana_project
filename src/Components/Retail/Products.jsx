import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { SuspenseImg } from "./LazyImg";
import { ReactComponent as Uah } from "../../svg/Uah.svg";
import ProductPagination from "./ProductPagination";

export default function ProductsContainer({
    products,
    state,
    productsCount,
    activePage,
    changePage,
}) {
    const navigate = useNavigate();

    if (state.loading || state.error) {
        let productsLoad = new Array(10);

        return (
            <div className="retail-products">
                <div
                    className="filter-btn"
                    onClick={(e) => {
                        toggleFilters(e);
                    }}
                >
                    <div className="line" />
                    <div className="line" />
                    <div className="line" />
                </div>
                {renderProduct(productsLoad, true)}
            </div>
        );
    }

    return (
        <div className="retail-products">
            <div
                className="filter-btn"
                onClick={(e) => {
                    toggleFilters(e);
                }}
            >
                <div className="line" />
                <div className="line" />
                <div className="line" />
            </div>
            {renderProduct(products)}
            <ProductPagination
                countAllProducts={productsCount}
                activePage={activePage}
                changePage={changePage}
            />
        </div>
    );

    function renderProduct(products, preload = false) {
        if (products.length === 0) return <h1>Продуктів немає</h1>;
        return products.map((item, index) => {
            return (
                <div
                    className={`product-item ${
                        preload ? "preload-product-item" : ""
                    }`}
                    key={index}
                    onClick={() => {
                        preload
                            ? console.log("hi")
                            : navigate("../product/" + item._id, {
                                  state: { product: item },
                              });
                    }}
                >
                    <div className="borders">
                        <div className="border border-top" />
                        <div className="border border-right" />
                        <div className="border border-bottom" />
                        <div className="border border-left" />
                    </div>
                    <div className="product-image">
                        {preload ? (
                            <span className="material-icons">image</span>
                        ) : (
                            <Suspense
                                fallback={
                                    <div className="preloadImg">
                                        <span className="material-icons">
                                            image
                                        </span>
                                    </div>
                                }
                            >
                                {/* // <img src={'/src/products/'+item.image} alt={item.title} loading="lazy"/> */}
                                <SuspenseImg
                                    alt=""
                                    // src={"/src/products/" + item.image}
                                    src={item.image}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/src/no-image.svg";
                                    }}
                                />
                            </Suspense>
                        )}
                    </div>
                    <div className="product-title">
                        {preload ? "" : item.title}
                    </div>
                    <div className="product-info">
                        <div className="product-price">
                            Від {preload ? "-" : item.price} <Uah />
                        </div>
                        <div className="description">
                            {preload
                                ? ""
                                : cutDescription(item.description, 55)}
                        </div>
                    </div>
                </div>
            );
        });
    }

    function toggleFilters({ target }) {
        if (!target.classList.contains("filter-btn")) {
            document.querySelector(".filter-btn").click();
            return;
        }

        const filtersBlock = document.querySelector(".retail-filters");

        if (filtersBlock.classList.contains("active-filters")) {
            filtersBlock.classList.remove("active-filters");
            target.classList.remove("active-filters-btn");
        } else {
            filtersBlock.classList.add("active-filters");
            target.classList.add("active-filters-btn");
        }
    }

    function cutDescription(description, n = 20) {
        if (description.length > n) {
            return description.substring(0, n) + "...";
        }
        return description;
    }
}
