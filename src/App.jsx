import React from 'react'
import {
  Routes,
  Route,
} from "react-router-dom";
import MainLayout from "./Components/layouts/MainLayout";
import MainPage from "./Pages/MainPages/MainPage";

export default function App() {
  
  



  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayout/>}>
          <Route index element={<MainPage />} />
          {/* <Route path="teams" element={<Teams />}>
            <Route path=":teamId" element={<Team />} />
            <Route path="new" element={<NewTeamForm />} />
            <Route index element={<LeagueStandings />} />
          </Route> */}
        </Route> 
      </Routes>
    </div>
  );
}
