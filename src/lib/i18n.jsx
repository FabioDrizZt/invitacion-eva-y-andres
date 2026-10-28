import { createContext, useContext, useMemo } from "react";
import es from "@/locales/es.json";
import en from "@/locales/en.json";
import id from "@/locales/id.json";

const locales = { es, en, id };

const LanguageContext = createContext("es");

/**
 * LanguageProvider wraps the app and provides the current language.
 * Reads the language from the invitation config (API response or static).
 *
 * @param {object} props
 * @param {"es"|"en"|"id"} props.language - Current language code
 * @param {React.ReactNode} props.children
 */
export function LanguageProvider({ language = "es", children }) {
  return (
    <LanguageContext.Provider value={language}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * useTranslation hook returns a `t` function for looking up translation keys.
 *
 * Keys are dot-separated paths into the locale JSON, e.g. "hero.days".
 *
 * @returns {{ t: (key: string) => string, language: string }}
 *
 * @example
 * const { t } = useTranslation();
 * return <h1>{t("hero.marriageTitle")}</h1>;
 */
export function useTranslation() {
  const language = useContext(LanguageContext);

  const t = useMemo(() => {
    const messages = locales[language] || locales.es || locales.en;

    return (key) => {
      const parts = key.split(".");
      let value = messages;
      for (const part of parts) {
        if (value == null || typeof value !== "object") return key;
        value = value[part];
      }
      return typeof value === "string" ? value : key;
    };
  }, [language]);

  return { t, language };
}
