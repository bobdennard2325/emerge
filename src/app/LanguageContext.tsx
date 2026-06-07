/**
 * EMERGE Capital — Prototype v1.8
 * ─────────────────────────────────────────────────────────────
 * File        : emerge/src/app/LanguageContext.tsx
 * Route       : root
 * Description : React context for language state, cookie persistence
 * Project     : Morocco's first AI-powered equity crowdfunding platform
 * Operator    : OVERSEE (AMMC-licensed investment bank)
 * Author      : EMERGE Capital / OVERSEE
 * Created     : June 2026
 * Stack       : Next.js 16 · TypeScript · React · Trilingual FR/EN/AR
 * ─────────────────────────────────────────────────────────────
 */
"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang } from "./translations";

type LangCtx = { lang: Lang; setLang: (l: Lang) => void };

const LanguageContext = createContext<LangCtx>({ lang: "FR", setLang: () => {} });

function readLangCookie(): Lang {
  if (typeof document === "undefined") return "FR";
  const m = document.cookie.match(/emerge-lang=(FR|EN|AR)/);
  return m ? (m[1] as Lang) : "FR";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("FR");

  // On first load, restore from cookie
  useEffect(() => {
    setLangState(readLangCookie());
  }, []);

  // Fix bfcache: when navigating back, re-read the cookie
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setLangState(readLangCookie());
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
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
