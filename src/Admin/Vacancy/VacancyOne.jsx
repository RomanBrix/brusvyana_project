import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import { createUserAxiosRequest } from "../../requestMethods";
import "react-quill/dist/quill.snow.css";

export default function VacancyOne() {
    const { id } = useParams();
    const loacation = useLocation();
    const usrRequest = createUserAxiosRequest();
    const navigate = useNavigate();

    const [vacancyData, setVacancyData] = useState(() => {
        if (loacation.state?.data) {
            return loacation.state?.data;
        }
        return null;
    });
    useEffect(() => {
        if (!id) return navigate("..", { replace: true });
        if (id && !vacancyData) {
            fetchData();
        }
    }, []);
    console.log(vacancyData);

    if (!vacancyData) {
        return (
            <div className="whiteBg">
                <h1>Loading</h1>
            </div>
        );
    }

    const modules = {
        toolbar: [
            [{ header: [2, 3, 4, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
            ],
            ["link"],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
        ],
    };
    // const formats = [];
    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "color",
        "background",
        "align",
    ];
    return (
        <div className="whiteBg edit-vacancy">
            <button className="save" onClick={saveData}>
                Сохранить
            </button>
            <div className="title">
                <input
                    type=""
                    value={vacancyData.title}
                    placeholder="Назва"
                    onChange={({ target }) => {
                        setVacancyData((prev) => ({
                            ...prev,
                            title: target.value,
                        }));
                    }}
                />
            </div>

            <div className="g_form">
                <input
                    type=""
                    value={vacancyData.g_form}
                    placeholder="Посилання на форму"
                    onChange={({ target }) => {
                        setVacancyData((prev) => ({
                            ...prev,
                            g_form: target.value,
                        }));
                    }}
                />
            </div>
            <div className="text">
                <ReactQuill
                    theme="snow"
                    modules={modules}
                    formats={formats}
                    value={vacancyData.text}
                    onChange={(val) => {
                        setVacancyData((prev) => ({ ...prev, text: val }));
                    }}
                />
            </div>
        </div>
    );
    function saveData() {
        usrRequest
            .put("/vacancy/" + id, {
                // params: {
                data: vacancyData,
                // },
            })
            .then(({ data }) => {
                if (data) {
                    alert("Збережено!");
                    navigate("..", { replace: true });
                }
            })
            .catch((err) => {
                console.log(err);
                return navigate("..", { replace: true });
            });
    }
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
