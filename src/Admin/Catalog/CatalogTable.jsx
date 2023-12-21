import { useNavigate } from "react-router-dom";
import { createUserAxiosRequest } from "../../requestMethods";

export default function CatalogsTableNew({
    // productsCount,
    // products,
    // search,
    // changePage,
    updData,
    catalogs,
}) {
    const userRequestRetail = createUserAxiosRequest();

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
                <div className="btns">
                    <div className="cat" onClick={addCatalog}>
                        <span className="material-icons">add</span>
                    </div>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Назва</th>
                        <th>Продуктів</th>
                        {/* <th>SKU</th> */}
                        <th>-</th>
                    </tr>
                </thead>
                <tbody>
                    {catalogs &&
                        catalogs.map((catalog) => {
                            return (
                                <RenderProducts
                                    key={catalog.SKU}
                                    catalog={catalog}
                                    updData={updData}
                                />
                            );
                        })}
                </tbody>
            </table>
        </div>
    );

    function addCatalog() {
        const title = window.prompt(
            "Введите название каталога",
            "Новый каталог"
        );

        if (!title) return;
        try {
            const { data } = userRequestRetail.post("/catalog", { title });
            updData();
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }
}

function RenderProducts({ catalog, updData }) {
    // const anchorRef = useRef()
    const userRequestRetail = createUserAxiosRequest();

    const navigate = useNavigate();

    // console.log(anchorRef);
    if (!catalog) {
        return (
            <tr>
                <td> Немає продуктів </td>
                <td> - </td>
                <td> - </td>
            </tr>
        );
    }
    return (
        <tr
            onClick={() => {
                // navigate("./" + catalog._id);
            }}
        >
            <td>{catalog.title}</td>
            <td>{catalog.products}</td>
            {/* <td>{catalog.SKU}</td> */}
            <td>
                <span
                    className="material-icons"
                    onClick={() => {
                        deleteCatalog(catalog._id);
                        // deleteCatalog(catalog.SKU);
                    }}
                >
                    delete
                </span>
            </td>
        </tr>
    );

    async function deleteCatalog(id) {
        // console.log(id);
        try {
            const { data } = await userRequestRetail.delete(`/catalog/${id}`);
            updData();
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }
}
