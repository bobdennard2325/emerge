"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
    tag: { FR: "AGRITECH", EN: "AGRITECH", AR: "تكنولوجيا زراعية" },
    tagBg: "#d0ede4", tagColor: "#0f6e56",
    name: "GreenRoots",
    catch: { FR: "Irrigation intelligente pour les fermes marocaines", EN: "Smart irrigation for Moroccan farms", AR: "الري الذكي للمزارع المغربية" },
    location: { FR: "Agadir", EN: "Agadir", AR: "أكادير" },
    raised: "730 000 MAD", goal: "1 000 000 MAD", pct: 73, days: 18,
    score: 78, sharia: true, verified: true,
    gradient: "linear-gradient(160deg,#1a3a1a 0%,#2d5a2d 40%,#0f2a1a 100%)",
    logoInitials: "GR", logoColor: "#0f6e56",
  },
  {
    slug: "nqodi",
    tag: { FR: "FINTECH", EN: "FINTECH", AR: "تكنولوجيا مالية" },
    tagBg: "#d0e0f0", tagColor: "#185fa5",
    name: "Nqodi",
    catch: { FR: "L'inclusion financière pour tous les Marocains", EN: "Financial inclusion for every Moroccan", AR: "الشمول المالي لكل مغربي" },
    location: { FR: "Casablanca", EN: "Casablanca", AR: "الدار البيضاء" },
    raised: "1 638 000 MAD", goal: "1 800 000 MAD", pct: 91, days: 7,
    score: 85, sharia: true, verified: true,
    gradient: "linear-gradient(160deg,#0a1628 0%,#1a3a6a 40%,#0a1628 100%)",
    logoInitials: "NQ", logoColor: "#185fa5",
  },
  {
    slug: "solara",
    tag: { FR: "CLEANTECH", EN: "CLEANTECH", AR: "تكنولوجيا نظيفة" },
    tagBg: "#f5e8c0", tagColor: "#7a5a00",
    name: "Solara",
    catch: { FR: "L'énergie solaire accessible à chaque foyer marocain", EN: "Solar energy for every Moroccan household", AR: "الطاقة الشمسية لكل أسرة مغربية" },
    location: { FR: "Marrakech", EN: "Marrakech", AR: "مراكش" },
    raised: "450 000 MAD", goal: "1 000 000 MAD", pct: 45, days: 34,
    score: 64, sharia: false, verified: false,
    gradient: "linear-gradient(160deg,#1a0f00 0%,#4a2800 40%,#1a0a00 100%)",
    logoInitials: "SL", logoColor: "#c87a00",
  },
  {
    slug: "dawaetech",
    tag: { FR: "HEALTHTECH", EN: "HEALTHTECH", AR: "تكنولوجيا صحية" },
    tagBg: "#f0d0da", tagColor: "#8a1a3a",
    name: "DawaeTech",
    catch: { FR: "La pharmacie intelligente, enfin accessible au Maroc", EN: "The smart pharmacy, finally accessible in Morocco", AR: "الصيدلية الذكية، متاحة أخيراً في المغرب" },
    location: { FR: "Rabat", EN: "Rabat", AR: "الرباط" },
    raised: "1 054 000 MAD", goal: "1 700 000 MAD", pct: 62, days: 22,
    score: 81, sharia: true, verified: true,
    gradient: "linear-gradient(160deg,#1a0a14 0%,#5a1a3a 40%,#1a0a14 100%)",
    logoInitials: "DT", logoColor: "#8a1a3a",
  },
  {
    slug: "logitrans",
    tag: { FR: "LOGISTIQUE", EN: "LOGISTICS", AR: "لوجستيك" },
    tagBg: "#f0e8c0", tagColor: "#4a3a00",
    name: "LogiTrans",
    catch: { FR: "La logistique du dernier kilomètre réinventée", EN: "Last-mile logistics reinvented for Morocco", AR: "لوجستيك الميل الأخير، مُعاد ابتكاره" },
    location: { FR: "Casablanca", EN: "Casablanca", AR: "الدار البيضاء" },
    raised: "646 000 MAD", goal: "1 700 000 MAD", pct: 38, days: 41,
    score: 70, sharia: true, verified: false,
    gradient: "linear-gradient(160deg,#0f0a00 0%,#3a2800 40%,#0f0800 100%)",
    logoInitials: "LT", logoColor: "#8a6a00",
  },
  {
    slug: "edumak",
    tag: { FR: "EDTECH", EN: "EDTECH", AR: "تكنولوجيا تعليمية" },
    tagBg: "#e0d0f0", tagColor: "#3a1a6a",
    name: "EduMak",
    catch: { FR: "Démocratiser l'apprentissage pour la jeunesse marocaine", EN: "Democratising quality learning for Moroccan youth", AR: "التعلم الجيد للشباب المغربي" },
    location: { FR: "Fès", EN: "Fès", AR: "فاس" },
    raised: "935 000 MAD", goal: "1 700 000 MAD", pct: 55, days: 29,
    score: 74, sharia: true, verified: true,
    gradient: "linear-gradient(160deg,#0f0520 0%,#2a0d50 40%,#0f0520 100%)",
    logoInitials: "EM", logoColor: "#5a1a9a",
  },
];

const aiTagline: Record<Lang, string> = {
  FR: "🤖 1ère plateforme marocaine d'equity crowdfunding propulsée par l'IA",
  EN: "🤖 Morocco's first AI-powered equity crowdfunding platform",
  AR: "🤖 أول منصة مغربية للتمويل الجماعي بالأسهم مدعومة بالذكاء الاصطناعي",
};

// ─── Demo accounts ───────────────────────────────────────────────────────────
type DemoUser = {
  username: string;
  password: string;
  type: "investor" | "entrepreneur";
  state: "incomplete" | "profiled" | "invested" | "submitted" | "live";
  redirect: string;
  label: Record<string, string>;
};

const DEMO_USERS: DemoUser[] = [
  {
    username: "investor_new", password: "pass",
    type: "investor", state: "incomplete", redirect: "/investor",
    label: { FR: "Investisseur — profil incomplet", EN: "Investor — incomplete profile", AR: "مستثمر — ملف غير مكتمل" },
  },
  {
    username: "investor_active", password: "pass",
    type: "investor", state: "profiled", redirect: "/#campaigns",
    label: { FR: "Investisseur — profil complet, aucun investissement", EN: "Investor — profile complete, no investment yet", AR: "مستثمر — ملف مكتمل، لا استثمارات بعد" },
  },
  {
    username: "investor_portfolio", password: "pass",
    type: "investor", state: "invested", redirect: "/portfolio",
    label: { FR: "Investisseur — portefeuille actif", EN: "Investor — active portfolio", AR: "مستثمر — محفظة نشطة" },
  },
  {
    username: "entrepreneur_submitted", password: "pass",
    type: "entrepreneur", state: "submitted", redirect: "/status",
    label: { FR: "Entrepreneur — dossier soumis", EN: "Entrepreneur — file submitted", AR: "رياديّ — ملف مقدم" },
  },
];

export default function Home() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = () => {
    const user = DEMO_USERS.find(u => u.username === loginUser.trim() && u.password === loginPass);
    if (!user) { setLoginError(true); return; }
    setLoginError(false);
    setLoginLoading(true);
    setTimeout(() => {
      setShowLogin(false);
      setLoginLoading(false);
      setLoginUser(""); setLoginPass("");
      router.push(user.redirect);
    }, 800);
  };

  const ui_login = {
    title:       { FR: "Connexion",                        EN: "Sign in",                         AR: "تسجيل الدخول" },
    username:    { FR: "Nom d'utilisateur",                EN: "Username",                        AR: "اسم المستخدم" },
    password:    { FR: "Mot de passe",                     EN: "Password",                        AR: "كلمة المرور" },
    submit:      { FR: "Se connecter",                     EN: "Sign in",                         AR: "تسجيل الدخول" },
    error:       { FR: "Identifiants incorrects.",         EN: "Incorrect credentials.",          AR: "بيانات الاعتماد غير صحيحة." },
    demo:        { FR: "Comptes de démonstration",         EN: "Demo accounts",                   AR: "حسابات العرض التوضيحي" },
    noAccount:   { FR: "Pas encore de compte ?",           EN: "No account yet?",                 AR: "ليس لديك حساب؟" },
    register:    { FR: "Créer un compte investisseur",     EN: "Create an investor account",      AR: "إنشاء حساب مستثمر" },
    orSubmit:    { FR: "ou soumettre un projet →",         EN: "or submit a project →",           AR: "أو تقديم مشروع ←" },
  };

  return (
    <main dir={t.dir} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8f9fb", color: "#0f1923", fontSize: "15px" }}>

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
      <nav style={{ background: "#0f1923", padding: "0 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "68px" }}>
        <Image src="/img/logo_emerge_cropped.png" alt="Emerge Capital" width={70} height={38} style={{ objectFit: "contain", width: "auto", height: "auto" }} />
        <ul className="emerge-nav-links" style={{ display: "flex", gap: "1.5rem", listStyle: "none" }}>
          {[
            { label: t.nav.campaigns, href: "/" },
            { label: t.nav.howItWorks, href: "/how-it-works" },
            { label: t.nav.investors, href: "/investor" },
            { label: t.nav.about, href: "/about" },
            { label: lang === "FR" ? "Confiance" : lang === "AR" ? "الثقة" : "Trust", href: "/trust" },
          ].map(({ label, href }) => (
            <li key={label}>
              <Link href={href} style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.82rem", fontWeight: 500 }}>{label}</Link>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button onClick={() => setShowLogin(true)} style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.88rem", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: "0.5rem 1rem" }}>
            {t.nav.login}
          </button>
          <Link href="/submit" style={{ background: "linear-gradient(135deg,#5bbdd4,#2a4a7a)", color: "#fff", padding: "0.55rem 1.3rem", borderRadius: "8px", fontSize: "0.88rem", fontWeight: 600, textDecoration: "none" }}>
            {t.nav.start}
          </Link>
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
        <Link href="/trust#ai-platform" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "linear-gradient(135deg,#0f1923,#2a4a7a)", color: "#5bbdd4", padding: "0.4rem 1.1rem", borderRadius: "100px", fontSize: "0.78rem", fontWeight: 600, marginBottom: "1rem", border: "1px solid #2a4a7a", textDecoration: "none" }}>
          {aiTagline[lang]}
        </Link>

        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "1.5rem" }}>
          <Link href="/trust#ammc" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eaf6fb", color: "#2a4a7a", padding: "0.4rem 1rem", borderRadius: "100px", fontSize: "0.78rem", fontWeight: 600, border: "1px solid #c0e4f0", textDecoration: "none" }}>
            <span style={{ width: "7px", height: "7px", background: "#5bbdd4", borderRadius: "50%", display: "inline-block" }} />
            {t.hero.badge}
          </Link>
          <Link href="/trust#sharia" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eaf2fb", color: "#2a4a7a", padding: "0.4rem 1rem", borderRadius: "100px", fontSize: "0.78rem", fontWeight: 600, border: "1px solid #2a4a7a33", textDecoration: "none" }}>
            ☪️ {lang === "FR" ? "Projets conformes Charia" : lang === "AR" ? "مشاريع متوافقة شرعياً" : "Sharia-compliant projects"}
          </Link>
          <Link href="/trust#impact" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#edf7f0", color: "#0f6e56", padding: "0.4rem 1rem", borderRadius: "100px", fontSize: "0.78rem", fontWeight: 600, border: "1px solid #0f6e5633", textDecoration: "none" }}>
            🌍 {lang === "FR" ? "Investissement à impact" : lang === "AR" ? "استثمار مؤثر" : "Impact investing"}
          </Link>
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
          <a href="#campaigns" style={{ background: "linear-gradient(135deg,#5bbdd4,#2a4a7a)", color: "#fff", padding: "0.85rem 2.2rem", borderRadius: "10px", fontSize: "0.95rem", fontWeight: 700, textDecoration: "none" }}>
            {t.hero.cta1}
          </a>
          <Link href="/how-it-works" style={{ border: "1.5px solid #2a4a7a", color: "#2a4a7a", padding: "0.85rem 2rem", borderRadius: "10px", fontSize: "0.95rem", fontWeight: 600, textDecoration: "none" }}>
            {t.hero.cta2}
          </Link>
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

      {/* NEW TO INVESTING BANNER */}
      <section style={{ padding: "1.5rem 3rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg,#0f1923 0%,#1a3a6a 60%,#0f2a4a 100%)", borderRadius: "16px", padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(91,189,212,0.15)", border: "1px solid rgba(91,189,212,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>🎓</div>
            <div>
              <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#fff", marginBottom: "0.2rem" }}>
                {lang === "FR" ? "Nouveau sur EMERGE ?" : lang === "AR" ? "جديد على EMERGE؟" : "New to EMERGE?"}
              </div>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                {lang === "FR" ? "Comprenez les termes clés — crowdfunding en capital, valorisation, risques & rendements — avant d'investir." : lang === "AR" ? "افهم المصطلحات الرئيسية — التمويل الجماعي بالأسهم، التقييم، المخاطر والعوائد — قبل الاستثمار." : "Understand the key terms — equity crowdfunding, valuation, risk & returns — before investing."}
              </div>
            </div>
          </div>
          <Link href="/glossary" style={{ background: "rgba(91,189,212,0.15)", border: "1px solid rgba(91,189,212,0.4)", color: "#5bbdd4", padding: "0.6rem 1.4rem", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
            {lang === "FR" ? "Voir le lexique →" : lang === "AR" ? "عرض القاموس ←" : "View glossary →"}
          </Link>
        </div>
      </section>

      {/* CAMPAIGNS */}
      <section id="campaigns" style={{ padding: "3.5rem 3rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.8rem" }}>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f1923" }}>{t.campaigns.title}</div>
          <a href="#campaigns" onClick={e => { e.preventDefault(); document.getElementById("campaigns")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} style={{ fontSize: "0.85rem", color: "#2a4a7a", fontWeight: 600, textDecoration: "none", cursor: "pointer" }}>{t.campaigns.seeAll}</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.2rem" }}>
          {campaignData.map(camp => (
            <Link key={camp.slug} href={`/project/${camp.slug}`} style={{ textDecoration: "none", display: "block", borderRadius: "14px", overflow: "hidden", border: "1px solid #e8ecf0", background: "#fff", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
              {/* Cover hero */}
              <div style={{ position: "relative", height: "140px", overflow: "hidden", background: "#0f1923" }}>
              <img src={`/img/cover_${camp.slug}.svg`} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)" }} />
                {/* Logo */}
                <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", width: "42px", height: "42px", borderRadius: "10px", background: camp.logoColor, border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 900, color: "#fff" }}>
                  {camp.logoInitials}
                </div>
                {/* Badges top-right */}
                <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", display: "flex", gap: "4px" }}>
                  {camp.sharia && <span style={{ fontSize: "0.58rem", fontWeight: 700, padding: "2px 6px", borderRadius: "100px", background: "#d4edda", color: "#155724" }}>☪</span>}
                  {camp.verified && <span style={{ fontSize: "0.58rem", fontWeight: 700, padding: "2px 6px", borderRadius: "100px", background: "#5bbdd4", color: "#fff" }}>✓</span>}
                </div>
                {/* Catchphrase bottom */}
                <div style={{ position: "absolute", bottom: "0.6rem", left: "0.75rem", right: "0.75rem" }}>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.3, textShadow: "0 1px 4px rgba(0,0,0,0.5)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>
                    {camp.catch[lang]}
                  </p>
                </div>
              </div>
              {/* Card body */}
              <div style={{ padding: "0.85rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "2px 8px", borderRadius: "100px", background: camp.tagBg, color: camp.tagColor }}>{camp.tag[lang]}</span>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#2a4a7a" }}>Score {camp.score}</span>
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0f1923", marginBottom: "0.2rem" }}>{camp.name}</div>
                <div style={{ fontSize: "0.72rem", color: "#8a96a3", marginBottom: "0.6rem" }}>{camp.location[lang]}</div>
                <div style={{ background: "#f0f2f5", borderRadius: "3px", height: "5px", overflow: "hidden", marginBottom: "0.35rem" }}>
                  <div style={{ width: `${camp.pct}%`, height: "5px", borderRadius: "3px", background: "linear-gradient(90deg,#5bbdd4,#2a4a7a)" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "#8a96a3" }}>
                  <span style={{ fontWeight: 600, color: "#0f1923" }}>{camp.raised}</span>
                  <span>{camp.pct}% · {camp.days} {t.campaigns.daysLeft}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{ background: "#fff", borderTop: "1px solid #e8ecf0", padding: "1.5rem 3rem", display: "flex", justifyContent: "center", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
        {([
          { icon: "🤖", label: lang === "FR" ? "Plateforme IA" : lang === "AR" ? "منصة الذكاء الاصطناعي" : "AI Platform",            anchor: "ai-platform", color: "#185fa5", bg: "#eaf2fb" },
          { icon: "🏛️", label: t.trust.regulated,                                                                                      anchor: "ammc",        color: "#2a4a7a", bg: "#eaf2fb" },
          { icon: "🔒", label: t.trust.secured,                                                                                         anchor: "secured",     color: "#0f6e56", bg: "#edf7f0" },
          { icon: "✅", label: t.trust.verified,                                                                                         anchor: "verified",    color: "#2a7a4a", bg: "#edf7f0" },
          { icon: "📊", label: t.trust.transparent,                                                                                      anchor: "reporting",   color: "#8a5a00", bg: "#fdf5e8" },
          { icon: "☪️",  label: lang === "FR" ? "Conformité Charia" : lang === "AR" ? "الامتثال الشرعي" : "Sharia compliant",          anchor: "sharia",      color: "#2a4a7a", bg: "#eaf2fb" },
          { icon: "🌍", label: lang === "FR" ? "Impact" : lang === "AR" ? "الأثر" : "Impact",                                          anchor: "impact",      color: "#0f6e56", bg: "#edf7f0" },
        ] as {icon:string;label:string;anchor:string;color:string;bg:string}[]).map(item => (
          <Link key={item.anchor} href={`/trust#${item.anchor}`}
            style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "0.78rem", color: item.color, fontWeight: 600, textDecoration: "none", background: item.bg, padding: "0.45rem 0.9rem", borderRadius: "100px", border: `1px solid ${item.color}22`, transition: "all 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
            <span style={{ fontSize: "14px" }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#0f1923", color: "#8a96a3", textAlign: "center", padding: "1.5rem", fontSize: "0.78rem" }}>
        © 2026 Emerge Capital · Casablanca, Maroc ·{" "}
        <Link href="/legal" style={{ color: "#5bbdd4", textDecoration: "none" }}>{t.footer.legal}</Link> ·{" "}
        <Link href="/privacy" style={{ color: "#5bbdd4", textDecoration: "none" }}>{t.footer.privacy}</Link> ·{" "}
        <Link href="/glossary" style={{ color: "#5bbdd4", textDecoration: "none" }}>{lang === "FR" ? "Lexique" : lang === "AR" ? "القاموس" : "Glossary"}</Link>
      </footer>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
          onClick={e => { if (e.target === e.currentTarget) setShowLogin(false); }}>
          <div style={{ background: "#fff", borderRadius: "18px", padding: "2rem", width: "100%", maxWidth: "420px", boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }} dir={t.dir}>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f1923", margin: 0 }}>{ui_login.title[lang]}</h2>
              <button onClick={() => setShowLogin(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#8a96a3", lineHeight: 1 }}>✕</button>
            </div>

            {/* Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#4a5568", marginBottom: "0.35rem" }}>{ui_login.username[lang]}</label>
                <input value={loginUser} onChange={e => { setLoginUser(e.target.value); setLoginError(false); }}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  style={{ width: "100%", padding: "0.7rem 0.9rem", borderRadius: "8px", border: `1.5px solid ${loginError ? "#e05c5c" : "#e8ecf0"}`, fontSize: "0.88rem", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                  placeholder="investor_active" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#4a5568", marginBottom: "0.35rem" }}>{ui_login.password[lang]}</label>
                <input type="password" value={loginPass} onChange={e => { setLoginPass(e.target.value); setLoginError(false); }}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  style={{ width: "100%", padding: "0.7rem 0.9rem", borderRadius: "8px", border: `1.5px solid ${loginError ? "#e05c5c" : "#e8ecf0"}`, fontSize: "0.88rem", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                  placeholder="pass" />
              </div>
            </div>

            {loginError && (
              <div style={{ background: "#fdf0f0", border: "1px solid #f0b0b0", borderRadius: "8px", padding: "0.6rem 0.9rem", marginBottom: "0.75rem", fontSize: "0.78rem", color: "#c0392b" }}>
                ⚠ {ui_login.error[lang]}
              </div>
            )}

            <button onClick={handleLogin} disabled={loginLoading}
              style={{ width: "100%", background: "linear-gradient(135deg,#5bbdd4,#2a4a7a)", color: "#fff", border: "none", borderRadius: "10px", padding: "0.85rem", fontSize: "0.95rem", fontWeight: 700, cursor: loginLoading ? "wait" : "pointer", marginBottom: "1.25rem" }}>
              {loginLoading ? "…" : ui_login.submit[lang]}
            </button>

            {/* Demo accounts hint */}
            <div style={{ background: "#f8f9fb", borderRadius: "10px", padding: "0.9rem 1rem", marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8a96a3", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>{ui_login.demo[lang]}</div>
              {DEMO_USERS.map(u => (
                <button key={u.username} onClick={() => { setLoginUser(u.username); setLoginPass(u.password); setLoginError(false); }}
                  style={{ display: "block", width: "100%", textAlign: lang === "AR" ? "right" : "left", background: loginUser === u.username ? "#eaf6fb" : "none", border: "none", borderRadius: "6px", padding: "0.4rem 0.5rem", cursor: "pointer", marginBottom: "2px" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#2a4a7a", fontFamily: "monospace" }}>{u.username}</span>
                  <span style={{ fontSize: "0.7rem", color: "#8a96a3", marginLeft: lang === "AR" ? 0 : "8px", marginRight: lang === "AR" ? "8px" : 0 }}>— {u.label[lang]}</span>
                </button>
              ))}
            </div>

            {/* Register links */}
            <div style={{ textAlign: "center", fontSize: "0.78rem", color: "#8a96a3" }}>
              {ui_login.noAccount[lang]}{" "}
              <Link href="/investor" onClick={() => setShowLogin(false)} style={{ color: "#2a4a7a", fontWeight: 600, textDecoration: "none" }}>{ui_login.register[lang]}</Link>
              {" "}<Link href="/submit" onClick={() => setShowLogin(false)} style={{ color: "#5bbdd4", fontWeight: 600, textDecoration: "none" }}>{ui_login.orSubmit[lang]}</Link>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
