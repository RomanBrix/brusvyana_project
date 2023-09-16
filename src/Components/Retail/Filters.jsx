import { useNavigate } from "react-router-dom";
// import { publicRequestRetail } from "../../requestMethods";
import useQuery from "./QueryHook";

export default function Filters({
    categories,
    setActiveCategory,
    activeCategory,
}) {
    const queryUrl = useQuery();
    const navigate = useNavigate();

    // const activeCategory = queryUrl.get("category");

    if (categories === null) {
        return (
            <div className="retail-filters retail-filters-loading">
                <h2>Loading</h2>
            </div>
        );
    }
    return (
        <div className="retail-filters">
            <div className="tag-name">Категорії</div>
            <div className="tag-container category-container">
                {categories.length > 0 ? (
                    renderCategory(categories)
                ) : (
                    <h2> Немає категорій </h2>
                )}
            </div>
        </div>
    );

    function renderCategory(categories) {
        return categories.map((item, index) => {
            return (
                <div
                    className={`tag ${activeCategory === item && "tag-active"}`}
                    key={index}
                    onClick={() => {
                        if (item === activeCategory) {
                            setActiveCategory("");
                        } else {
                            setActiveCategory(item);
                        }
                    }}
                >
                    {item}
                    {/* <span className="count">Продуктів: 0</span> */}
                </div>
            );
            // {item?.products?.length || 0}
        });
    }

    // function loadCategory(category) {
    //     const ct = queryUrl.get("catalog");

    //     const changeUrl = new URLSearchParams("catalog=null&category=null");
    //     changeUrl.set("category", category._id);
    //     changeUrl.set("catalog", ct);

    //     navigate("./?" + changeUrl.toString(), { replace: true });
    // }
}
