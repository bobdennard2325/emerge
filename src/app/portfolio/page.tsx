"use client";
import { useState } from "react";
import Link from "next/link";
import { translations } from "../translations";
import { useLanguage } from "../LanguageContext";

// ─── Mock portfolio data ──────────────────────────────────────────────────────
const holdings = [
  {
    slug: "greenroots",
    name: "GreenRoots",
    tag: { FR: "AGRITECH", EN: "AGRITECH", AR: "تكنولوجيا زراعية" },
    tagColor: "#0f6e56", tagBg: "#d0ede4",
    invested: "5 000 MAD",
    shares: 33,
    sharePrice: "150 MAD",
    ownership: "0.09%",   // 33 / (36667+6667) shares total post-money
    currentValue: "5 850 MAD",
    change: "+17%",
    positive: true,
    date: { FR: "15 jan. 2026", EN: "15 Jan 2026", AR: "15 يناير 2026" },
    status: { FR: "En cours", EN: "Active", AR: "جارٍ" },
    statusColor: "#2a7a4a",
    lastReport: { FR: "Mars 2026", EN: "March 2026", AR: "مارس 2026" },
  },
  {
    slug: "nqodi",
    name: "Nqodi",
    tag: { FR: "FINTECH", EN: "FINTECH", AR: "تكنولوجيا مالية" },
    tagColor: "#185fa5", tagBg: "#d0e0f0",
    invested: "10 000 MAD",
    shares: 50,
    sharePrice: "200 MAD",
    ownership: "0.05%",   // 50 / (90000+9000) shares total post-money
    currentValue: "11 200 MAD",
    change: "+12%",
    positive: true,
    date: { FR: "3 fév. 2026", EN: "3 Feb 2026", AR: "3 فبراير 2026" },
    status: { FR: "En cours", EN: "Active", AR: "جارٍ" },
    statusColor: "#2a7a4a",
    lastReport: { FR: "Avril 2026", EN: "April 2026", AR: "أبريل 2026" },
  },
];

const totalInvested = "15 000 MAD";
const totalValue = "17 050 MAD";
const totalGain = "+2 050 MAD";
const totalPct = "+13.7%";

export default function Portfolio() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const flags: Record<string, string> = {
    FR: "/img/flag_fr.png", AR: "/img/flag_ar.png", EN: "/img/flag_en.png",
  };

  const ui = {
    title:       { FR: "Mon portefeuille",          EN: "My portfolio",              AR: "محفظتي" },
    subtitle:    { FR: "Vos participations actives sur EMERGE.", EN: "Your active holdings on EMERGE.", AR: "مساهماتك النشطة على EMERGE." },
    totalInv:    { FR: "Total investi",             EN: "Total invested",            AR: "إجمالي الاستثمار" },
    totalVal:    { FR: "Valeur actuelle",            EN: "Current value",             AR: "القيمة الحالية" },
    totalGain:   { FR: "Plus-value latente",         EN: "Unrealised gain",           AR: "مكاسب غير محققة" },
    invested:    { FR: "Investi",                    EN: "Invested",                  AR: "المستثمر" },
    shares:      { FR: "Actions",                    EN: "Shares",                    AR: "الأسهم" },
    value:       { FR: "Valeur estimée",             EN: "Estimated value",           AR: "القيمة المقدرة" },
    since:       { FR: "Depuis",                     EN: "Since",                     AR: "منذ" },
    ownership:   { FR: "% du capital",               EN: "Ownership %",               AR: "نسبة الملكية" },
    lastReport:  { FR: "Dernier rapport",            EN: "Last report",               AR: "آخر تقرير" },
    viewProject: { FR: "Voir le projet →",           EN: "View project →",            AR: "عرض المشروع ←" },
    browse:      { FR: "Découvrir d'autres projets", EN: "Discover more projects",    AR: "اكتشف مزيداً من المشاريع" },
    disclaimer:  { FR: "Les valorisations sont indicatives et basées sur le dernier tour de financement. Elles ne constituent pas une valeur de marché garantie.", EN: "Valuations are indicative and based on the last funding round. They do not constitute a guaranteed market value.", AR: "التقييمات إرشادية ومبنية على آخر جولة تمويل. لا تُشكّل قيمة سوقية مضمونة." },
    back:        { FR: "← Retour à l'accueil",      EN: "← Back to home",            AR: "← العودة إلى الرئيسية" },
  };

  return (
    <main dir={t.dir} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8f9fb", color: "#0f1923", fontSize: "15px", minHeight: "100vh" }}>

      <style>{`
        @media (max-width: 768px) {
          .emerge-nav-links { display: none !important; }
          .emerge-hero { padding: 2rem 1rem !important; }
          .emerge-section { padding: 2rem 1rem !important; }
          .emerge-grid-2 { grid-template-columns: 1fr !important; }
          .emerge-grid-3 { grid-template-columns: 1fr !important; }
          .emerge-grid-4 { grid-template-columns: 1fr 1fr !important; }
          .emerge-sidebar { display: none !important; }
          .emerge-builder-grid { grid-template-columns: 1fr !important; }
          .emerge-preview-sticky { position: static !important; top: auto !important; }
          .emerge-campaign-cards { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .emerge-nav-links { display: none !important; }
          .emerge-grid-2 { grid-template-columns: 1fr !important; }
          .emerge-grid-4 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ background: "#0f1923", padding: "0 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "68px", position: "sticky", top: 0, zIndex: 100 }}>
        <img src="/img/logo_emerge_cropped.png" alt="Emerge Capital" width={70} style={{ height: "auto", objectFit: "contain" }} />
        <div className="emerge-nav-links" style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          {([
            { label: lang === "FR" ? "Campagnes" : lang === "AR" ? "الحملات" : "Campaigns", href: "/" },
            { label: lang === "FR" ? "Comment ça marche" : lang === "AR" ? "كيف يعمل" : "How it works", href: "/how-it-works" },
            { label: lang === "FR" ? "Mon portefeuille" : lang === "AR" ? "محفظتي" : "My portfolio", href: "/portfolio" },
          ] as {label:string;href:string}[]).map(({ label, href }) => (
            <Link key={href} href={href} style={{ color: href === "/portfolio" ? "#5bbdd4" : "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.82rem", fontWeight: href === "/portfolio" ? 700 : 500 }}>{label}</Link>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {(["FR", "AR", "EN"] as const).filter(l => l !== lang).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <img src={flags[l]} alt={l} width={32} height={22} style={{ borderRadius: "4px", display: "block" }} />
            </button>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 2rem 5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eaf6fb", color: "#2a6a8a", padding: "0.4rem 1rem", borderRadius: "100px", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.75rem", border: "1px solid #c0e4f0" }}>
            👤 investor_portfolio
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f1923", marginBottom: "0.4rem" }}>{ui.title[lang]}</h1>
          <p style={{ fontSize: "0.88rem", color: "#6b7a8d" }}>{ui.subtitle[lang]}</p>
        </div>

        {/* Summary cards */}
        <div className="emerge-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: ui.totalInv[lang], value: totalInvested, color: "#0f1923" },
            { label: ui.totalVal[lang], value: totalValue, color: "#0f1923" },
            { label: ui.totalGain[lang], value: `${totalGain} (${totalPct})`, color: "#2a7a4a" },
          ].map(item => (
            <div key={item.label} style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "1.25rem" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#8a96a3", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.label}</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 800, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Holdings */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
          {holdings.map(h => (
            <div key={h.slug} style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ background: h.tagBg, color: h.tagColor, fontSize: "0.65rem", fontWeight: 800, padding: "3px 10px", borderRadius: "100px" }}>{h.tag[lang]}</div>
                  <span style={{ fontSize: "1rem", fontWeight: 800, color: "#0f1923" }}>{h.name}</span>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: h.statusColor, background: `${h.statusColor}18`, padding: "2px 8px", borderRadius: "100px" }}>{h.status[lang]}</span>
                </div>
                <span style={{ fontSize: "1rem", fontWeight: 800, color: h.positive ? "#2a7a4a" : "#c0392b" }}>{h.change}</span>
              </div>
              <div className="emerge-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.75rem", marginBottom: "1rem" }}>
                {[
                  [ui.invested[lang], h.invested],
                  [ui.shares[lang], `${h.shares} × ${h.sharePrice}`],
                  [ui.ownership[lang], h.ownership],
                  [ui.value[lang], h.currentValue],
                  [ui.lastReport[lang], h.lastReport[lang]],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <div style={{ fontSize: "0.68rem", color: "#8a96a3", fontWeight: 600, marginBottom: "2px" }}>{label}</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f1923" }}>{value}</div>
                  </div>
                ))}
              </div>
              <Link href={`/project/${h.slug}`} style={{ fontSize: "0.78rem", fontWeight: 600, color: "#2a4a7a", textDecoration: "none" }}>{ui.viewProject[lang]}</Link>
            </div>
          ))}
        </div>

        {/* Browse more */}
        <Link href="/#campaigns" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#fff", border: "1.5px dashed #c0d0e0", borderRadius: "12px", padding: "1rem", color: "#2a4a7a", fontWeight: 600, fontSize: "0.88rem", textDecoration: "none", marginBottom: "1.5rem" }}>
          + {ui.browse[lang]}
        </Link>

        {/* Disclaimer */}
        <div style={{ background: "#fff8e6", border: "1px solid #f0d090", borderRadius: "10px", padding: "0.9rem 1.1rem" }}>
          <div style={{ fontSize: "0.72rem", color: "#7a6000", lineHeight: 1.6 }}>⚠️ {ui.disclaimer[lang]}</div>
        </div>
      </div>

      <footer style={{ background: "#0f1923", color: "#8a96a3", textAlign: "center", padding: "1.5rem", fontSize: "0.78rem" }}>
        © 2026 Emerge Capital · Casablanca, Maroc ·{" "}
        <Link href="/legal" style={{ color: "#5bbdd4", textDecoration: "none" }}>{t.footer.legal}</Link> ·{" "}
        <Link href="/privacy" style={{ color: "#5bbdd4", textDecoration: "none" }}>{t.footer.privacy}</Link> ·{" "}
        <Link href="/glossary" style={{ color: "#5bbdd4", textDecoration: "none" }}>{lang === "FR" ? "Lexique" : lang === "AR" ? "القاموس" : "Glossary"}</Link>
      </footer>
    </main>
  );
}
