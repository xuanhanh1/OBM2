import { useSelector } from "react-redux";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { vi } from "./locales/vi";
import { en } from "./locales/en";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      vi: {
        translation: vi,
      },
    },
  });
export default function T(language) {
  try {
    return i18n.changeLanguage(language);
  } catch (error) {
    console.log("Unable to get locale");
  }
}
