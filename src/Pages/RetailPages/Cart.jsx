import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { publicRequestRetail } from "../../requestMethods";
import { ReactComponent as Uah } from "../../svg/Uah.svg";
import { ReactComponent as Plus } from "../../svg/Plus.svg";
import { ReactComponent as Minus } from "../../svg/Minus.svg";
import PayForm from "../../Components/Retail/PayForm";
import { goSetProducts } from "../../Redux/cartApi";

export default function Cart() {
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalPriceWithoutDisc, setTotalPriceWithoutDisc] = useState(0);
    const [products, setProducts] = useState([]);

    const cartStore = useSelector((state) => state.persistedReducer.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // console.log(cartStore);
    // console.log(products);

    useEffect(() => {
        if (cartStore.products.length > 0) {
            let ids = cartStore.products.map((product) => product.id);

            publicRequestRetail
                .get("/productsV2/cart", { params: { ids } })
                .then((res) => {
                    // console.log(res.data);
                    const productForSave = doNiceProductView(res.data);
                    setProducts(productForSave);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setProducts([]);
        }
        // eslint-disable-next-line
    }, [cartStore.products]);

    //set price
    useEffect(() => {
        if (products.length > 0) {
            let price = products.reduce((acc, cur) => {
                return (acc += +cur.price);
            }, 0);
            const disc = price - (price * 20) / 100;
            setTotalPrice(price);
            // setTotalPriceWithoutDisc(price);
        } else {
            setTotalPrice(0);
            // setTotalPriceWithoutDisc(0);
        }
        // eslint-disable-next-line
    }, [products]);

    return (
        <div className="cart-page">
            <div className="content">
                <div className="products">
                    <div className="btns">
                        <div
                            className="btn btn-back"
                            onClick={() => {
                                navigate("/retail");
                            }}
                        >
                            Продовжити покупки
                        </div>

                        <div className="total">
                            Товара на суму:{" "}
                            <div className="price">
                                {/* <b className="discount">
                                    {totalPriceWithoutDisc}
                                </b> */}
                                {/* style={{ marginLeft: "7px" }} */}
                                <b>{totalPrice}</b>
                            </div>
                            <Uah />
                        </div>
                    </div>

                    <div className="products-container">
                        <div className="product">
                            <div className="img" />
                            <div className="title" />
                            <div className="count">Кількість</div>
                            <div className="price">Ціна</div>
                            <div className="delete">
                                <div
                                    className="delete-func"
                                    onClick={() => {
                                        removeAll();
                                    }}
                                >
                                    Видалити все
                                </div>
                            </div>
                        </div>

                        {products.length > 0
                            ? renderProducts(products)
                            : "Ви не додали продуктів до кошика!"}
                    </div>
                </div>
                <div className="paying-form">
                    <PayForm
                        products={products}
                        totalPrice={totalPrice}
                        user={{
                            user: cartStore.guestUser,
                            payment: cartStore.prefferedPaymentMethod,
                            delivery: cartStore.prefferedDeliveryMethod,
                        }}
                    />
                </div>
            </div>
        </div>
    );

    function removeAll() {
        goSetProducts(dispatch, []);
    }
    function removeNotItarebleProducts(id) {
        goSetProducts(
            dispatch,
            cartStore.products.filter((item) => item.id !== id)
        );
    }
    //REMOVE BLOCK OF PRODUCT
    function removeBlockCart(position) {
        const { products } = cartStore;
        const changeProd = products.filter((item, index) => index !== position);
        goSetProducts(dispatch, changeProd);
    }

    // ADD OR REMOVE ONE PIECE OF PRODUCT
    function manageQuanity(type, position) {
        const { products } = cartStore;

        let changeProd = [];
        switch (type) {
            case "plus":
                // changeProd[position].quantity += 1;
                changeProd = products.map((item, index) => {
                    if (index === position) {
                        // console.log(products[position].id);
                        return {
                            ...item,
                            quantity: item.quantity + 1,
                        };
                    }
                    return item;
                });
                break;
            case "minus":
                changeProd = products.map((item, index) => {
                    if (index === position) {
                        return {
                            ...item,
                            quantity: item.quantity - 1,
                        };
                    }
                    return item;
                });
                break;
            default:
                break;
        }
        if (changeProd[position].quantity === 0) {
            changeProd = changeProd.filter((item, index) => index !== position);
        }
        goSetProducts(dispatch, changeProd);
    }

    //RENDER PRODUCT
    function renderProducts(products) {
        return products.map((product, key) => {
            // console.log(product.variants);
            return (
                <div className="product" key={key}>
                    <div className="img">
                        <img
                            src={`/src/products/${product.image}`}
                            alt={product.title}
                        />
                    </div>
                    <div className="title">
                        {product.title}{" "}
                        {product?.variants && product.variants.length > 0 && (
                            <div className="sub">[ {product.varTitle} ]</div>
                        )}
                    </div>
                    <div className="count">
                        <Minus
                            onClick={() => {
                                manageQuanity("minus", product.position);
                            }}
                        />
                        <div className="man-count">{product.quantity}</div>
                        <Plus
                            onClick={() => {
                                manageQuanity("plus", product.position);
                            }}
                        />
                    </div>
                    <div className="price">
                        {product.price} <Uah />
                    </div>
                    <div className="delete">
                        <div
                            className="delete-func"
                            onClick={() => {
                                removeBlockCart(product.position);
                            }}
                        >
                            <Minus /> Видалити
                        </div>
                    </div>
                </div>
            );
        });
    }

    function doNiceProductView(data) {
        const prods = cartStore.products.map((item, index) => {
            const prod = data.find((product) => product._id === item.id);
            // console.log(prod);
            if (!prod) {
                removeNotItarebleProducts(item.id);
                return null;
            }
            let price = 0;
            let varTitle = null;
            let varSKU = null;
            if (item.variant) {
                const pickedVariant = prod.variants.find(
                    (variant) => variant._id === item.variant
                );
                price = pickedVariant.price * item.quantity;
                varTitle = pickedVariant.title;

                varSKU = pickedVariant.SKU;
            } else {
                price = prod.price * item.quantity;
            }
            return {
                ...prod,
                quantity: item.quantity,
                price,
                varTitle,
                varSKU,
                varId: item.variant,
                position: index,
            };
        });

        return prods.filter((item) => item);
    }
}
