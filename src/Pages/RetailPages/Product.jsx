import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { publicRequestRetail } from "../../requestMethods";
import { ReactComponent as Uah } from "../../svg/Uah.svg";
import { ReactComponent as Guar } from "../../svg/Guar.svg";
import { goSetProducts } from "../../Redux/cartApi";
import { ReactComponent as Cart } from "../../svg/Cart.svg";

// import { ReactComponent as Approx} from "../../svg/approx.svg"

export default function Product() {
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);

    const cartStore = useSelector((state) => state.persistedReducer.cart);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const params = useParams();

    const {
        cart: { products },
    } = useSelector((state) => state.persistedReducer);
    const productCount =
        products.length > 0
            ? products.reduce((acc, curr) => {
                  return (acc += +curr.quantity);
              }, 0)
            : 0;

    // console.log(cartStore.products);

    useEffect(() => {
        if (params.id) {
            publicRequestRetail
                .get("/products/" + params.id)
                .then((res) => {
                    // console.log(res.data);
                    setProduct(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setProduct(null);
        }
        // eslint-disable-next-line
    }, []);

    if (product === null) {
        return (
            <div className="product-page">
                <div className="content">
                    <h1>Loading</h1>
                </div>
            </div>
        );
    }

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
                            src={"/src/products/" + product.image}
                            alt={product.name}
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

    function addToCart() {
        // console.log(cartStore.loading);
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
        let chekedElement = null;
        allProdutcsToDispatch.map((item, index) => {
            console.log("selected var: ", selectedVariant._id);
            console.log("item.variant: ", item.variant);
            console.log(item.variant === selectedVariant._id);

            if (selectedVariant) {
                if (item.variant === selectedVariant._id) {
                    chekedElement = index;
                }
            } else {
                if (item.id === prod.id) {
                    chekedElement = index;
                }
            }
            return item;
        });

        console.log("index: ", chekedElement);
        if (chekedElement !== null) {
            allProdutcsToDispatch[chekedElement] = {
                ...prod,
                quantity: allProdutcsToDispatch[chekedElement].quantity + 1,
            };
            // prod.quantity = cartStore.products[chekedElement].quantity + 1;
            // cartStore.products[chekedElement].quantity += 1;
            // dispatch(setProducts(cartStore.products));
        } else {
            allProdutcsToDispatch.push(prod);
            // cartStore.products.push(prod);
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
