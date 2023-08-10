import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { publicRequestRetail as usrRequest } from "../../../requestMethods";

export default function VacancyOne() {
    const { id } = useParams();
    const loacation = useLocation();
    const navigate = useNavigate();
    const htmlTextRef = useRef(null);

    const [vacancyData, setVacancyData] = useState(() => {
        if (loacation.state?.data) {
            return loacation.state?.data;
        }
        return null;
    });

    useEffect(() => {
        if (!id) return navigate("../", { replace: true });
        if (id && !vacancyData) {
            fetchData();
        }
    }, []);
    useEffect(() => {
        if (htmlTextRef.current && vacancyData) {
            htmlTextRef.current.innerHTML = vacancyData.text;
        }
    }, [htmlTextRef.current, vacancyData]);

    if (!vacancyData) {
        return (
            <div className="whiteBg">
                <h1>Loading</h1>
            </div>
        );
    }
    console.log(vacancyData);
    return (
        <>
            <button
                onClick={() => {
                    navigate("../");
                }}
            >
                Назад
            </button>
            <h1>{vacancyData.title}</h1>
            <div className="text" ref={htmlTextRef} />
            {vacancyData.g_form ? (
                <>
                    <button
                        onClick={() => {
                            window.open(vacancyData.g_form, "_blank");
                        }}
                    >
                        Залишити резюме
                    </button>
                    <h4>та\або</h4>
                </>
            ) : (
                ""
            )}
            <h3>Зв'яжіться з нами:</h3>
            <button
                onClick={() => {
                    navigate("/contacts");
                }}
            >
                Контакти
            </button>
        </>
    );

    function fetchData() {
        usrRequest
            .get("/vacancy/" + id)
            .then(({ data }) => {
                setVacancyData(data);
            })
            .catch((err) => {
                console.log(err);
                return navigate("..", { replace: true });
            });
    }
}
