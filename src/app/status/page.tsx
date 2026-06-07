"use client";
import Link from "next/link";
import { translations } from "../translations";
import { useLanguage } from "../LanguageContext";

// ─── Mock submission data ─────────────────────────────────────────────────────
const submission = {
  company: "GreenRoots S.A.S.",
  project: { FR: "Extension de la gamme produit & recrutement commercial", EN: "Product line extension & commercial recruitment", AR: "توسيع نطاق المنتجات والتوظيف التجاري" },
  submittedDate: { FR: "12 mai 2026", EN: "12 May 2026", AR: "12 مايو 2026" },
  overallScore: 78,
  band: "high",
  criteria: [
    { key: "maturity",  label: { FR: "Maturité",              EN: "Maturity",            AR: "النضج" },              score: 72 },
    { key: "market",    label: { FR: "Opportunité marché",     EN: "Market opportunity",  AR: "فرصة السوق" },         score: 88 },
    { key: "success",   label: { FR: "Chance de succès",       EN: "Chance of success",   AR: "احتمالية النجاح" },    score: 74 },
    { key: "growth",    label: { FR: "Probabilité croissance", EN: "Growth probability",  AR: "احتمالية النمو" },     score: 81 },
    { key: "return",    label: { FR: "Potentiel rendement",    EN: "Return potential",    AR: "إمكانية العائد" },     score: 65 },
    { key: "impact",    label: { FR: "Impact & durabilité",    EN: "Impact & sustainability", AR: "الأثر والاستدامة" }, score: 92 },
    { key: "sharia",    label: { FR: "Conformité Charia",      EN: "Sharia compliance",   AR: "الامتثال الشرعي" },    score: 85 },
    { key: "social",    label: { FR: "Bien-être social",       EN: "Social welfare",      AR: "الرفاه الاجتماعي" },   score: 79 },
  ],
  phase: 2, // 1=submitted, 2=ai_done, 3=analyst_review, 4=approved, 5=live
};

const bandConfig: Record<string, { color: string; bg: string; label: Record<string, string> }> = {
  low:       { color: "#e05c5c", bg: "#fdf0f0", label: { FR: "Faible",    EN: "Low",       AR: "منخفض" } },
  medium:    { color: "#d4870a", bg: "#fdf5e8", label: { FR: "Moyen",     EN: "Medium",    AR: "متوسط" } },
  high:      { color: "#2a7a4a", bg: "#edf7f0", label: { FR: "Élevé",     EN: "High",      AR: "مرتفع" } },
  excellent: { color: "#185fa5", bg: "#eaf2fb", label: { FR: "Excellent", EN: "Excellent", AR: "ممتاز" } },
};

const bandGradient: Record<string, string> = {
  low: "linear-gradient(90deg,#e05c5c,#e87a7a)",
  medium: "linear-gradient(90deg,#d4870a,#f0a832)",
  high: "linear-gradient(90deg,#2a7a4a,#5bbdd4)",
  excellent: "linear-gradient(90deg,#185fa5,#5bbdd4)",
};

function scoreBand(s: number) {
  return s >= 80 ? "excellent" : s >= 65 ? "high" : s >= 45 ? "medium" : "low";
}

export default function SubmissionStatus() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];
  const overallBand = bandConfig[submission.band];

  const flags: Record<string, string> = {
    FR: "/img/flag_fr.png", AR: "/img/flag_ar.png", EN: "/img/flag_en.png",
  };

  const phases = [
    { n: 1, label: { FR: "Dossier soumis",           EN: "File submitted",          AR: "تم تقديم الملف" } },
    { n: 2, label: { FR: "Score IA généré",           EN: "AI score generated",      AR: "تم توليد نقاط الذكاء الاصطناعي" } },
    { n: 3, label: { FR: "Revue des analystes",       EN: "Analyst review",          AR: "مراجعة المحللين" } },
    { n: 4, label: { FR: "Décision",                  EN: "Decision",                AR: "القرار" } },
    { n: 5, label: { FR: "Campagne en direct",        EN: "Campaign live",           AR: "الحملة مباشرة" } },
  ];

  const ui = {
    badge:      { FR: "Tableau de bord porteur",     EN: "Entrepreneur dashboard",   AR: "لوحة تحكم صاحب المشروع" },
    title:      { FR: "Suivi de votre dossier",      EN: "Your file status",         AR: "متابعة ملفك" },
    company:    { FR: "Société",                     EN: "Company",                  AR: "الشركة" },
    project:    { FR: "Projet",                      EN: "Project",                  AR: "المشروع" },
    submitted:  { FR: "Soumis le",                   EN: "Submitted on",             AR: "تاريخ التقديم" },
    scoreTitle: { FR: "Votre score préliminaire",    EN: "Your preliminary score",   AR: "نقاطك الأولية" },
    scoreNote:  { FR: "Score généré automatiquement par nos algorithmes. Il sera révisé par nos analystes financiers dans les prochains jours.", EN: "Score generated automatically by our algorithms. It will be reviewed by our financial analysts in the coming days.", AR: "نقاط مولّدة تلقائياً بواسطة خوارزمياتنا. سيراجعها محللونا الماليون في الأيام القادمة." },
    nextStep:   { FR: "Étape suivante",              EN: "Next step",                AR: "الخطوة التالية" },
    nextDesc:   { FR: "Votre dossier est en file d'attente pour la revue de nos analystes financiers. Vous recevrez un retour sous 10 à 20 jours ouvrables. La due diligence inclut la vérification des documents, une revue des données publiques et un échange avec votre équipe.", EN: "Your file is queued for review by our financial analysts. You will receive feedback within 10 to 20 business days. Due diligence includes document verification, a public data review and an exchange with your team.", AR: "ملفك في قائمة انتظار مراجعة محللينا الماليين. ستتلقى ملاحظات خلال 10 إلى 20 يوم عمل. تشمل العناية الواجبة التحقق من الوثائق ومراجعة البيانات العامة وتبادلاً مع فريقك." },
    improve:    { FR: "Améliorer mon dossier →",     EN: "Improve my file →",        AR: "تحسين ملفي ←" },
    disclaimer: { FR: "Ce score est un résumé de due diligence indicatif. Il ne constitue pas un conseil en investissement.", EN: "This score is an indicative due-diligence summary. It does not constitute investment advice.", AR: "هذه النقاط ملخص عناية واجبة إرشادي. لا تُعدّ توصية استثمارية." },
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
            { label: lang === "FR" ? "Accueil" : lang === "AR" ? "الرئيسية" : "Home", href: "/" },
            { label: lang === "FR" ? "Mon dossier" : lang === "AR" ? "ملفي" : "My file", href: "/status" },
          ] as {label:string;href:string}[]).map(({ label, href }) => (
            <Link key={href} href={href} style={{ color: href === "/status" ? "#5bbdd4" : "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.82rem", fontWeight: href === "/status" ? 700 : 500 }}>{label}</Link>
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

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 2rem 5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eaf6fb", color: "#2a6a8a", padding: "0.4rem 1rem", borderRadius: "100px", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.75rem", border: "1px solid #c0e4f0" }}>
            🏢 {ui.badge[lang]}
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f1923", marginBottom: "1rem" }}>{ui.title[lang]}</h1>

          {/* Company / project info */}
          <div style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            {[
              [ui.company[lang], submission.company],
              [ui.project[lang], submission.project[lang]],
              [ui.submitted[lang], submission.submittedDate[lang]],
            ].map(([label, value]) => (
              <div key={label as string}>
                <div style={{ fontSize: "0.68rem", color: "#8a96a3", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "3px" }}>{label}</div>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0f1923" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress tracker */}
        <div style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
            {/* Connecting line */}
            <div style={{ position: "absolute", top: "18px", left: "18px", right: "18px", height: "2px", background: "#e8ecf0", zIndex: 0 }} />
            <div style={{ position: "absolute", top: "18px", left: "18px", height: "2px", background: "linear-gradient(90deg,#5bbdd4,#2a4a7a)", zIndex: 1, width: `${((submission.phase - 1) / 4) * 100}%`, transition: "width 0.6s ease" }} />

            {phases.map(phase => {
              const done = phase.n < submission.phase;
              const active = phase.n === submission.phase;
              return (
                <div key={phase.n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", position: "relative", zIndex: 2 }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: done ? "linear-gradient(135deg,#5bbdd4,#2a4a7a)" : active ? "#fff" : "#f0f2f5", border: active ? "2px solid #5bbdd4" : done ? "none" : "2px solid #e8ecf0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: done ? "#fff" : active ? "#2a4a7a" : "#8a96a3", boxShadow: active ? "0 0 0 4px rgba(91,189,212,0.2)" : "none", transition: "all 0.3s" }}>
                    {done ? "✓" : phase.n}
                  </div>
                  <div style={{ fontSize: "0.65rem", fontWeight: active ? 700 : 500, color: active ? "#2a4a7a" : done ? "#0f1923" : "#8a96a3", textAlign: "center", maxWidth: "70px", lineHeight: 1.3 }}>
                    {phase.label[lang]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Score */}
        <div style={{ background: "#fff", border: `2px solid ${overallBand.color}`, borderRadius: "14px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: overallBand.color, textTransform: "uppercase", marginBottom: "1rem" }}>{ui.scoreTitle[lang]}</div>

          {/* Overall ring + band */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", width: "80px", height: "80px", flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="50" cy="50" r="44" fill="none" stroke="#f0f2f5" strokeWidth="9" />
                <circle cx="50" cy="50" r="44" fill="none" stroke={overallBand.color} strokeWidth="9"
                  strokeDasharray={`${2 * Math.PI * 44}`}
                  strokeDashoffset={`${2 * Math.PI * 44 * (1 - submission.overallScore / 100)}`}
                  strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f1923", lineHeight: 1 }}>{submission.overallScore}</span>
                <span style={{ fontSize: "0.5rem", color: "#8a96a3" }}>/100</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: overallBand.color, background: overallBand.bg, borderRadius: "100px", padding: "3px 12px", display: "inline-block", marginBottom: "0.4rem" }}>
                {overallBand.label[lang]}
              </div>
              <p style={{ fontSize: "0.8rem", color: "#6b7a8d", lineHeight: 1.6, margin: 0, maxWidth: "360px" }}>{ui.scoreNote[lang]}</p>
            </div>
          </div>

          {/* Criteria bars */}
          {submission.criteria.map(c => {
            const band = scoreBand(c.score);
            const bc = bandConfig[band];
            return (
              <div key={c.key} style={{ marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0f1923" }}>{c.label[lang]}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: bc.color, background: bc.bg, padding: "1px 7px", borderRadius: "100px" }}>{bc.label[lang]}</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#0f1923" }}>{c.score}</span>
                  </div>
                </div>
                <div style={{ background: "#f0f2f5", borderRadius: "4px", height: "6px" }}>
                  <div style={{ width: `${c.score}%`, height: "6px", borderRadius: "4px", background: bandGradient[band] }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Next step */}
        <div style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#5bbdd4,#2a4a7a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#fff", fontSize: "0.75rem" }}>3</span>
            </div>
            <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f1923" }}>{ui.nextStep[lang]}</span>
          </div>
          <p style={{ fontSize: "0.84rem", color: "#4a5568", lineHeight: 1.7, margin: "0 0 1rem" }}>{ui.nextDesc[lang]}</p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/submit" style={{ fontSize: "0.82rem", fontWeight: 600, color: "#2a4a7a", textDecoration: "none" }}>{ui.improve[lang]}</Link>
            <span style={{ color: "#e8ecf0" }}>·</span>
            <Link href="/campaign-builder" style={{ fontSize: "0.82rem", fontWeight: 600, color: "#5bbdd4", textDecoration: "none" }}>
              {lang === "FR" ? "Préparer ma page campagne →" : lang === "AR" ? "إعداد صفحة حملتي ←" : "Set up my campaign page →"}
            </Link>
          </div>
        </div>

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
