import { createUserAxiosRequest } from "../../requestMethods";
import SettungsNovaPochta from "../../Admin/Settings/NovaPochta";
import SettingsBotUsers from "../../Admin/Settings/BotUsers";

export default function Settings() {
    const userRequest_retail = createUserAxiosRequest();
    const userRequest_bot = createUserAxiosRequest("bot");

    return (
        <div className="admin admin-settings">
            <div className="content">
                <h1>Налаштування</h1>
                <SettungsNovaPochta userRequest={userRequest_retail} />
                <SettingsBotUsers userRequest={userRequest_bot} />
            </div>
        </div>
    );
}
