import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { i } from 'vitest/dist/reporters-w_64AS5f.js';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    // await i18next.changeLanguage(newLang);
    i18n.language = newLang;
    console.log(i18n.language);
    
    document.documentElement.lang = newLang;
   
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
      aria-label={i18n.language === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
    >
      {i18n.language === 'ar' ? 'English' : 'العربية'}
    </button>
  );
};

export default LanguageSwitcher;
