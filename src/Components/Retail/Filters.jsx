


export default function Filters ({categories, activeCategory, setActiveCategory }){


    if(categories === null){
        return (
            <div className="retail-filters retail-filters-loading">
                <h2>Loading</h2>
            </div>
        )
    }
    return(
        <div className="retail-filters">
            <div className="tag-name">Категорії</div>
            <div className="tag-container category-container">
                {renderCategory(categories)}
            </div>
        </div>
    )


    function renderCategory(categories){
        return categories.map((item, index)=> {
            return <div 
                className={`tag ${activeCategory?._id === item._id && "tag-active"}`} 
                key={index} 
                onClick={()=>{setActiveCategory(item)}}>
                    {item.title} <span className="count">Продуктів: {item.products.length} </span>
                </div>
        } )
    }
} 