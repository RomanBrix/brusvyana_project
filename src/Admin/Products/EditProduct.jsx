import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { publicRequestRetail, userRequestRetail } from "../../requestMethods";
import { ReactComponent as Uah } from "../../svg/Uah.svg";





export default function EditSingleProduct({id, goSetProductId, getProduct, product}) {
    const params = useParams();
    
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [newProduct, setNewProduct] = useState({...product, category: 'null'})
    const [changeFlag, setChangeFlag] = useState(false)
    const [disabledField, setDisabledField] = useState(false);
    const [categories, setCategories] = useState({all:[], selected:{_id: 'null'}});

    const navigate = useNavigate();
    
    
    useEffect(()=>{
        if(params.id !== id){
            goSetProductId(params.id)
        }
        // eslint-disable-next-line
    },[])
    useEffect(()=>{
        if(id.split('/')[0] !== product._id){
            if(id !== product._id){

                if(!(id.split('/')[1])){
                    getProduct(id);
                }
            }
        }
        if(id.split('/')[0]){
            publicRequestRetail.get('/category/' + id.split('/')[0]).then(res=>{
                setCategories(res.data)
                setNewProduct({...newProduct, category: res.data.selected._id})
            }).catch(err=>{
                console.log(err)
            })
        }
        // eslint-disable-next-line
    },[id])

    useEffect(()=>{
        setNewProduct({...product, category: categories.selected._id})
    },[product])




    //change price and qnty
    useEffect(()=>{
        if(newProduct?.variants.length > 0){
            let qnty = 0;
            let price = 0;
            let variantsOnline = newProduct.variants.filter(variant=> variant?.flag !== 'delete');
            variantsOnline.forEach(variant=>{
                qnty += +variant.quantity;
                price += +variant.price;
            })

            price = (price / variantsOnline.length) || 0
            // console.log('price: ', price, 'qnty: ', qnty);
            setNewProduct({...newProduct, price: Math.round(price) , quantity: qnty})
        }

        //check products variants flag field
        let disableChek = newProduct?.variants.filter(variant=> variant?.flag !== 'delete');
        // console.log(disableChek.length);
        if(disableChek.length > 0){
            setDisabledField(true);
        }else{
            setDisabledField(false);
        }


        // eslint-disable-next-line
    },[newProduct?.variants])
    
    console.log(newProduct.category);
    // console.log(categories);
    // console.log(categories.selected._id === null);
    return (
        <div className="admin admin-single-product admin-single-product-edit">
            <div className="content">
                <div className="left img-side">
                    <img src={`/src/products/${product.image}`} alt={ product.image }/>
                </div>
                <div className="right">
                    <div className="btns">
                        <div className="btn" onClick={()=>{
                            if(changeFlag){
                                if(window.confirm('Вы уверены, что хотите отменить изменения?')){
                                    navigate('../' + product._id, {replace: true})
                                }
                            }else{
                                navigate('../' + product._id, {replace: true})
                            }
                        }}>Отменить</div>
                        <div className="btn" onClick={()=>{saveProduct()}}>Сохранить</div>
                    </div>


                    <div className="category">
                        <select name="select" onChange={(e)=>{handleSelectChange(e)}} value={newProduct.category}> 
                            <option value={'null'}>Выберите категорию</option>
                            {renderCategories()}
                        </select>
                    </div>




                    <div className="title"><input type="text" value={newProduct.title} name='title' onChange={(e)=>{changeValue(e)}}/></div>

                    
                    <div className="price"> 
                        <Uah/>
                        <input 
                            type="number"
                            value={newProduct.price}
                            name='price' 
                            onChange={(e)=>{changeValue(e)}} 
                            disabled={disabledField}
                        />
                    </div>


                    <div className="variants">
                        <div className={`variant ${selectedVariant?.flag === 'new' && "variant-active"}`} onClick={()=>{setSelectedVariant({
                            image: null,
                            price: '',
                            quantity: '',
                            title: "",
                            flag: "new"
                        })}}>
                            <div className="variant-sub-title">Добавить</div>
                        </div>
                        { newProduct.variants.length > 0 ? renderVariants() : '' }
                    </div>


                    {
                        selectedVariant ?
                        <div className="variant-data">
                                <input 
                                    type="text" 
                                    placeholder="Название варианта"
                                    name='title'
                                    value={selectedVariant?.title}
                                    onChange={e=>{changeVariantInputs(e)}}
                                />
                                <input 
                                    type="number" 
                                    name="price"
                                    placeholder="Цена варианта"
                                    value={selectedVariant?.price}
                                    onChange={e=>{changeVariantInputs(e)}}
                                />
                                <input 
                                    type="number" 
                                    name="quantity"
                                    placeholder="Кол-во варианта"
                                    value={selectedVariant?.quantity}
                                    onChange={e=>{changeVariantInputs(e)}}
                                />

                                {
                                    selectedVariant?.flag === 'new' ? 
                                        <div className="btns">
                                            <div className="btn" onClick={()=>{
                                                if(changeFlag && window.confirm('Вы уверены, что хотите отменить изменения?')){
                                                    setSelectedVariant(null)
                                                }
                                            }}>Отменить</div> 
                                            <div className="btn" onClick={()=>{addVariant()}}>Добавить</div> 
                                        </div>
                                        :
                                        <div className="btns">
                                            <div className="btn" onClick={()=>{
                                                if(changeFlag && window.confirm('Вы уверены, что хотите отменить изменения?')){
                                                    setSelectedVariant(null)
                                                }
                                            }}>Отменить</div>
                                            <div className="btn" onClick={()=>{updateVariant()}}>Изменить</div>
                                            <div className="btn" onClick={()=>{deleteVariant()}}>Удалить</div>
                                        </div>
                                }
                        </div> : ''
                    }
                    
                    <div className="quantity">
                        В наличии: 
                        <input 
                            type="number" 
                            value={newProduct.quantity}
                            name='quantity' 
                            onChange={(e)=>{changeValue(e)}} 
                            disabled={disabledField}
                        />
                    </div>
                    <div className="description"> <textarea name="description" value={newProduct.description} onChange={(e)=>{changeValue(e)}}/></div>
                </div>

            </div>
        </div>
    )

    function saveProduct (){
        const {category, ...rest} = newProduct;
        userRequestRetail.put('/products/' + product._id, { product: {...rest}, category })
            .then(res => {
                // navigate('../' + product._id, {replace: true})
                getProduct(id);
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
    }

    function renderCategories (){
        return categories.all.map(category=>{
            return (
                <option value={category._id}  key={category._id}>{category.title}</option>
            )
        })
    }
    function handleSelectChange({target}){
        console.log(target.value);
        // if(target.value !== categories.selected._id){
            setNewProduct({
                ...newProduct,
                category: target.value
            })
        // }
    }


    function addVariant(){
        
        setNewProduct(prev=>{
            return {
                ...prev,
                variants: [...prev.variants, {
                    ...selectedVariant,
                    flag: 'add'
                }]
            }
        })
        document.getElementsByClassName('variant-active')[0]?.classList.remove('variant-active')
        setSelectedVariant(null)

    }
    function updateVariant(){
        setNewProduct(prev=>{
            return {
                ...prev,
                variants: prev.variants.map(variant=>{
                    if(variant._id === selectedVariant._id){
                        return {
                            ...selectedVariant,
                            flag: 'update'
                        }
                    }else{
                        return variant
                    }
                })
            }
        })
        document.getElementsByClassName('variant-active')[0]?.classList.remove('variant-active')
        setSelectedVariant(null)
    }
    function deleteVariant(){
        setNewProduct(prev=>{
            return {
                ...prev,
                variants: prev.variants.map(variant=>{
                    if(variant._id === selectedVariant._id){
                        return {
                            ...selectedVariant,
                            flag: 'delete'
                        }
                    }
                    return variant
                })
            }
        })
        document.getElementsByClassName('variant-active')[0]?.classList.remove('variant-active')
        setSelectedVariant(null)

    }


    function changeVariantInputs({target}) {
        if(!changeFlag){
            setChangeFlag(true)
        }
        setSelectedVariant({...selectedVariant, [target.name]: target.value})
    }

    function changeValue({target}) {
        if(!changeFlag){
            setChangeFlag(true)
        }
        setNewProduct({...newProduct, [target.name]: target.value})
    }

    function renderVariants(){
        return newProduct.variants.filter(variant=> variant?.flag !== 'delete').map((variant, index)=>{
            return (
                <div className={`variant ${selectedVariant?._id === variant._id && "variant-active"}`} onClick={()=>{setSelectedVariant(variant)}} key={index}>
                    <div className="variant-sub-title">Вариант {index + 1}</div>
                </div>
            )
        }
        )
    }
}