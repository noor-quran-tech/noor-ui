import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ar from "./locales/ar.json";
import en from "./locales/en.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    fallbackLng: "en",
    detection: {
      order: ["cookie", "htmlTag"],
      caches: ["cookie"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
