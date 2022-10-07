import { useState } from "react";
import { useMemo } from "react";
import { useRef } from "react";
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { PrettyDate } from "../../helpers";
import { createUserAxiosRequest } from "../../requestMethods"




export default function AdminProductsTable() {
    const [limit, setLimit ] = useState(50);
    const [page, setPage ] = useState(1);

    const [loadMore, setLoadMore ] = useState(false);
    const [lastPage, setLastPage ] = useState(false);
    const [products, setProducts ] = useState(null);
    

    const [scrollY, setScrollY] = useState(window.scrollY);
    const [bodyHeight, setBodyHeight] = useState(document.body.offsetHeight);

    // const anchorRef = useRef();
    // const isInViewport1 = useIsInViewport(anchorRef);
    console.log(scrollY);
    // console.log(bodyHeight);
    
    const adminRequest = createUserAxiosRequest();
    
    useEffect(()=>{
        if ((window.innerHeight + scrollY) >= bodyHeight) {

            if(bodyHeight !== 0){
                console.log('load');
                loadMoreProducts();
            }
            // alert("you're at the bottom of the page");
            
        }
    },[scrollY])
    useEffect(()=>{
        
        adminRequest.get('/products/adminRequest',
        {params:{
            options:{
                page 
            },
            limit
        }}
        )
        .then((res)=>{
            console.log(res.data);
            setProducts(res.data);
        })
        .catch(err=>console.log(err));

        const handleScroll = () => {
            setScrollY(window.scrollY);
            setBodyHeight(document.body.offsetHeight);

        };
        const handleResize = () => {
            setBodyHeight(document.body.offsetHeight);
        };

        window.addEventListener('scroll', handleScroll);
        // document.body.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            // document.body.removeEventListener('resize', handleResize);
        }
    }, [])


    // useEffect(()=>{
    //     if(products){
    //         renderProducts();
    //     }
    // },[products])

    



    // if(!products){
    //     return <div ref={anchorRef}>loading...</div>
    // }
    // console.log(products);
    return (
        <div className="all-users whiteBg">
            {
                scrollY > 150 ? <button className="btn btn-primary btn-top" onClick={()=>window.scrollTo(0,0)}>Наверх</button> : null
            }
            <div className="top">
                <h1>Користувачi </h1>
                <div className="search">
                    <input type="text" id="search" 
                        // value={search} 
                        // onChange={changeSearchValue}
                        placeholder={'Пошук (Назва)'}
                     />
                </div>
                <div className="btns">
                    <button className="btn btn-primary" onClick={()=>{
                        // /admin/product/:catalog/new
                    }}>Додати Продукт</button>
                </div>
            </div>

            <table>
                    <thead>
                        <tr>
                            
                            <th 
                                data-name={'_id'} 
                                data-type={'string'} 
                                // onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                            > 
                                {/* {renderArrow('_id', sortRule)}  */}
                                Image
                            </th>
                            <th 
                                data-name={'username'} 
                                data-type={'string'} 
                                // onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                            >
                                {/* {renderArrow('username',sortRule)} */}
                                 Назва
                            </th>
                            <th 
                                data-name={'email'} 
                                data-type={'string'} 
                                // onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                            >
                                {/* {renderArrow('email',sortRule)} */}
                                 Ціна
                            </th>
                            <th 
                                data-name={'category'} 
                                data-type={'string'} 
                                // onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                            >
                                {/* {renderArrow('email',sortRule)} */}
                                Категорія
                            </th>
                            <th 
                                data-name={'isAdmin'} 
                                data-type={'boolean'} 
                                // onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                            >
                                {/* {renderArrow('isAdmin',sortRule)} */}
                                 Вартіанти
                            </th>
                            <th 
                                data-name={'createdAt'} 
                                data-type={'date'} 
                                // onClick={(e)=>{changeSortRule(e, setSortRule, sortRule)}}
                            >
                                {/* {renderArrow('createdAt', sortRule)} */}
                                 Дата ств.
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products && products.map((product, index)=>{
                                return <RenderProducts key={index} index={index} allLength={products.length} product={product} />
                            })
                        }
                    </tbody>
                </table>
        </div>
    )

    function loadMoreProducts(){
        if(loadMore) {
            console.log('w8');
            return;
        };
        if(lastPage){
            console.log('last page');
            return;
        }

        setLoadMore(true);
        let newPage = page + 1;
        adminRequest.get('/products/adminRequest',
        {params:{
            options:{
               page: newPage 
            },
            limit
        }}
        )
        .then((res)=>{
            console.log(res.data);
            if(res.data.length === 0){
                setLastPage(true);
                // setPage(newPage);
                setLoadMore(false);
            }else{
                setPage(newPage);
                setLoadMore(false);
                setProducts([...products, ...res.data]);
            }
            
            
        })
        .catch(err=>console.log(err));
    }
    // function renderProducts(products){
    //     if(!products || products.length === 0){
    //         return <tr > 
    //             <td> Немає продуктів </td>
    //             <td> Немає продуктів </td>
    //             <td> Немає продуктів </td>
    //             <td> Немає продуктів </td>
    //             <td> Немає продуктів </td>
    //             <td> Немає продуктів </td>
    //         </tr> 
    //     }

    //     return products.map((product, index)=>{
    //         const date = PrettyDate(product.createdAt, 'dd/mm/yyyy');
    //         return (
    //             <tr key={product._id} ref={(el)=>{
    //                 if(index === products.length - 1){
    //                     console.log(el);
    //                     anchorRef.current = el;
    //                 }
    //             }}>
    //                 <td><img src={product.image} alt={product.image} /></td>
    //                 <td>{product.title}</td>
    //                 <td>{product.price} UAH</td>
    //                 <td>{product.category ? product.category.title :  'Немає'}</td>
    //                 <td>{product.variants.length }</td>
    //                 <td>{date}</td>
    //             </tr>
    //         )
    //     })
    // }
}

function RenderProducts({product, index, allLength}){

    // const anchorRef = useRef()
    const navigate = useNavigate();

    // console.log(anchorRef);
    if(!product){
        return <tr > 
            <td> Немає продуктів </td>
            <td> Немає продуктів </td>
            <td> Немає продуктів </td>
            <td> Немає продуктів </td>
            <td> Немає продуктів </td>
            <td> Немає продуктів </td>
        </tr> 
    }

        const date = PrettyDate(product.createdAt, 'dd/mm/yyyy');

        // if(index === allLength - 1){
        //     // console.log(anchorRef);
        //     return (
        //         <tr key={product._id} ref={anchorRef}>
        //             <td><img src={'/src/products/' + product.image} alt={product.image} /></td>
        //             <td>{product.title}</td>
        //             <td>{product.price} UAH</td>
        //             <td>{product.category ? product.category.title :  'Немає'}</td>
        //             <td>{product?.variants.length }</td>
        //             <td>{date}</td>
        //         </tr>
        //     )
        // }
        return (
            <tr key={product._id} onClick={()=>{navigate('/admin/product/' + product._id)}}>
                <td><img src={'/src/products/' + product.image} alt={product.image} /></td>
                <td>{product.title}</td>
                <td>{product.price} UAH</td>
                <td>{product.category ? product.category.title :  'Немає'}</td>
                <td>{product?.variants.length }</td>
                <td>{date}</td>
            </tr>
        )
}



const useIsInViewport = (element, rootMargin = 0) => {
    const [isVisible, setState] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setState(entry.isIntersecting);
            }, { rootMargin }
        );

        element.current && observer.observe(element.current);

        return () => observer.unobserve(element.current);
    }, []);

    return isVisible;
};
