
import { useState, useEffect  } from 'react';
import Select from 'react-select';
import { publicRequestRetail } from '../../requestMethods';


export default function NovaPochta({selectCity, selectWarehouse, novaPochtaSelected}){


    const [novaPochtaValues, setNovaPochtaValue] = useState({
        cities: window.localStorage.getItem('npCities') ? JSON.parse(window.localStorage.getItem('npCities')) : null,
        warehouses: []
    });

    const [novaPochtaOptions, setNovaPochtaOptions] = useState({
        city: [],
        warehouse: []
    });
    

    useEffect(()=>{
        if(!novaPochtaValues.cities){
            console.log('Empty cities');
            
            publicRequestRetail.get('/np/cities').then(({data})=>{
                setNovaPochtaValue(prev=>({...prev, cities: data}))
                window.localStorage.setItem('npCities', JSON.stringify(data))
            })
        }

         // eslint-disable-next-line
    }, [novaPochtaValues.cities])

    useEffect(()=>{
        if(novaPochtaSelected.city){
            console.log('Load warehouses');
            publicRequestRetail.get('/np/cities', {params: {warehouse: novaPochtaSelected.city.value}}).then(({data})=>{
                console.log(data);
                setNovaPochtaOptions(prev=>({...prev, warehouse: data.map(warehouse=>({value: warehouse.city, label: warehouse.warehouse}))}))
                // setNovaPochtaValue(prev=>({...prev, cities: data}))
                // window.localStorage.setItem('npCities', JSON.stringify(data))
            })
        }

         // eslint-disable-next-line
    }, [novaPochtaSelected.city])

        // const cityOptions = citiesRetrurn();
        const style = {   
            control: () => ({
                // none of react-select's styles are passed to <Control />
                padding: 0,
                backgroundColor: 'transparent',
                border: 'none',
                width: '100%',
                display: 'flex',
                alignItems: 'center',

              }),
            
          }

        return (
            <>
                {/* <div className="hint"></div> */}
                <div className="one-input">
                    <label htmlFor="town" id="town">Ваше місто</label>
                    {/* <input type="text" className="text-input" id="town" placeholder="Ваше місто" value={courierFields.town} onChange={changeCourierFieldsData}/> */}
                    <Select
                        aria-labelledby="town"
                        inputId="town"
                        name="aria-town"
                        isSearchable={true}
                        loadingMessage={() => "Завантаження..."}
                        noOptionsMessage={() => "Нічого не знайдено"}
                        onInputChange={changeNovaPochtaCity}
                        onChange={selectCity}
                        placeholder={'Будь ласка, введіть 3 або більше символів'}
                        options={novaPochtaOptions.city}
                        className='text-input nonPadding'
                        styles={style}
                    />
                    {/* <select name="cars" id="cars">
                        {citiesRetrurn()}
                    </select> */}
                </div>
                <div className="one-input">
                    <label htmlFor="adress">Відділення </label>
                    <Select
                        aria-labelledby="adress"
                        inputId="adress"
                        name="aria-adress"
                        isSearchable={true}
                        loadingMessage={() => "Завантаження..."}
                        noOptionsMessage={() => "Спочатку виберіть місто"}
                        onChange={selectWarehouse}
                        placeholder={'Виберіть пункт відділення'}
                        options={novaPochtaOptions.warehouse}
                        className='text-input nonPadding'
                        styles={style}
                    />
                </div>
            </>
        )

        function changeNovaPochtaCity(city){
            // let ind = 0;
            if(!novaPochtaValues.cities) return;
            if(city.length > 2){
                const filtered = novaPochtaValues.cities.filter((item) => {
                    // console.log(item.city, city);
                    // ind = index;
                    return item.city.toLowerCase().includes(city.toLowerCase());
                })
                console.log(filtered);
                setNovaPochtaOptions((prevState) => {
                    return {
                        ...prevState,
                        city: filtered.map((item) => {
                            return {
                                value: item.cityRef,
                                label: item.city
                            }
                        })
                    }
                });
            }
        }
}