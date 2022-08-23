



export default function ProductPagination({ activePage, countAllProducts, setActivePage }) {
    const pageLimit = 10;
    const pagesCount = Math.ceil(countAllProducts / pageLimit);
    // console.log(pagesCount)
    const pages = [];
    //do empty n array
    for (let i = 0; i < pagesCount; i++) {
        pages.push(i);
    }

    return (
        <div className="product-pagination">
            <div className="product-pagination-container">
                {
                    pages.map((item, index) => {
                        return (
                            <div className={`product-pagination-item ${+activePage === item + 1 && "product-pagination-item-active"}`} key={index} onClick={() => { if(!(+activePage === item + 1)) setActivePage(item + 1) }}>
                                {item + 1}
                            </div>
                        )})
                }
            </div>
        </div>
    )

}