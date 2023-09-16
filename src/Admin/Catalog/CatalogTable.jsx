export default function CatalogsTableNew({
    // productsCount,
    // products,
    // search,
    // changePage,
    catalogs,
}) {
    return (
        <div className="all-users whiteBg">
            <div className="top">
                <h1>Каталог ({catalogs.length})</h1>
                <div className="search">
                    <input
                        type="text"
                        id="search"
                        // value={search.searchQuery}
                        // onChange={({ target }) => {
                        //     search.setSearchQuery((prev) => target.value);
                        //     changePage(1);
                        //     // setPage(1);
                        // }}
                        placeholder={"Пошук (Назва)"}
                    />
                </div>
                <div className="btns"></div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Назва</th>
                        <th>Продуктів</th>
                        <th>SKU</th>
                    </tr>
                </thead>
                <tbody>
                    {catalogs &&
                        catalogs.map((catalog) => {
                            return (
                                <RenderProducts
                                    key={catalog.SKU}
                                    catalog={catalog}
                                />
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
}

function RenderProducts({ catalog }) {
    // const anchorRef = useRef()
    // const navigate = useNavigate();

    // console.log(anchorRef);
    if (!catalog) {
        return (
            <tr>
                <td> Немає продуктів </td>
                <td> Немає продуктів </td>
                <td> Немає продуктів </td>
            </tr>
        );
    }
    return (
        <tr>
            <td>{catalog.title}</td>
            <td>{catalog.products}</td>
            <td>{catalog.SKU}</td>
        </tr>
    );
}
