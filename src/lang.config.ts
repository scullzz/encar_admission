import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ru from './locales/ru.json';
import uz from './locales/uz.json';

// Retrieve the saved language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem('language') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    uz: { translation: uz }
  },
  lng: savedLanguage, // Set initial language based on localStorage
  fallbackLng: 'en', // Fallback to 'en' if no language is set
  interpolation: {
    escapeValue: false // React already escapes by default
  }
});

export default i18n;
