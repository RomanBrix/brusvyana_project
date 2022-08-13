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
import NotFound from './Components/NotFound';
import Login from './Pages/Admin/Login';
import Products from './Pages/Admin/Products';
import StatPage from './Pages/Admin/StatPage';
import Users from './Pages/Admin/Users';
import About from './Pages/MainPages/About';
import Contact from './Pages/MainPages/Contact';
import Delivery from './Pages/MainPages/GeneralInfo/Delivery';
import Guarantee from './Pages/MainPages/GeneralInfo/Guarantee';
import Pay from './Pages/MainPages/GeneralInfo/Pay';
import Policy from './Pages/MainPages/GeneralInfo/Policy';
import MainPage from "./Pages/MainPages/MainPage";
import Partners from './Pages/MainPages/Partners';


export default function App() {
  
  


  const { pathname } = useLocation();
  useEffect(()=>{
    window.scrollTo(0,0)
  },[pathname]);

  const user  = useSelector(state => state.user.currentUser);
  // console.log(user);
  // console.log(user.isAdmin);

  return (
    <div className="App">
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
        

        <Route path='/admin' element={<AdminLayout/> } >
          <Route path='/admin/login' element={ user  ? user.isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/" replace /> : <Login/> }/>
            
          {/* <Route index element={<StatPage/>} /> */}

          <Route index element={ !(user && user?.isAdmin) ? <Navigate to="/admin/login" replace /> : <StatPage/>} />
          <Route path='/admin/users' element={!(user && user?.isAdmin) ? <Navigate to="/admin/login" replace /> : <Users/>} />
          <Route path='/admin/products/*' element={!(user && user?.isAdmin) ? <Navigate to="/admin/login" replace /> : <Products/>} />
        </Route>


        <Route path="/retail" element={<InDevelop/>}/>


        <Route path="*" element={<NotFound/>} />

      </Routes>
    </div>
  );
}