import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { publicRequestRetail, createUserAxiosRequest } from "../../requestMethods";
import { ReactComponent as Uah } from "../../svg/Uah.svg";





export default function NewSingleProduct() {
    // eslint-disable-next-line
    const userRequestRetail = createUserAxiosRequest();

    const { catalog } = useParams();
    // console.log(catalog);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [newProduct, setNewProduct] = useState({
        title: '',
        description:'',
            price: '',
            image: '',
            quantity: '',
            isAvailable: '',
            variants: [],
            category: '',
    })
    const [changeFlag, setChangeFlag] = useState(false)
    const [disabledField, setDisabledField] = useState(false);
    const [categories, setCategories] = useState({all:[], selected:{_id: 'null'}});
    const [file,setFile] = useState({preview: null})

    const navigate = useNavigate();
    
    


    useEffect(()=>{
        if(categories.all.length === 0){
            publicRequestRetail.get('/category/catalog/' + catalog).then(res=>{
                // console.log(res.data)
                setCategories((prev)=>{
                    return(
                        {
                            ...prev, all: res.data
                        }
                    )
                })
            }).catch(err=>{
                console.log(err)
            })
        }
        // eslint-disable-next-line
    },[categories.all])


    //change price and qnty
    useEffect(()=>{
        if(newProduct?.variants.length > 0){
            let qnty = 0;
            let price = newProduct.variants[0].price;
            let variantsOnline = newProduct.variants.filter(variant=> variant?.flag !== 'delete');
            variantsOnline.forEach(variant=>{
                qnty += +variant.quantity;
                if(variant.price < price){
                    price = variant.price;
                }
            })
            setNewProduct({...newProduct, price: Math.round(price) , quantity: qnty})
        }
        
        let disableChek = newProduct?.variants.filter(variant=> variant?.flag !== 'delete');
        if(disableChek.length > 0){
            setDisabledField(true);
        }else{
            setDisabledField(false);
        }
        // eslint-disable-next-line
    },[newProduct?.variants])
    
    console.log(newProduct);
    // console.log(file);
    // console.log(categories);
    // console.log(categories.selected._id === null);
    return (
        <div className="admin admin-single-product admin-single-product-edit">
            <div className="content">
                <div className="left img-side">
                    {
                        newProduct.image ? (
                            <img src={`/src/products/${newProduct.image}`} alt=""/>
                        ) : (
                            
                                file.preview ? 
                                (
                                    <div className="add-img" onClick={()=>{document.getElementById('loadImg').click()}}>
                                        <img src={file.preview} alt="" />
                                        <input type='file' id="loadImg"name='file' onChange={(e)=>{handleFileChange(e)}}/>
                                    </div>
                                ) : (
                                    <div className="add-img" onClick={()=>{document.getElementById('loadImg').click()}}>
                                        <h2>Load img</h2>
                                        <input type='file' id="loadImg"name='file' onChange={(e)=>{handleFileChange(e)}}/>
                                    </div>
                                )
                            
                        )
                    }
                    
                </div>
                <div className="right">
                    <div className="btns">
                        <div className="btn" onClick={()=>{
                            if(changeFlag){
                                if(window.confirm('Вы уверены, что хотите отменить изменения?')){
                                    navigate('../', {replace: true})
                                }
                            }else{
                                navigate('../',  {replace: true})
                            }
                        }}>Отменить</div>
                        <div className="btn" onClick={(e)=>{saveProduct(e)}}>Сохранить</div>
                    </div>


                    <div className="category">
                        <select name="select" className="selectCategory" onChange={(e)=>{handleSelectChange(e)}} value={newProduct.category}> 
                            <option value={'null'}>Выберите категорию</option>
                            {renderCategories()}
                        </select>
                    </div>




                    <div className="title">
                        <input 
                            type="text" 
                            value={newProduct.title} 
                            name='title' 
                            placeholder="Название товара"
                            onChange={(e)=>{changeValue(e)}}
                        />
                    </div>

                    
                    <div className="price"> 
                        <Uah/>
                        <input 
                            type="number"
                            value={newProduct.price}
                            placeholder="Цена"
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
                            placeholder="Кол-во"
                            onChange={(e)=>{changeValue(e)}} 
                            disabled={disabledField}
                        />
                    </div>
                    <div className="description"> 
                    <textarea 
                        name="description" 
                        value={newProduct.description} 
                        placeholder="Описание"
                        onChange={(e)=>{changeValue(e)}}
                    /></div>
                </div>

            </div>
        </div>
    )
    
    function saveProduct (e){
        console.log(file.data);
        let bodyFormData = new FormData();
        bodyFormData.append('image', file.data);
        bodyFormData.append('product', JSON.stringify(newProduct));

        e.preventDefault();
        userRequestRetail.post('/products/new', bodyFormData)
        .then(res=>{
            console.log(res)
            alert('Saved')
            navigate(`/admin/products/${catalog}`)
        })
        .catch(err=>{
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
                    ...selectedVariant
                }]
            }
        })
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

    function handleFileChange(e){
        if(e.target?.files[0]){
            const img = {
                preview: URL.createObjectURL(e.target.files[0]),
                data: e.target.files[0],
            }
            setFile(img)
        }
    }

    function renderVariants(){
        return newProduct.variants.filter(variant=> variant?.flag !== 'delete').map((variant, index)=>{
            return (
                <div className={`variant ${selectedVariant?._id === variant._id && "variant-active"}`} onClick={()=>{setSelectedVariant(variant)}} key={index}>
                        <div className="variant-sub-title">{variant.title}</div>
                </div>
            )
        }
        )
    }
}