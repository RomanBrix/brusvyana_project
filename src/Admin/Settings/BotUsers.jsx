import { useEffect, useState } from "react";

export default function SettingsBotUsers({ userRequest }) {
    const [newId, setNewId] = useState("");
    const [tableUsers, setTableUsers] = useState([]);

    useEffect(() => {
        //load tableusers
        getUsers();
    }, []);
    return (
        <div className="settings-block bot-users">
            <h2>Користувачі Бота</h2>
            <div className="add">
                <input
                    type="text"
                    placeholder="telegram id"
                    value={newId}
                    pattern="[0-9]*"
                    onChange={({ target }) => {
                        if (!target.validity.valid) return;
                        setNewId(target.value);
                    }}
                />
                <button onClick={addNewId}>Додати</button>
            </div>

            <div className="data-table">
                <div className="row">
                    <div className="username">Username</div>
                    <div className="id">ID</div>
                    <div className="funcs">\</div>
                </div>
                {renderTableData(tableUsers)}
            </div>
        </div>
    );

    function renderTableData(arr) {
        //render
        console.log(arr);

        return arr.map((item) => {
            const name = (() => {
                if (item.username.includes("@")) {
                    return (
                        <a
                            href={`https://t.me/${item.username.slice(1)}`}
                            target="_blank"
                        >
                            {item.username}
                        </a>
                    );
                }
                return item.username;
            })();
            return (
                <div className="row" key={item.id}>
                    <div className="username">{name}</div>
                    <div className="id">{item.id}</div>
                    <div className="funcs">
                        <button
                            onClick={() => {
                                deleteUser(item.id);
                            }}
                        >
                            Видалити
                        </button>
                    </div>
                </div>
            );
        });
    }
    function deleteUser(id) {
        //
        userRequest
            .delete("/user", { params: { id: id } })
            .then(({ data }) => {
                getUsers();
            })
            .catch((err) => {
                console.log(err);
            });
    }
    function addNewId() {
        console.log("add new id in db");

        userRequest
            .post("/user", { id: newId })
            .then(({ data }) => {
                if (data.status) {
                    alert("Добавлено!");
                    getUsers();
                } else {
                    alert(data.msg);
                }
            })
            .catch((err) => console.log(err));
    }

    function getUsers() {
        userRequest
            .get("/users")
            .then(({ data }) => {
                // console.log(data);
                setTableUsers(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}
