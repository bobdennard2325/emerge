"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { translations } from "../translations";
import { useLanguage } from "../LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────
type Currency = "MAD" | "EUR" | "USD";
type Option = { value: number; label: Record<string, string> };
type Question = {
  id: string;
  section: Record<string, string>;
  question: Record<string, string>;
  options: Option[];
};

type Profile = {
  key: string;
  label: Record<string, string>;
  desc: Record<string, string>;
  color: string;
  bg: string;
  icon: string;
  maxProjects: Record<string, string>;
  warning: Record<string, string>;
};

// ─── Questions ────────────────────────────────────────────────────────────────
const questions: Question[] = [
  {
    id: "age",
    section: { FR: "Informations personnelles", EN: "Personal information", AR: "المعلومات الشخصية" },
    question: { FR: "Quelle est votre tranche d'âge ?", EN: "What is your age range?", AR: "ما هي فئتك العمرية؟" },
    options: [
      { value: 1, label: { FR: "Moins de 25 ans", EN: "Under 25", AR: "أقل من 25 سنة" } },
      { value: 2, label: { FR: "25 – 34 ans", EN: "25 – 34", AR: "25 – 34 سنة" } },
      { value: 3, label: { FR: "35 – 49 ans", EN: "35 – 49", AR: "35 – 49 سنة" } },
      { value: 4, label: { FR: "50 ans et plus", EN: "50 and over", AR: "50 سنة فأكثر" } },
    ],
  },
  {
    id: "income",
    section: { FR: "Informations personnelles", EN: "Personal information", AR: "المعلومات الشخصية" },
    question: { FR: "Quel est votre revenu mensuel net approximatif ?", EN: "What is your approximate monthly net income?", AR: "ما هو دخلك الشهري الصافي التقريبي؟" },
    options: [], // rendered dynamically based on currency
  },
  {
    id: "savings",
    section: { FR: "Informations personnelles", EN: "Personal information", AR: "المعلومات الشخصية" },
    question: { FR: "Quelle part de vos économies êtes-vous prêt(e) à investir ?", EN: "What share of your savings are you willing to invest?", AR: "ما نسبة مدخراتك التي أنت مستعد للاستثمار بها؟" },
    options: [
      { value: 1, label: { FR: "Moins de 5%", EN: "Less than 5%", AR: "أقل من 5%" } },
      { value: 2, label: { FR: "5% – 15%", EN: "5% – 15%", AR: "5% – 15%" } },
      { value: 3, label: { FR: "15% – 30%", EN: "15% – 30%", AR: "15% – 30%" } },
      { value: 4, label: { FR: "Plus de 30%", EN: "Over 30%", AR: "أكثر من 30%" } },
    ],
  },
  {
    id: "experience",
    section: { FR: "Expérience & connaissance", EN: "Experience & knowledge", AR: "الخبرة والمعرفة" },
    question: { FR: "Quelle est votre expérience en matière d'investissement ?", EN: "What is your investment experience?", AR: "ما مدى خبرتك في مجال الاستثمار؟" },
    options: [
      { value: 1, label: { FR: "Aucune — c'est ma première fois", EN: "None — this is my first time", AR: "لا تجربة — هذه المرة الأولى" } },
      { value: 2, label: { FR: "Limitée — quelques placements (épargne, assurance-vie)", EN: "Limited — some savings or life insurance", AR: "محدودة — بعض التوفير أو التأمين" } },
      { value: 3, label: { FR: "Modérée — bourse, OPCVM", EN: "Moderate — stocks, mutual funds", AR: "متوسطة — أسهم، صناديق استثمار" } },
      { value: 4, label: { FR: "Avancée — capital-investissement, entreprises non cotées", EN: "Advanced — private equity, unlisted companies", AR: "متقدمة — رأس المال الخاص، الشركات غير المدرجة" } },
    ],
  },
  {
    id: "horizon",
    section: { FR: "Expérience & connaissance", EN: "Experience & knowledge", AR: "الخبرة والمعرفة" },
    question: { FR: "Sur quel horizon envisagez-vous vos investissements ?", EN: "What investment horizon do you have in mind?", AR: "ما الأفق الزمني الذي تتوقعه لاستثماراتك؟" },
    options: [
      { value: 1, label: { FR: "Moins de 2 ans", EN: "Less than 2 years", AR: "أقل من سنتين" } },
      { value: 2, label: { FR: "2 – 4 ans", EN: "2 – 4 years", AR: "2 – 4 سنوات" } },
      { value: 3, label: { FR: "5 – 7 ans", EN: "5 – 7 years", AR: "5 – 7 سنوات" } },
      { value: 4, label: { FR: "Plus de 7 ans", EN: "Over 7 years", AR: "أكثر من 7 سنوات" } },
    ],
  },
  {
    id: "loss",
    section: { FR: "Tolérance au risque", EN: "Risk tolerance", AR: "تحمّل المخاطر" },
    question: { FR: "Comment réagiriez-vous si votre investissement perdait 30% de sa valeur ?", EN: "How would you react if your investment lost 30% of its value?", AR: "كيف ستتصرف إذا فقد استثمارك 30% من قيمته؟" },
    options: [
      { value: 1, label: { FR: "Je retirerais immédiatement tout mon capital", EN: "I would withdraw all my capital immediately", AR: "سأسحب كل رأسمالي فوراً" } },
      { value: 2, label: { FR: "Je serais très inquiet(e) et envisagerais de retirer", EN: "I'd be very worried and consider withdrawing", AR: "سأكون قلقاً جداً وأفكر في الانسحاب" } },
      { value: 3, label: { FR: "Je maintiendrais ma position en attendant un rebond", EN: "I'd hold my position and wait for a rebound", AR: "سأحتفظ بمركزي وأنتظر الارتداد" } },
      { value: 4, label: { FR: "Je considérerais investir davantage à prix réduit", EN: "I'd consider investing more at the lower price", AR: "سأفكر في زيادة استثماري بالسعر المنخفض" } },
    ],
  },
  {
    id: "goal",
    section: { FR: "Tolérance au risque", EN: "Risk tolerance", AR: "تحمّل المخاطر" },
    question: { FR: "Quel est votre objectif principal en investissant dans des entreprises en croissance ?", EN: "What is your main goal when investing in growth-stage companies?", AR: "ما هدفك الرئيسي من الاستثمار في شركات النمو؟" },
    options: [
      { value: 1, label: { FR: "Préserver mon capital avant tout", EN: "Preserve my capital above all", AR: "الحفاظ على رأسمالي قبل كل شيء" } },
      { value: 2, label: { FR: "Obtenir un rendement modéré avec peu de risque", EN: "Achieve moderate returns with low risk", AR: "تحقيق عوائد معتدلة مع مخاطر منخفضة" } },
      { value: 3, label: { FR: "Maximiser le rendement en acceptant un risque élevé", EN: "Maximise returns while accepting high risk", AR: "تعظيم العوائد مع قبول مخاطر عالية" } },
      { value: 4, label: { FR: "Soutenir les entreprises marocaines autant que gagner", EN: "Support Moroccan businesses as much as earning", AR: "دعم الشركات المغربية بقدر ما أكسب" } },
    ],
  },
  {
    id: "sharia",
    section: { FR: "Préférences", EN: "Preferences", AR: "التفضيلات" },
    question: { FR: "Souhaitez-vous investir uniquement dans des projets conformes à la Charia ?", EN: "Do you wish to invest only in Sharia-compliant projects?", AR: "هل تريد الاستثمار في مشاريع متوافقة مع الشريعة الإسلامية فقط؟" },
    options: [
      { value: 1, label: { FR: "Oui, uniquement des projets conformes", EN: "Yes, Sharia-compliant only", AR: "نعم، المشاريع المتوافقة مع الشريعة فقط" } },
      { value: 2, label: { FR: "Je préfère, mais pas obligatoire", EN: "I prefer it, but not required", AR: "أفضّل ذلك، لكنه ليس شرطاً" } },
      { value: 3, label: { FR: "Non, tous les projets m'intéressent", EN: "No, all projects interest me", AR: "لا، جميع المشاريع تهمني" } },
    ],
  },
  {
    id: "sector",
    section: { FR: "Préférences", EN: "Preferences", AR: "التفضيلات" },
    question: { FR: "Quels secteurs vous intéressent le plus ?", EN: "Which sectors interest you most?", AR: "ما القطاعات التي تهمك أكثر؟" },
    options: [
      { value: 3, label: { FR: "AgriTech & environnement", EN: "AgriTech & environment", AR: "التكنولوجيا الزراعية والبيئة" } },
      { value: 3, label: { FR: "FinTech & inclusion financière", EN: "FinTech & financial inclusion", AR: "التكنولوجيا المالية والشمول المالي" } },
      { value: 3, label: { FR: "Santé & éducation", EN: "Health & education", AR: "الصحة والتعليم" } },
      { value: 3, label: { FR: "CleanTech & énergie", EN: "CleanTech & energy", AR: "التكنولوجيا النظيفة والطاقة" } },
      { value: 3, label: { FR: "Tous les secteurs m'intéressent", EN: "All sectors interest me", AR: "جميع القطاعات تهمني" } },
    ],
  },
];

// ─── Income brackets — generated dynamically from live exchange rates ────────
// MAD thresholds: 5k / 15k / 40k — converted via live rates (fallback: EUR≈11, USD≈10)
const MAD_THRESHOLDS = [5000, 15000, 40000];
const CURRENCY_SYMBOLS: Record<Currency, string> = { MAD: "MAD", EUR: "€", USD: "$" };
const CURRENCY_PREFIX: Record<Currency, boolean> = { MAD: false, EUR: false, USD: true };

function buildBrackets(currency: Currency, rate: number): { value: number; label: Record<string, string> }[] {
  const sym = CURRENCY_SYMBOLS[currency];
  const prefix = CURRENCY_PREFIX[currency];
  const fmt = (n: number) => {
    const v = currency === "MAD" ? n : Math.round(n / rate / 100) * 100;
    return prefix ? `${sym}${v.toLocaleString()}` : `${v.toLocaleString()} ${sym}`;
  };
  const [a, b, d] = MAD_THRESHOLDS.map(fmt);
  return [
    { value: 1, label: { FR: `Moins de ${a}`,  EN: `Less than ${a}`,  AR: `أقل من ${a}` } },
    { value: 2, label: { FR: `${a} – ${b}`,    EN: `${a} – ${b}`,     AR: `${a} – ${b}` } },
    { value: 3, label: { FR: `${b} – ${d}`,    EN: `${b} – ${d}`,     AR: `${b} – ${d}` } },
    { value: 4, label: { FR: `Plus de ${d}`,   EN: `Over ${d}`,       AR: `أكثر من ${d}` } },
  ];
}

// ─── Risk profiles ────────────────────────────────────────────────────────────
const profiles: Profile[] = [
  {
    key: "conservative",
    label: { FR: "Investisseur Prudent", EN: "Conservative Investor", AR: "المستثمر المحافظ" },
    desc: { FR: "Vous privilégiez la sécurité du capital. Nous vous recommandons des projets à maturité avancée avec des revenus démontrés et un faible niveau de risque.", EN: "You prioritise capital safety. We recommend mature-stage projects with demonstrated revenues and a low risk level.", AR: "أنت تُقدّم أمان رأس المال. نوصيك بمشاريع في مرحلة نضج متقدمة بإيرادات مثبتة ومستوى مخاطر منخفض." },
    color: "#2a7a4a", bg: "#edf7f0", icon: "🛡️",
    maxProjects: { FR: "Projets recommandés : Maturité élevée, Score EMERGE > 70", EN: "Recommended: High maturity, EMERGE score > 70", AR: "الموصى به: نضج عالٍ، نقاط EMERGE > 70" },
    warning: { FR: "Votre profil sera pris en compte lors de l'affichage des projets. Vous recevrez un avertissement si un projet dépasse votre tolérance au risque.", EN: "Your profile will be applied when displaying projects. You will receive a warning if a project exceeds your risk tolerance.", AR: "سيُطبَّق ملفك الشخصي عند عرض المشاريع. ستتلقى تحذيراً إذا تجاوز مشروع ما حدود تحمّلك للمخاطر." },
  },
  {
    key: "moderate",
    label: { FR: "Investisseur Équilibré", EN: "Balanced Investor", AR: "المستثمر المتوازن" },
    desc: { FR: "Vous cherchez un équilibre entre rendement et risque. Vous êtes à l'aise avec une croissance à moyen terme et une diversification entre secteurs.", EN: "You seek a balance between return and risk. You are comfortable with medium-term growth and sector diversification.", AR: "أنت تبحث عن توازن بين العائد والمخاطرة. أنت مرتاح للنمو على المدى المتوسط والتنويع القطاعي." },
    color: "#d4870a", bg: "#fdf5e8", icon: "⚖️",
    maxProjects: { FR: "Projets recommandés : Maturité moyenne à élevée, Score EMERGE > 55", EN: "Recommended: Medium to high maturity, EMERGE score > 55", AR: "الموصى به: نضج متوسط إلى عالٍ، نقاط EMERGE > 55" },
    warning: { FR: "Votre profil sera pris en compte lors de l'affichage des projets. Vous recevrez un avertissement si un projet dépasse votre tolérance au risque.", EN: "Your profile will be applied when displaying projects. You will receive a warning if a project exceeds your risk tolerance.", AR: "سيُطبَّق ملفك الشخصي عند عرض المشاريع. ستتلقى تحذيراً إذا تجاوز مشروع ما حدود تحمّلك للمخاطر." },
  },
  {
    key: "dynamic",
    label: { FR: "Investisseur Dynamique", EN: "Dynamic Investor", AR: "المستثمر الديناميكي" },
    desc: { FR: "Vous acceptez un risque élevé en échange d'un potentiel de rendement fort. Vous êtes prêt(e) à investir dans des projets en phase précoce avec un upside significatif.", EN: "You accept high risk in exchange for strong return potential. You are ready to invest in early-stage projects with significant upside.", AR: "أنت تقبل مخاطر عالية مقابل إمكانية عوائد قوية. أنت مستعد للاستثمار في مشاريع في مراحلها الأولى مع إمكانات نمو كبيرة." },
    color: "#185fa5", bg: "#eaf2fb", icon: "🚀",
    maxProjects: { FR: "Projets recommandés : Tous stades, Score EMERGE > 40", EN: "Recommended: All stages, EMERGE score > 40", AR: "الموصى به: جميع المراحل، نقاط EMERGE > 40" },
    warning: { FR: "Votre profil sera pris en compte lors de l'affichage des projets. Vous recevrez un avertissement si un projet dépasse votre tolérance au risque.", EN: "Your profile will be applied when displaying projects. You will receive a warning if a project exceeds your risk tolerance.", AR: "سيُطبَّق ملفك الشخصي عند عرض المشاريع. ستتلقى تحذيراً إذا تجاوز مشروع ما حدود تحمّلك للمخاطر." },
  },
];

// ─── Score → profile ──────────────────────────────────────────────────────────
function getProfile(answers: Record<string, number>): Profile {
  const riskKeys = ["loss", "goal", "horizon", "experience"];
  const total = riskKeys.reduce((sum, k) => sum + (answers[k] || 0), 0);
  if (total <= 8) return profiles[0];
  if (total <= 13) return profiles[1];
  return profiles[2];
}

// ─── UI labels ────────────────────────────────────────────────────────────────
const ui = {
  pageTitle:   { FR: "Créer mon profil investisseur", EN: "Create my investor profile", AR: "إنشاء ملفي الاستثماري" },
  pageSubtitle:{ FR: "Répondez à ces questions pour que la plateforme puisse vous proposer les projets les mieux adaptés à votre profil et vous alerter si un investissement dépasse votre tolérance au risque.", EN: "Answer these questions so the platform can surface the projects best suited to your profile and alert you if an investment exceeds your risk tolerance.", AR: "أجب على هذه الأسئلة حتى تتمكن المنصة من اقتراح المشاريع الأنسب لملفك وتنبيهك إذا تجاوز استثمار ما حدود تحمّلك للمخاطر." },
  currency:    { FR: "Devise",  EN: "Currency",  AR: "العملة" },
  required:    { FR: "Toutes les questions sont obligatoires", EN: "All questions are required", AR: "جميع الأسئلة إلزامية" },
  submit:      { FR: "Voir mon profil", EN: "See my profile", AR: "عرض ملفي الشخصي" },
  incomplete:  { FR: "Veuillez répondre à toutes les questions avant de continuer.", EN: "Please answer all questions before continuing.", AR: "يرجى الإجابة على جميع الأسئلة قبل المتابعة." },
  yourProfile: { FR: "Votre profil investisseur", EN: "Your investor profile", AR: "ملفك الاستثماري" },
  profileNote: { FR: "Ce profil sera utilisé pour filtrer et classer les opportunités sur la plateforme. Vous pourrez le modifier à tout moment dans vos paramètres.", EN: "This profile will be used to filter and rank opportunities on the platform. You can update it at any time in your settings.", AR: "سيُستخدم هذا الملف لتصفية الفرص وترتيبها على المنصة. يمكنك تعديله في أي وقت من الإعدادات." },
  cta:         { FR: "Voir les campagnes", EN: "Browse campaigns", AR: "تصفح الحملات" },
  retake:      { FR: "Refaire le questionnaire", EN: "Retake questionnaire", AR: "إعادة الاستبيان" },
  disclaimer:  { FR: "Ce questionnaire vise à identifier votre profil de risque à titre indicatif. Il ne constitue pas un conseil en investissement.", EN: "This questionnaire aims to identify your risk profile on an indicative basis. It does not constitute investment advice.", AR: "يهدف هذا الاستبيان إلى تحديد ملف المخاطر الخاص بك بشكل إرشادي. لا يُعدّ توصية استثمارية." },
  back:        { FR: "← Retour à l'accueil", EN: "← Back to home", AR: "← العودة إلى الرئيسية" },
};

// ─── Main page ────────────────────────────────────────────────────────────────
export default function InvestorOnboarding() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];
  const [currency, setCurrency] = useState<Currency>("MAD");
  // Exchange rates: MAD per 1 EUR / 1 USD — fetched live, fallback to static
  const [rates, setRates] = useState<{ EUR: number; USD: number }>({ EUR: 11, USD: 10 });
  const [ratesLoading, setRatesLoading] = useState(false);

  useEffect(() => {
    // Frankfurter API: free, no key, ECB-backed — fetch MAD per EUR and USD
    setRatesLoading(true);
    fetch("https://api.frankfurter.app/latest?from=MAD&to=EUR,USD")
      .then(r => r.json())
      .then(data => {
        if (data?.rates?.EUR && data?.rates?.USD) {
          // API returns MAD→EUR and MAD→USD; we need EUR/USD per MAD → invert
          // Actually frankfurter returns how much 1 MAD = X EUR/USD
          // We want: how many MAD = 1 EUR/USD → invert
          setRates({
            EUR: Math.round(1 / data.rates.EUR),
            USD: Math.round(1 / data.rates.USD),
          });
        }
      })
      .catch(() => { /* keep fallback rates */ })
      .finally(() => setRatesLoading(false));
  }, []);

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const flags: Record<string, string> = {
    FR: "/img/flag_fr.png", AR: "/img/flag_ar.png", EN: "/img/flag_en.png",
  };

  const answered = Object.keys(answers).length;
  const total = questions.length;
  const progress = Math.round((answered / total) * 100);

  const handleSubmit = () => {
    if (answered < total) { setError(true); return; }
    setError(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const profile = submitted ? getProfile(answers) : null;

  // Group questions by section
  const sections: { title: string; qs: Question[] }[] = [];
  questions.forEach(q => {
    const title = q.section[lang];
    const last = sections[sections.length - 1];
    if (last && last.title === title) last.qs.push(q);
    else sections.push({ title, qs: [q] });
  });

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
            { label: lang === "FR" ? "Investisseurs" : lang === "AR" ? "المستثمرون" : "Investors", href: "/investor" },
            { label: lang === "FR" ? "Déposer un projet" : lang === "AR" ? "تقديم مشروع" : "Submit a project", href: "/submit" },
          ] as {label:string;href:string}[]).map(({ label, href }) => (
            <Link key={href} href={href} style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.82rem", fontWeight: 500, whiteSpace: "nowrap" }}>{label}</Link>
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

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "3rem 2rem 5rem" }}>

        {/* ── RESULT ──────────────────────────────────────────── */}
        {submitted && profile ? (
          <div>
            {/* Profile card */}
            <div style={{ background: "#fff", border: `2px solid ${profile.color}`, borderRadius: "18px", padding: "2.5rem", marginBottom: "1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{profile.icon}</div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", color: profile.color, textTransform: "uppercase", marginBottom: "0.5rem" }}>{ui.yourProfile[lang]}</div>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f1923", marginBottom: "1rem" }}>{profile.label[lang as Lang]}</h1>
              <p style={{ fontSize: "0.92rem", color: "#4a5568", lineHeight: 1.75, maxWidth: "520px", margin: "0 auto 1.5rem" }}>{profile.desc[lang]}</p>

              {/* Score bar */}
              <div style={{ background: profile.bg, borderRadius: "10px", padding: "1rem 1.25rem", marginBottom: "1.25rem", textAlign: lang === "AR" ? "right" : "left" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: profile.color, marginBottom: "4px" }}>{profile.maxProjects[lang]}</div>
              </div>

              {/* Warning */}
              <div style={{ background: "#f8f9fb", borderRadius: "10px", padding: "1rem 1.25rem", marginBottom: "1.5rem", textAlign: lang === "AR" ? "right" : "left" }}>
                <div style={{ fontSize: "0.75rem", color: "#6b7a8d", lineHeight: 1.6 }}>ℹ️ {profile.warning[lang]}</div>
              </div>

              {/* Profile note */}
              <p style={{ fontSize: "0.78rem", color: "#8a96a3", fontStyle: "italic", marginBottom: "2rem", lineHeight: 1.6 }}>{ui.profileNote[lang]}</p>

              {/* CTAs */}
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/#campaigns" style={{ background: "linear-gradient(135deg,#5bbdd4,#2a4a7a)", color: "#fff", padding: "0.85rem 2.2rem", borderRadius: "10px", fontSize: "0.95rem", fontWeight: 700, textDecoration: "none" }}>
                  {ui.cta[lang]}
                </Link>
                <button onClick={() => { setSubmitted(false); setAnswers({}); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  style={{ border: "1.5px solid #2a4a7a", color: "#2a4a7a", padding: "0.85rem 2rem", borderRadius: "10px", fontSize: "0.95rem", fontWeight: 600, background: "none", cursor: "pointer" }}>
                  {ui.retake[lang]}
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{ background: "#fff8e6", border: "1px solid #f0d090", borderRadius: "10px", padding: "1rem 1.25rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#7a6000", lineHeight: 1.6 }}>⚠️ {ui.disclaimer[lang]}</div>
            </div>
          </div>

        ) : (
          /* ── QUESTIONNAIRE ──────────────────────────────────── */
          <div>
            {/* Header */}
            <div style={{ marginBottom: "2.5rem" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eaf6fb", color: "#2a6a8a", padding: "0.4rem 1rem", borderRadius: "100px", fontSize: "0.78rem", fontWeight: 600, marginBottom: "1rem", border: "1px solid #c0e4f0" }}>
                <span style={{ width: "7px", height: "7px", background: "#5bbdd4", borderRadius: "50%", display: "inline-block" }} />
                {t.nav.investors}
              </div>
              <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f1923", lineHeight: 1.2, marginBottom: "0.75rem" }}>{ui.pageTitle[lang]}</h1>
              <p style={{ fontSize: "0.9rem", color: "#6b7a8d", lineHeight: 1.7, marginBottom: "1.25rem" }}>{ui.pageSubtitle[lang]}</p>

              {/* Progress bar */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ flex: 1, background: "#e8ecf0", borderRadius: "4px", height: "6px" }}>
                  <div style={{ width: `${progress}%`, height: "6px", borderRadius: "4px", background: "linear-gradient(90deg,#5bbdd4,#2a4a7a)", transition: "width 0.4s ease" }} />
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2a4a7a", minWidth: "45px" }}>{answered}/{total}</span>
              </div>
            </div>

            {/* Sections + Questions */}
            {sections.map((section, si) => (
              <div key={si} style={{ marginBottom: "2.5rem" }}>
                {/* Section header */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
                  <div style={{ height: "1px", flex: 1, background: "#e8ecf0" }} />
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "#8a96a3", textTransform: "uppercase", whiteSpace: "nowrap" }}>{section.title}</span>
                  <div style={{ height: "1px", flex: 1, background: "#e8ecf0" }} />
                </div>

                {section.qs.map((q, qi) => (
                  <div key={q.id} style={{ background: "#fff", border: `1.5px solid ${answers[q.id] !== undefined ? "#5bbdd4" : "#e8ecf0"}`, borderRadius: "14px", padding: "1.5rem", marginBottom: "1rem", transition: "border-color 0.2s" }}>
                    {/* Question number + text */}
                    <div style={{ display: "flex", gap: "12px", marginBottom: "1.1rem", alignItems: "flex-start" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: answers[q.id] !== undefined ? "linear-gradient(135deg,#5bbdd4,#2a4a7a)" : "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: answers[q.id] !== undefined ? "#fff" : "#8a96a3" }}>
                          {answers[q.id] !== undefined ? "✓" : `${sections.slice(0, si).reduce((a, s) => a + s.qs.length, 0) + qi + 1}`}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0f1923", lineHeight: 1.4, margin: 0 }}>{q.question[lang]}</p>
                    </div>

                    {/* Currency toggle for income question */}
                    {q.id === "income" && (
                      <div style={{ display: "flex", gap: "6px", marginBottom: "0.75rem", alignItems: "center" }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#8a96a3", marginRight: "4px" }}>{ui.currency[lang]}:</span>
                        {(["MAD", "EUR", "USD"] as Currency[]).map(cur => (
                          <button key={cur} onClick={() => { setCurrency(cur); setAnswers(prev => ({ ...prev, income: undefined as any })); }}
                            style={{ padding: "3px 12px", borderRadius: "100px", border: `1.5px solid ${currency === cur ? "#2a4a7a" : "#e8ecf0"}`, background: currency === cur ? "#2a4a7a" : "#f8f9fb", color: currency === cur ? "#fff" : "#6b7a8d", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>
                            {cur}
                          </button>
                        ))}
                        {currency !== "MAD" && (
                          <span style={{ fontSize: "0.65rem", color: "#8a96a3", marginLeft: "6px" }}>
                            {ratesLoading ? "…" : `1 ${currency} ≈ ${rates[currency as "EUR"|"USD"]} MAD`}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Options */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {(q.id === "income" ? buildBrackets(currency, rates[currency as "EUR" | "USD"] ?? 1) : q.options).map((opt, oi) => {
                        const selected = answers[q.id] === oi;
                        return (
                          <button key={oi} onClick={() => { setAnswers(prev => ({ ...prev, [q.id]: oi })); setError(false); }}
                            style={{ textAlign: lang === "AR" ? "right" : "left", padding: "0.75rem 1rem", borderRadius: "9px", border: `1.5px solid ${selected ? "#2a4a7a" : "#e8ecf0"}`, background: selected ? "linear-gradient(135deg,rgba(91,189,212,0.08),rgba(42,74,122,0.08))" : "#f8f9fb", cursor: "pointer", fontSize: "0.85rem", color: selected ? "#0f1923" : "#4a5568", fontWeight: selected ? 600 : 400, transition: "all 0.15s" }}>
                            <span style={{ color: selected ? "#2a4a7a" : "#aaa", fontWeight: 700, marginRight: lang === "AR" ? 0 : "8px", marginLeft: lang === "AR" ? "8px" : 0 }}>
                              {String.fromCharCode(65 + oi)}.
                            </span>
                            {opt.label[lang as Lang]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Error */}
            {error && (
              <div style={{ background: "#fdf0f0", border: "1px solid #f0b0b0", borderRadius: "10px", padding: "0.9rem 1.1rem", marginBottom: "1rem", fontSize: "0.82rem", color: "#c0392b" }}>
                ⚠ {ui.incomplete[lang]}
              </div>
            )}

            {/* Submit */}
            <button onClick={handleSubmit}
              style={{ width: "100%", background: answered === total ? "linear-gradient(135deg,#5bbdd4,#2a4a7a)" : "#c8d0d8", color: "#fff", border: "none", borderRadius: "12px", padding: "1rem", fontSize: "1rem", fontWeight: 700, cursor: answered === total ? "pointer" : "not-allowed", transition: "background 0.3s" }}>
              {ui.submit[lang]} {answered === total ? "→" : `(${answered}/${total})`}
            </button>

            {/* Disclaimer */}
            <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#fff8e6", border: "1px solid #f0d090", borderRadius: "10px" }}>
              <div style={{ fontSize: "0.72rem", color: "#7a6000", lineHeight: 1.6 }}>⚠️ {ui.disclaimer[lang]}</div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#0f1923", color: "#8a96a3", textAlign: "center", padding: "1.5rem", fontSize: "0.78rem" }}>
        © 2026 Emerge Capital · Casablanca, Maroc ·{" "}
        <Link href="/legal" style={{ color: "#5bbdd4", textDecoration: "none" }}>{t.footer.legal}</Link> ·{" "}
        <Link href="/privacy" style={{ color: "#5bbdd4", textDecoration: "none" }}>{t.footer.privacy}</Link> ·{" "}
        <Link href="/glossary" style={{ color: "#5bbdd4", textDecoration: "none" }}>{lang === "FR" ? "Lexique" : lang === "AR" ? "القاموس" : "Glossary"}</Link>
      </footer>
    </main>
  );
}
