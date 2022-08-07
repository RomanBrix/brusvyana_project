import React from 'react'
import {
  Routes,
  Route,
} from "react-router-dom";
import InDevelop from './Components/InDevelop';
import MainLayout from "./Components/layouts/MainLayout";
import NotFound from './Components/NotFound';
import About from './Pages/MainPages/About';
import Contact from './Pages/MainPages/Contact';
import MainPage from "./Pages/MainPages/MainPage";

export default function App() {
  
  



  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayout/>}>
          <Route index element={<MainPage />} />

          <Route path="/about" element={<About/>}/>
          <Route path="/contacts" element={<Contact/>}/>

          <Route path="/opt" element={<InDevelop/>}/>

          <Route path="/projects" element={<InDevelop/>}/>
          <Route path="/achievement" element={<InDevelop/>}/>
          <Route path="/wiki" element={<InDevelop/>}/>
          <Route path="/general-information" element={<InDevelop/>}/>

          <Route path="*" element={<NotFound/>} />
        </Route> 

        


        <Route path="/retail" element={<InDevelop/>}/>


        <Route path="*" element={<NotFound/>} />

      </Routes>
    </div>
  );
}
