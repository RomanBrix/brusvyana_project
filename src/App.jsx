import React from 'react'
import { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import InDevelop from './Components/InDevelop';
import GeneralInfoLayout from './Components/layouts/GeneralInfoLayout';
import MainLayout from "./Components/layouts/MainLayout";
import NotFound from './Components/NotFound';
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
        


        <Route path="/retail" element={<InDevelop/>}/>


        <Route path="*" element={<NotFound/>} />

      </Routes>
    </div>
  );
}
