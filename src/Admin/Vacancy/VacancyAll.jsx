import { useEffect, useState } from "react";
import { createUserAxiosRequest } from "../../requestMethods";
import { useNavigate } from "react-router-dom";
import { ReactComponent as TrashSvg } from "../../svg/Minus.svg";

export default function VacancyAll() {
    const [allVacancy, setAllVacancy] = useState([]);
    const [loading, setLoading] = useState(false);

    const usrRequest = createUserAxiosRequest();

    useEffect(() => {
        fetchData();
    }, []);
    const navigate = useNavigate();

    return (
        <div className="whiteBg">
            <h1>Список вакансій</h1>
            <div className="big-blcoks">
                <div className="block block-add" onClick={createVacancy}>
                    +
                </div>
                {renderBlocks(allVacancy)}
            </div>
        </div>
    );

    function renderBlocks(arr = []) {
        return arr.map((item) => {
            return (
                <div
                    className="block"
                    key={item._id}
                    onClick={() => {
                        goTo(item._id, item);
                    }}
                >
                    <div
                        className="trash"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteVacancy(item._id);
                        }}
                    >
                        <TrashSvg />
                    </div>
                    {item.title}
                </div>
            );
        });
    }

    async function deleteVacancy(id) {
        if (!window.confirm()) return;

        try {
            await usrRequest.delete("/vacancy/" + id);
            setAllVacancy((prev) => prev.filter((item) => item._id !== id));
        } catch (err) {
            console.log(err);
        }
    }
    async function createVacancy() {
        if (loading) return;
        setLoading(true);
        const data = await fetchNewOne();
        if (data) {
            goTo(data._id, data);
        } else {
            alert("Щось пішло не так...");
        }
        setLoading(false);
    }
    async function fetchNewOne() {
        try {
            const { data } = await usrRequest.post("/vacancy/new", {
                title: "New Vacancy",
            });
            return data;
        } catch (err) {
            console.log(err);
            return false;
        }
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
