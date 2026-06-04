"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang } from "./translations";

type LangCtx = { lang: Lang; setLang: (l: Lang) => void };

const LanguageContext = createContext<LangCtx>({ lang: "FR", setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("FR");

  // On first load, restore the saved language from the cookie.
  useEffect(() => {
    const m = document.cookie.match(/emerge-lang=(FR|EN|AR)/);
    if (m) setLangState(m[1] as Lang);
  }, []);

  const setLang = (l: Lang) => {
    document.cookie = `emerge-lang=${l};path=/;max-age=31536000`;
    setLangState(l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
