import { useEffect, useState } from "react";

export default function ProductPagination({
    activePage,
    countAllProducts,
    setActivePage,
}) {
    const pageLimit = 10;
    const pagesCount = Math.ceil(countAllProducts / pageLimit);
    const [pages, setPages] = useState([]);
    // console.log(pagesCount)
    // const pages = [];
    //do empty n array
    useEffect(() => {
        const newPages = [];
        console.log(pagesCount);
        for (let i = 0; i < pagesCount; i++) {
            newPages.push(i);
        }
        setPages((prev) => newPages);
    }, [countAllProducts]);

    return (
        <div className="product-pagination">
            <div className="product-pagination-container">
                {pages.map((item, index) => {
                    return (
                        <div
                            className={`product-pagination-item ${
                                +activePage === item + 1 &&
                                "product-pagination-item-active"
                            }`}
                            key={index}
                            onClick={() => {
                                if (!(+activePage === item + 1)) {
                                    // scroll to top
                                    window.scrollTo(0, 0);
                                    setActivePage(item + 1);
                                }
                            }}
                        >
                            {item + 1}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
