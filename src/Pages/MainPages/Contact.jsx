import useMainTranslate from "../../Components/hook/useMainTranslate";
import ContactsBlock from "../../Components/MainSite/Contacts/ContactsBlock";

export default function Contact() {
    const { getLanguageBlock } = useMainTranslate();
    const translate = getLanguageBlock("contacts");

    return <ContactsBlock translate={translate} />;
}
