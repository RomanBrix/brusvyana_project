import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { PrettyDate } from "../../helpers";
import { createUserAxiosRequest } from "../../requestMethods";




export default function Settings() {
    const [pochtaUpdate, setPochtaUpdate] = useState(false);
    const [pochtaUpdateTime, setPochtaUpdateTime] = useState(null);

    const userRequest = createUserAxiosRequest();

    useEffect(()=>{
        userRequest.get('/np/updTime').then(({data})=>{
            if(data.time){
                setPochtaUpdateTime(PrettyDate(data.time));
                
            }else{
                setPochtaUpdateTime(null)
            }
            
        })
         // eslint-disable-next-line
    },[pochtaUpdate])
        
        return (
            <div className="admin admin-settings">
                <div className="content">
                    <h1>Settings</h1>

                    <div className="novapochta-block settings-block">
                        {
                            pochtaUpdate ? <div className="pochta-update">
                                Обновление данных, не закрывайте страницу... 
                            </div> : <div className="btn" onClick={updateNovaPochta}>Обновиить Таблицу Новой почты</div>
                        }
                        <div className="status">
                            <span>Последний раз обновленно: {pochtaUpdateTime ? pochtaUpdateTime : "Никогда"} </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    

        
        async function updateNovaPochta(){
            setPochtaUpdate(true)
            const novaApi = '1760ffa76a05a6350af1012644c044f6'
            const novaUrl = 'https://api.novaposhta.ua/v2.0/json/'
            const getCities =  {
                    "apiKey": novaApi,
                    "modelName": "Address",
                    "calledMethod": "getCities",
                    "methodProperties": {}
                }
            const npApiCities = await axios.post(novaUrl, getCities)
            const {success, data, warnings, warningCodes, errors, errorCodes} = npApiCities.data;
           console.log(npApiCities.data)
            if(success){
                const getWarehouses = {
                    "apiKey": novaApi,
                    "modelName": "Address",
                    "calledMethod": "getWarehouses",
                }
                const warehouses = await axios.post(novaUrl, getWarehouses)
                    const citiesToUpload = data.map(city => {
                        return {
                            city: city.Description,
                            cityRef: city.Ref,
                            area: city.AreaDescription,
                        }})
                    const warehousesToUpload = warehouses.data.data.map(warehouse => {
                        return {
                            cityRef: warehouse.CityRef,
                            warehouse: warehouse.Description,
                            city: warehouse.CityDescription,
                            // SettlementTypeDescription: warehouse.SettlementTypeDescription,
                        }})
                        //collect warehouses by city
                        // const warehousesByCity = warehousesToUpload.reduce((acc, warehouse) => {
                        //     const city = acc.find(city => city.cityRef === warehouse.cityRef)
                        //     if(city){
                        //         city.warehouses.push(warehouse)
                        //     }else{
                        //         acc.push({
                        //             cityRef: warehouse.cityRef,
                        //             city: warehouse.city,
                        //             warehouses: [warehouse]
                        //         })
                        //     }
                        //     return acc
                        // },[])
                        // console.log(warehousesByCity);
                    const payload = {cities: citiesToUpload, warehouses: warehousesToUpload}

                    // const payloadSize = new Blob([JSON.stringify(payload)]).size / 1024 / 1024;
                    // console.log( 'Payload size in MB: ', payloadSize);

                    //save
                    userRequest.post('/np/update', payload)
                        .then(res => {
                            if(res.data){
                                setPochtaUpdate(false)
                            }
                        })
                        .catch(err => console.log(err))

                    
            }else{
                console.log('error');
                console.log(errorCodes)
                console.log(errors)

                console.log('warnings');
                console.log(warnings)
                console.log(warningCodes)
            }
            
            // console.log(data);
        }
    }



    