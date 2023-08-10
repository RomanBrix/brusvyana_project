import { Route, Routes } from "react-router-dom";
import VacancyAll from "../../Components/MainSite/Vacancy/VacancyAll";
import VacancyOne from "../../Components/MainSite/Vacancy/VacancyOne";

export default function Vacancy() {
    return (
        <div className="vacancy">
            <div className="content">
                <Routes>
                    <Route index element={<VacancyAll />} />
                    <Route path=":id" element={<VacancyOne />} />
                </Routes>
            </div>
        </div>
    );
}
