export default function ProductsTableNew({
    productsCount,
    products,
    search,
    changePage,
}) {
    return (
        <div className="all-users whiteBg">
            <div className="top">
                <h1>Товари ({productsCount})</h1>
                <div className="search">
                    <input
                        type="text"
                        id="search"
                        value={search.searchQuery}
                        onChange={({ target }) => {
                            search.setSearchQuery((prev) => target.value);
                            changePage(1);
                            // setPage(1);
                        }}
                        placeholder={"Пошук (Назва)"}
                    />
                </div>
                <div className="btns">
                    <button
                        className="btn"
                        style={{ marginRight: "7px" }}
                        onClick={() => {
                            changePage(false);
                        }}
                    >
                        {`<=`}
                    </button>
                    <button
                        className="btn"
                        onClick={() => {
                            changePage();
                        }}
                    >
                        {`=>`}
                    </button>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Назва</th>
                        <th>Каталог</th>
                        <th>Категорія</th>
                        <th>Вартіанти</th>
                        <th>Наявність</th>
                        <th>SKU</th>
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
}

function RenderProducts({ product, index, allLength }) {
    // const anchorRef = useRef()
    // const navigate = useNavigate();

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

    // const date = PrettyDate(product.createdAt, "dd/mm/yyyy");
    return (
        <tr
            key={product._id}
            // onClick={() => {
            //     navigate("/admin/product/" + product._id);
            // }}
        >
            <td>
                {product.image ? (
                    <img
                        src={"/src/products/" + product.image}
                        alt={product.image}
                    />
                ) : (
                    "-"
                )}
            </td>
            <td>{product.title}</td>
            <td>{product.catalog}</td>
            <td>{product.category ? product.category : "Немає"}</td>
            <td>{product.variants}</td>
            <td>{product.isAvailable ? "+" : "-"}</td>
            <td>{product.SKU}</td>
        </tr>
    );
}
