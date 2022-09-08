import React from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Routes,
  Route,
  useLocation,
  Navigate 
} from "react-router-dom";
import InDevelop from './Components/InDevelop';
import AdminLayout from './Components/layouts/Admin';
import GeneralInfoLayout from './Components/layouts/GeneralInfoLayout';
import MainLayout from "./Components/layouts/MainLayout";
import RetailLayout from './Components/layouts/Retail/RetailLayout';
import NotFound from './Components/NotFound';
import Login from './Pages/Admin/Login';
import Products from './Pages/Admin/Products';
import SingleProduct from './Pages/Admin/SingleProduct';
import StatPage from './Pages/Admin/StatPage';
import Users from './Pages/Admin/Users';
import Cart from './Pages/RetailPages/Cart';
import About from './Pages/MainPages/About';
import Contact from './Pages/MainPages/Contact';
import Delivery from './Pages/MainPages/GeneralInfo/Delivery';
import Guarantee from './Pages/MainPages/GeneralInfo/Guarantee';
import Pay from './Pages/MainPages/GeneralInfo/Pay';
import Policy from './Pages/MainPages/GeneralInfo/Policy';
import MainPage from "./Pages/MainPages/MainPage";
import Partners from './Pages/MainPages/Partners';
import RetailCatalog from './Pages/RetailPages/Catalog';
import Product from './Pages/RetailPages/Product';
import OrderSuccess from './Pages/RetailPages/OrderSuccess';
import OrderError from './Pages/RetailPages/OrderError';
import Settings from './Pages/Admin/Settings';


export default function App() {
  
  


  const { pathname } = useLocation();
  useEffect(()=>{
    window.scrollTo(0,0)
  },[pathname]);

  const user  = useSelector(state =>  state.persistedReducer.user.currentUser);

  return (
    <div className="App">
      <div className="mobile-header-btn" onClick={(e)=>{openMobileHeader(e)}}>
        <div className="line"/>
        <div className="line"/>
        <div className="line"/>
      </div>
      <Routes>
          <Route path="/" element={<MainLayout/>}>
            <Route index element={<MainPage />} />

            <Route path="/about" element={<About/>}/>
            <Route path="/contacts" element={<Contact/>}/>


            <Route path="/partners" element={<Partners/> }/>

            <Route path="/general-info" element={<GeneralInfoLayout/> }>
              <Route index element={<Pay/> } />
              <Route path="pay" element={<Pay/> } />
              <Route path="delivery" element={<Delivery/> } />
              <Route path="guarantee" element={<Guarantee/> } />
              <Route path="policy" element={<Policy/> } />
            </Route>

            <Route path="/opt" element={<InDevelop/>}/>

            <Route path="/projects" element={<InDevelop/>}/>
            <Route path="/achievement" element={<InDevelop/>}/>
            <Route path="/wiki" element={<InDevelop/>}/>

            <Route path="*" element={<NotFound/>} />
          </Route> 
        

        <Route path='/admin' element={<AdminLayout user={ user }/> } >
          <Route path='/admin/login' element={ user  ? user.isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/" replace /> : <Login/> }/>
            
          {/* <Route index element={<StatPage/>} /> */}

          <Route index element={ !(user && user?.isAdmin) ? <Navigate to="/admin/login" replace /> : <StatPage/>} />
          <Route path='settings' element={ !(user && user?.isAdmin) ? <Navigate to="/admin/login" replace /> : <Settings/>} />
          <Route path='/admin/users' element={!(user && user?.isAdmin) ? <Navigate to="/admin/login" replace /> : <Users/>} />
          <Route path='/admin/products/*' element={!(user && user?.isAdmin) ? <Navigate to="/admin/login" replace /> : <Products/>} />
          <Route path='/admin/product/*' element={!(user && user?.isAdmin) ? <Navigate to="/admin/login" replace /> : <SingleProduct/>} />
        </Route>


        <Route path="/retail" element={<RetailLayout/>}>

          <Route index element={<Navigate to="/retail/products" replace />} />
          <Route path="product/:id" element={<Product/>} />
          {/* <Route path=":catalog" element={<RetailCatalog/>} /> */}
          <Route path="products/*" element={<RetailCatalog/>} />
          <Route path="cart" element={<Cart/>} />
          
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="order-error" element={<OrderError />} />
        </Route>
        
        


        <Route path="*" element={<NotFound/>} />

      </Routes>
    </div>
  );



  function openMobileHeader({target}){
    if(!target.classList.contains("mobile-header-btn")){

      document.getElementsByClassName('mobile-header-btn')[0].click();
      return
    }

    const header = document.getElementsByClassName('header')[0]
    if(header && header.classList.contains('open-mobile-header')){
      header.classList.remove('open-mobile-header')
      target.classList.remove('open-mobile-btn')
    }else{
      header.classList.add('open-mobile-header')
      target.classList.add('open-mobile-btn')
    }
  }
}
