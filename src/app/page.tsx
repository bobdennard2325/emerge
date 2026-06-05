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

      {/* NAV */}
      <nav style={{ background: "#0f1923", padding: "0 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "68px" }}>
        <Image src="/img/logo_emerge_cropped.png" alt="Emerge Capital" width={70} height={38} style={{ objectFit: "contain", width: "auto", height: "auto" }} />
        <ul style={{ display: "flex", gap: "1.5rem", listStyle: "none" }}>
          {[
            { label: t.nav.campaigns, href: "/" },
            { label: t.nav.howItWorks, href: "/how-it-works" },
            { label: t.nav.investors, href: "/investor" },
            { label: t.nav.about, href: "/about" },
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
        <a href="#" style={{ color: "#5bbdd4", textDecoration: "none" }}>{t.footer.privacy}</a> ·{" "}
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
