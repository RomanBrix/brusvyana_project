import { Route, Routes } from "react-router-dom";
import VacancyAll from "../../Admin/Vacancy/VacancyAll";
import VacancyOne from "../../Admin/Vacancy/VacancyOne";

export default function Vacancy() {
    return (
        <div className="admin admin-vacancy admin-right-content">
            <div className="content">
                <Routes>
                    <Route index element={<VacancyAll />} />
                    <Route path=":id" element={<VacancyOne />} />
                </Routes>
            </div>
        </div>
    );
}
