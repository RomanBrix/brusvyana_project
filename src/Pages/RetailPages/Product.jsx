import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { publicRequestRetail } from "../../requestMethods";
import { ReactComponent as Uah } from "../../svg/Uah.svg";
import { ReactComponent as Guar } from "../../svg/Guar.svg";
import { goSetProducts } from "../../Redux/cartApi";
import { ReactComponent as Cart } from "../../svg/Cart.svg";
import { useQuery } from "@tanstack/react-query";

// import { ReactComponent as Approx} from "../../svg/approx.svg"

export default function Product() {
    const navigate = useNavigate();
    const params = useParams();
    // console.log(params);
    // const { state: locationState } = useLocation();

    const cartStore = useSelector((state) => state.persistedReducer.cart);
    const productCount =
        cartStore.products.length > 0
            ? cartStore.products.reduce((acc, curr) => {
                  return (acc += +curr.quantity);
              }, 0)
            : 0;

    const {
        data: product,
        isError,
        isLoading,
    } = useQuery(["product"], () => fetchProduct(params.id || null), {
        keepPreviousData: true,
    });
    // const [product, setProduct] = useState(null);

    const [selectedVariant, setSelectedVariant] = useState(null);

    const dispatch = useDispatch();

    if (isLoading) {
        return (
            <div className="product-page">
                <div className="content">
                    <h1>Loading</h1>
                </div>
            </div>
        );
    }
    if (isError) return navigate("../", { replace: true });
    // console.log(product);
    return (
        <div className="product-page">
            <div className="content">
                <div
                    className="mobile-cart"
                    onClick={() => {
                        navigate("/retail/cart");
                    }}
                >
                    <Cart /> <div className="count">{productCount}</div>
                </div>
                <div className="img-container">
                    <div className="img-main">
                        <img
                            // src={"/src/products/" + product.image}
                            src={product.image}
                            alt={product.name}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/src/no-image.svg";
                            }}
                        />
                    </div>
                </div>
                <div className="info-container">
                    <div className="title">{product.title}</div>
                    {/*
                        product.variants.length > 0 ? 
                        <div className="variant-title">{ selectedVariant ? selectedVariant.title : '' }</div>
                        : null
                    */}

                    <div className="price">
                        {" "}
                        <Uah />
                        {selectedVariant
                            ? selectedVariant.price
                            : product.price}
                    </div>
                    <div className="variants">
                        {product.variants.length > 0 ? renderVariants() : ""}
                    </div>
                    {/* <div className="quantity">В наличии: {selectedVariant ? selectedVariant.quantity : product.quantity}</div> */}
                    <div className="description">{product.description}</div>

                    {/* <div className="guar">
                        <Guar/> <span><b>Гарантія.</b> Обмін/повернення товару впродовж 14 днів</span>
                    </div> */}
                    <div className="btns">
                        <div
                            className="btn btn-second"
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            Назад
                        </div>
                        <div
                            className="btn btn-primary"
                            onClick={() => {
                                addToCart();
                            }}
                        >
                            Додати в корзину
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    async function fetchProduct(id) {
        const { data } = await publicRequestRetail.get(
            "/productsV2/product/" + id
        );
        return data;
    }

    function addToCart() {
        // console.log(product);
        // console.log(product.variants.length);

        if (cartStore.loading) {
            return;
        }
        let prod = {
            id: product._id,
            variant: null,
            quantity: 1,
        };

        if (product.variants.length > 0) {
            if (selectedVariant) {
                // addToCart(dispatch, selectedVariant._id, 1);
                // alert('Варіант добавлений');
                prod.variant = selectedVariant._id;
            } else {
                alert("Виберіть варіант");
                return;
            }
        }

        const allProdutcsToDispatch = cartStore.products.map((item) => item);
        // console.log(allProdutcsToDispatch);
        // console.log(allProdutcsToDispatch);
        console.log(allProdutcsToDispatch);

        const dubleCartItemIndex = allProdutcsToDispatch.findIndex((item) =>
            selectedVariant
                ? item.variant === selectedVariant._id
                : item.id === prod.id
        );

        console.log("index: ", dubleCartItemIndex);
        if (dubleCartItemIndex !== null && dubleCartItemIndex !== -1) {
            allProdutcsToDispatch[dubleCartItemIndex] = {
                ...prod,
                quantity:
                    allProdutcsToDispatch[dubleCartItemIndex].quantity + 1,
            };
        } else {
            allProdutcsToDispatch.push(prod);
        }

        goSetProducts(dispatch, allProdutcsToDispatch);
    }

    function renderVariants() {
        return product.variants.map((variant, index) => {
            return (
                <div
                    className={`variant ${
                        selectedVariant?._id === variant._id && "variant-active"
                    }`}
                    onClick={() => {
                        setSelectedVariant(variant);
                    }}
                    key={index}
                >
                    <div className="variant-sub-title">{variant.title}</div>
                </div>
            );
        });
    }
}
