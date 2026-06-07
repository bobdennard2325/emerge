/**
 * EMERGE Capital — Prototype v1.8
 * ─────────────────────────────────────────────────────────────
 * File        : emerge/src/app/not-found.tsx
 * Route       : root
 * Description : Custom 404 page
 * Project     : Morocco's first AI-powered equity crowdfunding platform
 * Operator    : OVERSEE (AMMC-licensed investment bank)
 * Author      : EMERGE Capital / OVERSEE
 * Created     : June 2026
 * Stack       : Next.js 16 · TypeScript · React · Trilingual FR/EN/AR
 * ─────────────────────────────────────────────────────────────
 */
"use client";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";

export default function NotFound() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const flags: Record<string, string> = {
    FR: "/img/flag_fr.png", AR: "/img/flag_ar.png", EN: "/img/flag_en.png",
  };

  const ui = {
    code:     { FR: "404",                                    EN: "404",                                    AR: "404" },
    title:    { FR: "Page introuvable",                       EN: "Page not found",                         AR: "الصفحة غير موجودة" },
    subtitle: { FR: "La page que vous cherchez n'existe pas ou a été déplacée.", EN: "The page you are looking for does not exist or has been moved.", AR: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها." },
    home:     { FR: "Retour à l'accueil",                     EN: "Back to home",                           AR: "العودة إلى الرئيسية" },
    invest:   { FR: "Voir les projets",                       EN: "Browse projects",                        AR: "تصفح المشاريع" },
    how:      { FR: "Comment ça marche ?",                    EN: "How it works",                           AR: "كيف يعمل؟" },
  };

  return (
    <main dir={t.dir} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8f9fb", color: "#0f1923", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* NAV */}
      <nav style={{ background: "#0f1923", padding: "0 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "68px" }}>
        <img src="/img/logo_emerge_cropped.png" alt="Emerge Capital" width={70} style={{ height: "auto", objectFit: "contain" }} />
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {(["FR", "AR", "EN"] as const).filter(l => l !== lang).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <img src={flags[l]} alt={l} width={32} height={22} style={{ borderRadius: "4px", display: "block" }} />
            </button>
          ))}
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 2rem", textAlign: "center" }}>

        {/* Large 404 */}
        <div style={{ fontSize: "7rem", fontWeight: 900, lineHeight: 1, background: "linear-gradient(135deg,#5bbdd4,#2a4a7a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.5rem", userSelect: "none" }}>
          {ui.code[lang]}
        </div>

        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f1923", marginBottom: "0.75rem" }}>
          {ui.title[lang]}
        </h1>
        <p style={{ fontSize: "0.92rem", color: "#6b7a8d", lineHeight: 1.7, maxWidth: "400px", marginBottom: "2.5rem" }}>
          {ui.subtitle[lang]}
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/" style={{ background: "linear-gradient(135deg,#5bbdd4,#2a4a7a)", color: "#fff", padding: "0.8rem 1.8rem", borderRadius: "10px", fontSize: "0.9rem", fontWeight: 700, textDecoration: "none" }}>
            {ui.home[lang]}
          </Link>
          <Link href="/#campaigns" style={{ border: "1.5px solid #2a4a7a", color: "#2a4a7a", padding: "0.8rem 1.6rem", borderRadius: "10px", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none" }}>
            {ui.invest[lang]}
          </Link>
          <Link href="/how-it-works" style={{ border: "1.5px solid #e8ecf0", color: "#6b7a8d", padding: "0.8rem 1.6rem", borderRadius: "10px", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none" }}>
            {ui.how[lang]}
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#0f1923", color: "#8a96a3", textAlign: "center", padding: "1.5rem", fontSize: "0.78rem" }}>
        © 2026 Emerge Capital · Casablanca, Maroc ·{" "}
        <Link href="/glossary" style={{ color: "#5bbdd4", textDecoration: "none" }}>
          {lang === "FR" ? "Lexique" : lang === "AR" ? "القاموس" : "Glossary"}
        </Link>
      </footer>
    </main>
  );
}
