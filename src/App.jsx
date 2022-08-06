import React from 'react'
import {
  Routes,
  Route,
} from "react-router-dom";
import MainLayout from "./Components/layouts/MainLayout";
import NotFound from './Components/NotFound';
import MainPage from "./Pages/MainPages/MainPage";

export default function App() {
  
  



  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayout/>}>
          <Route index element={<MainPage />} />

          <Route path="*" element={<NotFound/>} />
        </Route> 
        <Route path="*" element={<NotFound/>} />

      </Routes>
    </div>
  );
}
