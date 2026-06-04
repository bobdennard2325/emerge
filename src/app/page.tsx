"use client";
import Image from "next/image";
import Link from "next/link";
import { translations, Lang } from "./translations";
import { useLanguage } from "./LanguageContext";

// ──────────────────────────────────────────────
// 🔧 TOGGLE: Set to true when you have real data
const SHOW_STATS = false;
// ──────────────────────────────────────────────

const flags: Record<Lang, string> = {
  FR: "/img/flag_fr.png",
  AR: "/img/flag_ar.png",
  EN: "/img/flag_en.png",
};

const statsData: Record<Lang, { label: string; value: string }[]> = {
  FR: [
    { label: "Levés pour les startups", value: "0 MAD" },
    { label: "Investisseurs actifs", value: "0" },
    { label: "Projets financés", value: "0" },
    { label: "Taux de succès", value: "0%" },
  ],
  EN: [
    { label: "Raised for startups", value: "0 MAD" },
    { label: "Active investors", value: "0" },
    { label: "Funded projects", value: "0" },
    { label: "Success rate", value: "0%" },
  ],
  AR: [
    { label: "جُمع للشركات الناشئة", value: "0 MAD" },
    { label: "المستثمرون النشطون", value: "0" },
    { label: "المشاريع الممولة", value: "0" },
    { label: "معدل النجاح", value: "0%" },
  ],
};

const campaignData = [
  {
    slug: "greenroots",
    bg: "#e8f5f0", tagBg: "#d0ede4", tagColor: "#0f6e56",
    tag: { FR: "AGRITECH", EN: "AGRITECH", AR: "تكنولوجيا زراعية" },
    title: { FR: "GreenRoots — Irrigation intelligente pour les fermes marocaines", EN: "GreenRoots — Smart irrigation for Moroccan farms", AR: "GreenRoots — الري الذكي للمزارع المغربية" },
    desc: { FR: "Réduction de 60% de la consommation d'eau grâce à l'IA dans la région Souss-Massa.", EN: "60% reduction in water usage through AI across the Souss-Massa region.", AR: "تخفيض استهلاك المياه بنسبة 60% بفضل الذكاء الاصطناعي في منطقة سوس ماسة." },
    raised: "730 000 MAD", pct: 73, days: 18,
  },
  {
    slug: "nqodi",
    bg: "#e8f0f8", tagBg: "#d0e0f0", tagColor: "#185fa5",
    tag: { FR: "FINTECH", EN: "FINTECH", AR: "تكنولوجيا مالية" },
    title: { FR: "Nqodi — Paiements mobiles pour les non-bancarisés", EN: "Nqodi — Mobile payments for the unbanked", AR: "Nqodi — المدفوعات المحمولة لغير المصرفيين" },
    desc: { FR: "Inclusion financière pour 4M+ de Marocains via un portefeuille simple et hors-ligne.", EN: "Financial inclusion for 4M+ Moroccans via a simple offline-first wallet.", AR: "الشمول المالي لأكثر من 4 ملايين مغربي عبر محفظة بسيطة تعمل دون إنترنت." },
    raised: "1,8M MAD", pct: 91, days: 6,
  },
  {
    slug: "solara",
    bg: "#f0f5e8", tagBg: "#d8ecb8", tagColor: "#3b6d11",
    tag: { FR: "CLEANTECH", EN: "CLEANTECH", AR: "تكنولوجيا نظيفة" },
    title: { FR: "Solara — Énergie solaire abordable pour les PME", EN: "Solara — Affordable solar energy for SMEs", AR: "Solara — الطاقة الشمسية الميسورة للمؤسسات الصغيرة" },
    desc: { FR: "Panneaux solaires en location-vente permettant aux PME de réduire leurs coûts de 50%.", EN: "Lease-to-own solar panels helping SMEs cut energy costs by 50%.", AR: "ألواح شمسية بنظام الإيجار المنتهي بالتمليك تساعد الشركات على تخفيض تكاليف الطاقة بنسبة 50%." },
    raised: "450 000 MAD", pct: 45, days: 32,
  },
];

const aiTagline: Record<Lang, string> = {
  FR: "🤖 1ère plateforme marocaine d'equity crowdfunding propulsée par l'IA",
  EN: "🤖 Morocco's first AI-powered equity crowdfunding platform",
  AR: "🤖 أول منصة مغربية للتمويل الجماعي بالأسهم مدعومة بالذكاء الاصطناعي",
};

export default function Home() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  return (
    <main dir={t.dir} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8f9fb", color: "#0f1923", fontSize: "15px" }}>

      {/* NAV */}
      <nav style={{ background: "#0f1923", padding: "0 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "68px" }}>
        <Image src="/img/logo_emerge_cropped.png" alt="Emerge Capital" width={70} height={38} style={{ objectFit: "contain", width: "auto", height: "auto" }} />
        <ul style={{ display: "flex", gap: "1.5rem", listStyle: "none" }}>
          {[t.nav.campaigns, t.nav.howItWorks, t.nav.investors, t.nav.about].map(link => (
            <li key={link}>
              <a href="#" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500 }}>{link}</a>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <a href="#" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.88rem", fontWeight: 600, textDecoration: "none", padding: "0.5rem 1rem" }}>
            {t.nav.login}
          </a>
          <a href="#" style={{ background: "linear-gradient(135deg,#5bbdd4,#2a4a7a)", color: "#fff", padding: "0.55rem 1.3rem", borderRadius: "8px", fontSize: "0.88rem", fontWeight: 600, textDecoration: "none" }}>
            {t.nav.start}
          </a>
          <div style={{ display: "flex", gap: "8px", borderLeft: "1px solid rgba(255,255,255,0.15)", marginLeft: "0.5rem", paddingLeft: "1rem", alignItems: "center" }}>
            {(["FR", "AR", "EN"] as Lang[]).filter(l => l !== lang).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s" }} title={l}>
                <img src={flags[l]} alt={l} width={32} height={22} style={{ borderRadius: "4px", display: "block" }} />
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: "#fff", padding: "5rem 3rem 4rem", textAlign: "center", borderBottom: "1px solid #e8ecf0" }}>

        {/* AI Tagline badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "linear-gradient(135deg,#0f1923,#2a4a7a)", color: "#5bbdd4", padding: "0.4rem 1.1rem", borderRadius: "100px", fontSize: "0.78rem", fontWeight: 600, marginBottom: "1rem", border: "1px solid #2a4a7a" }}>
          {aiTagline[lang]}
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eaf6fb", color: "#2a6a8a", padding: "0.4rem 1rem", borderRadius: "100px", fontSize: "0.78rem", fontWeight: 600, marginBottom: "1.5rem", border: "1px solid #c0e4f0" }}>
          <span style={{ width: "7px", height: "7px", background: "#5bbdd4", borderRadius: "50%", display: "inline-block" }} />
          {t.hero.badge}
        </div>

        <h1 style={{ fontSize: "3rem", fontWeight: 800, lineHeight: 1.1, color: "#0f1923", marginBottom: "1.2rem", maxWidth: "640px", marginLeft: "auto", marginRight: "auto" }}>
          {t.hero.title1}{" "}
          <span style={{ background: "linear-gradient(90deg,#5bbdd4,#2a4a7a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {t.hero.title2}
          </span>
        </h1>
        <p style={{ color: "#6b7a8d", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 2.5rem" }}>
          {t.hero.subtitle}
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center" }}>
          <a href="#" style={{ background: "linear-gradient(135deg,#5bbdd4,#2a4a7a)", color: "#fff", padding: "0.85rem 2.2rem", borderRadius: "10px", fontSize: "0.95rem", fontWeight: 700, textDecoration: "none" }}>
            {t.hero.cta1}
          </a>
          <a href="#" style={{ border: "1.5px solid #2a4a7a", color: "#2a4a7a", padding: "0.85rem 2rem", borderRadius: "10px", fontSize: "0.95rem", fontWeight: 600, textDecoration: "none" }}>
            {t.hero.cta2}
          </a>
        </div>
      </section>

      {/* STATS — shown only when SHOW_STATS = true */}
      {SHOW_STATS && (
        <section style={{ background: "#0f1923", padding: "3rem", display: "flex", justifyContent: "center", gap: "4rem", flexWrap: "wrap" }}>
          {statsData[lang].map(stat => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#5bbdd4", marginBottom: "0.3rem" }}>{stat.value}</div>
              <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </section>
      )}

      {/* CAMPAIGNS */}
      <section style={{ padding: "3.5rem 3rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.8rem" }}>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f1923" }}>{t.campaigns.title}</div>
          <a href="#" style={{ fontSize: "0.85rem", color: "#2a4a7a", fontWeight: 600, textDecoration: "none" }}>{t.campaigns.seeAll}</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.2rem" }}>
          {campaignData.map(c => (
            <Link key={c.tag.EN} href={`/project/${c.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block", background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", overflow: "hidden", transition: "box-shadow 0.2s", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
              <div style={{ height: "130px", background: c.bg, display: "flex", alignItems: "flex-end", padding: "1rem" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", padding: "3px 10px", borderRadius: "100px", background: c.tagBg, color: c.tagColor }}>
                  {c.tag[lang]}
                </span>
              </div>
              <div style={{ padding: "1rem 1.1rem 1.2rem" }}>
                <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0f1923", lineHeight: 1.35, marginBottom: "0.4rem" }}>{c.title[lang]}</div>
                <div style={{ fontSize: "0.8rem", color: "#6b7a8d", lineHeight: 1.55, marginBottom: "0.9rem" }}>{c.desc[lang]}</div>
                <div style={{ background: "#f0f2f5", borderRadius: "4px", height: "5px", marginBottom: "0.6rem" }}>
                  <div style={{ width: `${c.pct}%`, height: "5px", borderRadius: "4px", background: "linear-gradient(90deg,#5bbdd4,#2a4a7a)" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#8a96a3" }}>
                  <span><strong style={{ color: "#0f1923", fontWeight: 600 }}>{c.raised}</strong> {t.campaigns.raised}</span>
                  <span>{c.pct}% · {c.days} {t.campaigns.daysLeft}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{ background: "#fff", borderTop: "1px solid #e8ecf0", padding: "2rem 3rem", display: "flex", justifyContent: "center", gap: "2.5rem", alignItems: "center", flexWrap: "wrap" }}>
        {[
          { icon: "🏛️", label: t.trust.regulated },
          { icon: "🔒", label: t.trust.secured },
          { icon: "✅", label: t.trust.verified },
          { icon: "📊", label: t.trust.transparent },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "#4a5568", fontWeight: 500 }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#eaf6fb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>{item.icon}</div>
            {item.label}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#0f1923", color: "#8a96a3", textAlign: "center", padding: "1.5rem", fontSize: "0.78rem" }}>
        © 2026 Emerge Capital · Casablanca, Maroc ·{" "}
        <a href="#" style={{ color: "#5bbdd4", textDecoration: "none" }}>{t.footer.legal}</a> ·{" "}
        <a href="#" style={{ color: "#5bbdd4", textDecoration: "none" }}>{t.footer.privacy}</a>
      </footer>

    </main>
  );
}
