import { createContext, useState } from "react";
import { MainTranslate } from "../localData";


const MainPageLanguageContext = createContext();




function MainPageLanguageProvider({ children }) {
    const [language, setLanguageState] = useState(window.localStorage.getItem('mainLanguage') || 'ua');
    
    function setLanguage(lang) {
        setLanguageState(lang);
        window.localStorage.setItem('mainLanguage', lang);
    }
      
    function getLanguageBlock(block) {
        return MainTranslate[language][block];
      }
    // const [logged] = useState(window.localStorage.getItem('logged'))
  
  
    return (
      <MainPageLanguageContext.Provider value={{
        language,
        setLanguage,
        getLanguageBlock
        }}>
        {children}
      </MainPageLanguageContext.Provider>
    );
  }



  export  {MainPageLanguageProvider, MainPageLanguageContext};