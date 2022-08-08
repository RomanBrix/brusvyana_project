import { useContext } from "react";
import { MainPageLanguageContext } from "../hoc/MainPageLanguageProvider";

const useMainTranslate = () => useContext(MainPageLanguageContext);

export default useMainTranslate;