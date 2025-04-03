import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          "Home": "Home",
          "All Members": "All Members",
          // Add more translations as needed
        }
      },
      ar: {
        translation: {
          "Home": "الرئيسية",
          "All Members": "جميع الأعضاء",
          // Add more translations as needed
        }
      }
    },
    lng: "en", // Default language
    fallbackLng: "en", // Fallback language
    interpolation: {
      escapeValue: false // React already does escaping
    }
  });

export default i18n; 