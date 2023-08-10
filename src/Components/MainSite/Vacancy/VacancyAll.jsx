import { useEffect, useState } from "react";
import { publicRequestRetail as usrRequest } from "../../../requestMethods";
import { useNavigate } from "react-router-dom";

export default function VacancyAll() {
    const [allVacancy, setAllVacancy] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <>
            <h1>Список вакансій</h1>
            <div className="vacancy-container">{renderBlocks(allVacancy)}</div>
        </>
    );

    function renderBlocks(arr = []) {
        if (arr.length === 0) {
            return (
                <>
                    <h1>На жаль немає вакансій</h1>
                    <p>Попробуйте глянути пізніше</p>
                </>
            );
        }
        return arr.map((item) => {
            return (
                <div
                    className="block"
                    key={item._id}
                    onClick={() => {
                        goTo(item._id, item);
                    }}
                >
                    {item.title}
                </div>
            );
        });
    }
    function goTo(id, data) {
        navigate("./" + id, { state: { data } });
    }
    function fetchData() {
        usrRequest
            .get("/vacancy/all")
            .then(({ data }) => {
                setAllVacancy(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}
