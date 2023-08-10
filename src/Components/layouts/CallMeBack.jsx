import { useRef, useState } from "react";
import { ReactComponent as PhoneSvg } from "./svg/phone.svg";
import { ReactComponent as Arrow } from "../../svg/ArrowRight.svg";
import { notifyAdmin } from "../../helpers";
import { botPublicRequest } from "../../requestMethods";

export default function CallMeBack() {
    const [openWindow, setOpenWindow] = useState(false);
    const [phoneInput, setPhoneInput] = useState("");

    const inpRef = useRef(null);
    return (
        <>
            <div
                className={`call-me-btn ${
                    openWindow ? "call-me-btn-hide" : ""
                }`}
                onClick={() => {
                    open();
                }}
            >
                <PhoneSvg />
            </div>
            <div
                className={`call-me-back-container ${
                    openWindow ? "" : "call-me-back-container-hide"
                }`}
                tabIndex={1}
                onBlur={(e) => {
                    // console.log();
                    if (e.relatedTarget !== null) return;
                    close();
                    // setShowFilter(false);
                }}
            >
                <div className="cont">
                    <input
                        type="phone"
                        ref={inpRef}
                        value={phoneInput}
                        pattern="[ 0-9]*"
                        onChange={({ target }) => {
                            if (!target.validity.valid) return;
                            setPhoneInput(target.value);
                        }}
                        placeholder="Номер телефону"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                send();
                            }
                        }}
                    />
                    <button onClick={send}>
                        <Arrow />
                    </button>
                </div>
            </div>
        </>
    );

    function send() {
        const msg = `Просить перезвонить: ${phoneInput}`;
        // notifyAdmin(msg);
        botPublicRequest
            .post("/info", { msg })
            .then(({ data }) => {
                alert("Дякуємо!, Чекайте на дзвінок");
                console.log(data);
            })
            .catch((err) => {
                alert("Щось пішло не так, зателефонуйте будь-ласка нам");
                console.log(err);
            });
        close();
    }
    function close() {
        console.log("close");
        setPhoneInput("");
        setOpenWindow(false);
    }
    function open() {
        inpRef.current.focus();
        setOpenWindow(true);
    }
}
