"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { translations, Lang } from "../translations";
import { useLanguage } from "../LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────
type Stage = "form" | "analysing" | "score";

type FormData = {
  // Account
  username: string;
  password: string;
  acceptTerms: boolean;
  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactRole: string;
  // Company
  companyName: string;
  legalForm: string;
  registrationNumber: string;
  city: string;
  sector: string;
  foundedYear: string;
  employees: string;
  website: string;
  // Project
  projectTitle: string;
  projectDesc: string;
  fundingAmount: string;
  equity: string;
  useOfFunds: string;
  horizon: string;
  // Team
  ceoName: string;
  ceoBackground: string;
  teamSize: string;
  // Financial structure
  usesDebt: string;
  hasInterestBearing: string;
  // Impact
  femaleStaffPct: string;
  youthStaffPct: string;
  debtRatioPct: string;
  impactDesc: string;
  // Sector other
  sectorOther: string;
  // Documents
  uploadedFiles: Record<string, string>;   // key -> filename
  extraDocs: { name: string; filename: string }[];
  hasFinancials: boolean;
  hasBusinessPlan: boolean;
  hasMarketStudy: boolean;
  hasPitchDeck: boolean;
};

type ScoreCriterion = {
  key: string;
  label: Record<string, string>;
  score: number;
  band: "low" | "medium" | "high" | "excellent";
  note: Record<string, string>;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function scoreFromForm(form: FormData): ScoreCriterion[] {
  const docs = Object.keys(form.uploadedFiles || {}).length;
  const docsScore = Math.round(40 + docs * 10);
  const fundingNum = parseInt(form.fundingAmount.replace(/\D/g, "")) || 0;
  const equityNum = parseInt(form.equity) || 0;
  const yearNum = parseInt(form.foundedYear) || 2024;
  const age = 2026 - yearNum;
  const empNum = parseInt(form.employees) || 0;

  const maturity = Math.min(95, Math.round(30 + age * 8 + (empNum > 10 ? 15 : empNum > 3 ? 8 : 0) + (form.hasFinancials ? 10 : 0)));
  const market = Math.min(92, Math.round(50 + (form.hasMarketStudy ? 20 : 0) + (form.sector === "agritech" || form.sector === "fintech" ? 12 : form.sector === "cleantech" ? 10 : 5)));
  const success = Math.min(90, Math.round(40 + (form.ceoBackground.length > 80 ? 20 : 10) + (empNum > 5 ? 12 : 5) + (form.hasBusinessPlan ? 10 : 0)));
  const growth = Math.min(88, Math.round(45 + (form.hasMarketStudy ? 15 : 0) + (form.sector === "fintech" ? 12 : form.sector === "cleantech" ? 10 : 6)));
  const returnScore = Math.min(85, Math.round(equityNum > 0 && fundingNum > 0 ? 50 + Math.min(30, Math.round((fundingNum / 1000000) * 5)) : 40));
  const femPct = parseInt(form.femaleStaffPct) || 0;
  const impactBase = form.sector === "agritech" ? 20 : form.sector === "cleantech" ? 22 : form.sector === "fintech" ? 15 : 10;
  const impactFem = femPct >= 40 ? 10 : femPct >= 25 ? 6 : femPct > 0 ? 3 : 0;
  const youthPct = parseInt(form.youthStaffPct) || 0;
  const impactYouth = youthPct >= 40 ? 10 : youthPct >= 25 ? 6 : youthPct > 0 ? 3 : 0;
  const impactDesc = form.impactDesc.length > 60 ? 8 : form.impactDesc.length > 20 ? 4 : 0;
  const impact = Math.min(94, Math.round(50 + impactBase + (empNum > 10 ? 5 : 2) + impactFem + impactYouth + impactDesc));
  // Sharia assessed by analysts from financial structure + due diligence
  const debtRangeScore = form.debtRatioPct === "low" ? 55 : form.debtRatioPct === "mid" ? 38 : form.debtRatioPct === "high" ? 20 : 45;
  const shariaDebt = form.usesDebt === "no" ? 85 : form.hasInterestBearing === "no" ? 68 : debtRangeScore;
  const social = Math.min(90, Math.round(40 + (empNum > 20 ? 30 : empNum > 10 ? 20 : empNum > 3 ? 12 : 5) + (form.sector === "agritech" ? 12 : 8)));

  const band = (s: number): "low" | "medium" | "high" | "excellent" =>
    s >= 80 ? "excellent" : s >= 65 ? "high" : s >= 45 ? "medium" : "low";

  return [
    { key: "maturity", score: maturity, band: band(maturity),
      label: { FR: "Maturité", EN: "Maturity", AR: "النضج" },
      note: { FR: age > 2 ? "Société établie avec traction démontrée" : "Projet en phase précoce — traction limitée", EN: age > 2 ? "Established company with demonstrated traction" : "Early-stage project — limited traction", AR: age > 2 ? "شركة راسخة بديناميكية مثبتة" : "مشروع في مرحلة مبكرة — ديناميكية محدودة" } },
    { key: "market", score: market, band: band(market),
      label: { FR: "Opportunité marché", EN: "Market opportunity", AR: "فرصة السوق" },
      note: { FR: form.hasMarketStudy ? "Étude de marché fournie — analyse complète disponible" : "Aucune étude de marché — données limitées pour l'analyse", EN: form.hasMarketStudy ? "Market study provided — complete analysis available" : "No market study — limited data for analysis", AR: form.hasMarketStudy ? "دراسة السوق مقدمة — تحليل كامل متاح" : "لا توجد دراسة سوق — بيانات محدودة للتحليل" } },
    { key: "success", score: success, band: band(success),
      label: { FR: "Chance de succès", EN: "Chance of success", AR: "احتمالية النجاح" },
      note: { FR: "Évaluation basée sur l'expérience de l'équipe, la taille de l'équipe et la qualité du plan d'affaires", EN: "Assessment based on team experience, team size and business plan quality", AR: "تقييم مبني على خبرة الفريق وحجمه وجودة خطة الأعمال" } },
    { key: "growth", score: growth, band: band(growth),
      label: { FR: "Probabilité de croissance", EN: "Growth probability", AR: "احتمالية النمو" },
      note: { FR: "Potentiel de scalabilité selon le secteur et les données de marché disponibles", EN: "Scalability potential based on sector and available market data", AR: "إمكانية التوسع بناءً على القطاع وبيانات السوق المتاحة" } },
    { key: "return", score: returnScore, band: band(returnScore),
      label: { FR: "Potentiel de rendement", EN: "Return potential", AR: "إمكانية العائد" },
      note: { FR: "Profil de rendement indicatif — à confirmer par la due diligence des analystes", EN: "Indicative return profile — to be confirmed by analyst due diligence", AR: "ملف العائد الإرشادي — يتم تأكيده من قبل المحللين" } },
    { key: "impact", score: impact, band: band(impact),
      label: { FR: "Impact & durabilité", EN: "Impact & sustainability", AR: "الأثر والاستدامة" },
      note: { FR: "Contribution sectorielle et sociétale évaluée sur la base du secteur d'activité et de l'effectif", EN: "Sectoral and societal contribution assessed from activity sector and headcount", AR: "الأثر القطاعي والمجتمعي مُقيَّم بناءً على قطاع النشاط والموظفين" } },
    { key: "sharia", score: shariaDebt, band: band(shariaDebt),
      label: { FR: "Conformité Charia", EN: "Sharia compliance", AR: "الامتثال الشرعي" },
      note: { FR: "Évaluée par les analystes sur la base de la structure financière — sujet à vérification approfondie", EN: "Assessed by analysts based on financial structure — subject to in-depth verification", AR: "مُقيَّمة من قبل المحللين بناءً على الهيكل المالي — تخضع للتحقق المعمق" } },
    { key: "social", score: social, band: band(social),
      label: { FR: "Bien-être social", EN: "Social welfare", AR: "الرفاه الاجتماعي" },
      note: { FR: `${empNum > 0 ? empNum + " employés déclarés" : "Effectif non précisé"} — impact social évalué selon le secteur`, EN: `${empNum > 0 ? empNum + " employees declared" : "Headcount not specified"} — social impact assessed by sector`, AR: `${empNum > 0 ? empNum + " موظف مُعلن" : "لم يُحدد الموظفون"} — الأثر الاجتماعي مُقيَّم حسب القطاع` } },
  ];
}

function overallScore(criteria: ScoreCriterion[]) {
  return Math.round(criteria.reduce((s, c) => s + c.score, 0) / criteria.length);
}

// ─── Band config ──────────────────────────────────────────────────────────────
const bandConfig = {
  low:       { label: { FR: "Faible",    EN: "Low",       AR: "منخفض" }, color: "#e05c5c", bg: "#fdf0f0" },
  medium:    { label: { FR: "Moyen",     EN: "Medium",    AR: "متوسط" }, color: "#d4870a", bg: "#fdf5e8" },
  high:      { label: { FR: "Élevé",     EN: "High",      AR: "مرتفع" }, color: "#2a7a4a", bg: "#edf7f0" },
  excellent: { label: { FR: "Excellent", EN: "Excellent", AR: "ممتاز" }, color: "#185fa5", bg: "#eaf2fb" },
};
const bandGradient = {
  low: "linear-gradient(90deg,#e05c5c,#e87a7a)",
  medium: "linear-gradient(90deg,#d4870a,#f0a832)",
  high: "linear-gradient(90deg,#2a7a4a,#5bbdd4)",
  excellent: "linear-gradient(90deg,#185fa5,#5bbdd4)",
};

// ─── ScoreBar ────────────────────────────────────────────────────────────────
function ScoreBar({ c, lang, visible }: { c: ScoreCriterion; lang: Lang; visible: boolean }) {
  const band = bandConfig[c.band];
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f1923" }}>{c.label[lang as Lang]}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: band.color, background: band.bg, padding: "2px 8px", borderRadius: "100px" }}>{band.label[lang as Lang]}</span>
          <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0f1923" }}>{c.score}</span>
        </div>
      </div>
      <div style={{ background: "#f0f2f5", borderRadius: "6px", height: "8px", overflow: "hidden" }}>
        <div style={{ width: visible ? `${c.score}%` : "0%", height: "8px", borderRadius: "6px", background: bandGradient[c.band], transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
      <div style={{ fontSize: "0.72rem", color: "#8a96a3", marginTop: "0.2rem", lineHeight: 1.4 }}>{c.note[lang]}</div>
    </div>
  );
}

// ─── Analysing screen ─────────────────────────────────────────────────────────
function AnalysingScreen({ lang, onComplete }: { lang: Lang; onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const steps = {
    FR: ["Réception du dossier…", "Analyse des documents financiers…", "Évaluation de l'opportunité de marché…", "Calcul de la conformité Charia…", "Évaluation de l'impact social…", "Génération du score final…"],
    EN: ["Receiving file…", "Analysing financial documents…", "Evaluating market opportunity…", "Computing Sharia compliance…", "Assessing social impact…", "Generating final score…"],
    AR: ["استلام الملف…", "تحليل الوثائق المالية…", "تقييم فرصة السوق…", "احتساب الامتثال الشرعي…", "تقييم الأثر الاجتماعي…", "توليد النقاط النهائية…"],
  };
  const stepsArr = steps[lang as keyof typeof steps] || steps.EN;

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => {
        if (s >= stepsArr.length - 1) { clearInterval(interval); setTimeout(onComplete, 1200); return s; }
        return s + 1;
      });
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const pct = Math.round(((step + 1) / stepsArr.length) * 100);

  const title = { FR: "Analyse IA en cours", EN: "AI analysis in progress", AR: "تحليل الذكاء الاصطناعي جارٍ" };
  const subtitle = { FR: "Nos algorithmes analysent votre dossier selon huit critères. Cette opération prend généralement moins d'une minute.", EN: "Our algorithms are analysing your file across eight criteria. This typically takes less than a minute.", AR: "تحلّل خوارزمياتنا ملفك وفق ثمانية معايير. يستغرق هذا عادةً أقل من دقيقة." };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fb", padding: "2rem" }}>
      <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
        {/* Animated logo ring */}
        <div style={{ width: "100px", height: "100px", margin: "0 auto 2rem", position: "relative" }}>
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
            <circle cx="50" cy="50" r="44" fill="none" stroke="#e8ecf0" strokeWidth="8" />
            <circle cx="50" cy="50" r="44" fill="none" stroke="url(#grad)" strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - pct / 100)}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5bbdd4" />
                <stop offset="100%" stopColor="#2a4a7a" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 800, color: "#0f1923" }}>
            {pct}%
          </div>
        </div>

        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f1923", marginBottom: "0.75rem" }}>{title[lang as keyof typeof title] || title.EN}</h2>
        <p style={{ fontSize: "0.88rem", color: "#6b7a8d", lineHeight: 1.65, marginBottom: "2rem" }}>{subtitle[lang as keyof typeof subtitle] || subtitle.EN}</p>

        {/* Steps */}
        <div style={{ textAlign: "left", background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {stepsArr.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", opacity: i <= step ? 1 : 0.3, transition: "opacity 0.4s" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0, background: i < step ? "linear-gradient(135deg,#5bbdd4,#2a4a7a)" : i === step ? "#eaf6fb" : "#f0f2f5", border: i === step ? "2px solid #5bbdd4" : "none", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.4s" }}>
                {i < step && <span style={{ color: "#fff", fontSize: "0.6rem", fontWeight: 700 }}>✓</span>}
                {i === step && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#5bbdd4", animation: "pulse 1s infinite" }} />}
              </div>
              <span style={{ fontSize: "0.8rem", color: i <= step ? "#0f1923" : "#8a96a3", fontWeight: i === step ? 600 : 400 }}>{s}</span>
            </div>
          ))}
        </div>

        <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }`}</style>
      </div>
    </div>
  );
}

// ─── UI labels ────────────────────────────────────────────────────────────────
const ui = {
  // Account
  sec0:          { FR: "0. Créez votre compte",        EN: "0. Create your account",       AR: "0. أنشئ حسابك" },
  sec0note:      { FR: "Votre identifiant de plateforme. Vous l'utiliserez pour vous connecter et suivre votre dossier.", EN: "Your platform identity. You will use it to log in and track your file.", AR: "هويتك على المنصة. ستستخدمها لتسجيل الدخول ومتابعة ملفك." },
  username:      { FR: "Nom d'utilisateur *",         EN: "Username *",                   AR: "اسم المستخدم *" },
  usernameHint:  { FR: "Lettres, chiffres et _ uniquement. Ex: greenroots_ma", EN: "Letters, numbers and _ only. E.g. greenroots_ma", AR: "أحرف وأرقام و _ فقط. مثال: greenroots_ma" },
  password:      { FR: "Mot de passe *",               EN: "Password *",                   AR: "كلمة المرور *" },
  passwordHint:  { FR: "Minimum 8 caractères",         EN: "Minimum 8 characters",         AR: "8 أحرف على الأقل" },
  terms:         { FR: "J'accepte les conditions générales d'utilisation et la politique de confidentialité d'EMERGE Capital *", EN: "I accept EMERGE Capital's terms of use and privacy policy *", AR: "أقبل شروط استخدام EMERGE Capital وسياسة الخصوصية *" },
  // Contact
  sec0b:         { FR: "Personne de contact",          EN: "Contact person",               AR: "شخص الاتصال" },
  sec0bnote:     { FR: "La personne qu'EMERGE contactera pour la due diligence et l'échange avec nos analystes.", EN: "The person EMERGE will contact for due diligence and the exchange with our analysts.", AR: "الشخص الذي ستتواصل معه EMERGE لإجراء العناية الواجبة والتبادل مع محللينا." },
  contactName:   { FR: "Nom complet *",                EN: "Full name *",                  AR: "الاسم الكامل *" },
  contactEmail:  { FR: "E-mail *",                     EN: "Email *",                      AR: "البريد الإلكتروني *" },
  contactPhone:  { FR: "Téléphone *",                  EN: "Phone *",                      AR: "الهاتف *" },
  contactRole:   { FR: "Fonction dans la société",     EN: "Role in the company",          AR: "المنصب في الشركة" },
  back:          { FR: "← Retour à l'accueil",       EN: "← Back to home",              AR: "← العودة إلى الرئيسية" },
  badge:         { FR: "Porteur de projet",           EN: "Entrepreneur",                 AR: "صاحب المشروع" },
  title:         { FR: "Soumettez votre projet",      EN: "Submit your project",          AR: "قدّم مشروعك" },
  subtitle:      { FR: "Gratuit et sans engagement. Remplissez ce formulaire et téléchargez vos documents pour recevoir votre évaluation IA multi-critères.", EN: "Free and without commitment. Complete this form and upload your documents to receive your multi-criteria AI assessment.", AR: "مجاني وبدون التزام. أكمل هذا النموذج وارفع وثائقك للحصول على تقييم الذكاء الاصطناعي متعدد المعايير." },
  // Sections
  sec1:          { FR: "1. Informations sur la société",   EN: "1. Company information",        AR: "1. معلومات الشركة" },
  sec2:          { FR: "2. Le projet & le financement",    EN: "2. Project & funding",           AR: "2. المشروع والتمويل" },
  sec3:          { FR: "3. L'équipe dirigeante",           EN: "3. Management team",             AR: "3. الفريق الإداري" },
  sec4:          { FR: "4. Conformité Charia",             EN: "4. Sharia compliance",           AR: "4. الامتثال الشرعي" },
  sec5:          { FR: "5. Documents",                     EN: "5. Documents",                   AR: "5. الوثائق" },
  // Fields
  companyName:   { FR: "Dénomination sociale *",      EN: "Company legal name *",         AR: "الاسم القانوني للشركة *" },
  legalForm:     { FR: "Forme juridique *",            EN: "Legal form *",                 AR: "الشكل القانوني *" },
  regNumber:     { FR: "N° d'immatriculation *",       EN: "Registration number *",        AR: "رقم التسجيل *" },
  city:          { FR: "Ville du siège *",             EN: "City (HQ) *",                  AR: "مدينة المقر *" },
  sector:        { FR: "Secteur d'activité *",         EN: "Sector *",                     AR: "قطاع النشاط *" },
  foundedYear:   { FR: "Année de création *",          EN: "Founded year *",               AR: "سنة التأسيس *" },
  employees:     { FR: "Nombre d'employés *",          EN: "Number of employees *",        AR: "عدد الموظفين *" },
  website:       { FR: "Site web",                     EN: "Website",                      AR: "الموقع الإلكتروني" },
  projectTitle:  { FR: "Titre du projet *",            EN: "Project title *",              AR: "عنوان المشروع *" },
  projectDesc:   { FR: "Description du projet *",      EN: "Project description *",        AR: "وصف المشروع *" },
  projectDescPH: { FR: "Décrivez votre projet, votre valeur ajoutée, votre marché cible et vos réalisations à ce jour…", EN: "Describe your project, value proposition, target market and achievements to date…", AR: "صف مشروعك وقيمته المضافة وسوقه المستهدف وإنجازاته حتى الآن…" },
  funding:       { FR: "Montant recherché (MAD) *",    EN: "Amount sought (MAD) *",        AR: "المبلغ المطلوب (درهم) *" },
  equity:        { FR: "Participation offerte (%) *",  EN: "Equity offered (%) *",         AR: "الحصة المعروضة (%) *" },
  useOfFunds:    { FR: "Utilisation des fonds *",      EN: "Use of funds *",               AR: "استخدام الأموال *" },
  useOfFundsPH:  { FR: "Ex. 40% R&D, 30% commercial, 20% recrutement, 10% fonds de roulement…", EN: "E.g. 40% R&D, 30% sales, 20% recruitment, 10% working capital…", AR: "مثال: 40% بحث وتطوير، 30% مبيعات، 20% توظيف، 10% رأس مال عامل…" },
  horizon:       { FR: "Durée prévue de l'investissement *", EN: "Expected investment duration *", AR: "المدة المتوقعة للاستثمار *" },
  horizonHint:   { FR: "Dans combien d'années estimez-vous qu'un investisseur pourrait réaliser sa plus-value ? (cession, rachat, introduction en bourse…)", EN: "In how many years do you estimate an investor could realise a return? (sale, buy-back, IPO…)", AR: "خلال كم سنة تقدّر أن يتمكن المستثمر من تحقيق عائده؟ (بيع، استرداد، طرح عام…)" },
  ceoName:       { FR: "Nom du dirigeant principal *", EN: "CEO / Lead founder name *",    AR: "اسم المسؤول الرئيسي *" },
  ceoBackground: { FR: "Parcours & expérience *",      EN: "Background & experience *",    AR: "المسار والخبرة *" },
  ceoBackPH:     { FR: "Expériences professionnelles, formations, réalisations pertinentes…", EN: "Professional experience, education, relevant achievements…", AR: "الخبرات المهنية، التعليم، الإنجازات ذات الصلة…" },
  teamSize:      { FR: "Taille de l'équipe fondatrice", EN: "Founding team size",          AR: "حجم الفريق المؤسس" },
  // Financial structure
  sec_fin:       { FR: "4. Structure financière",      EN: "4. Financial structure",       AR: "4. الهيكل المالي" },
  sec_fin_note:  { FR: "Ces informations aident nos analystes à évaluer la structure de financement et l'éligibilité Charia. Elles ne préjugent pas du résultat.", EN: "This information helps our analysts assess the financing structure and Sharia eligibility. It does not prejudge the outcome.", AR: "تساعد هذه المعلومات محللينا على تقييم هيكل التمويل وأهلية الامتثال الشرعي. لا تحدد النتيجة مسبقاً." },
  // Impact section
  sec_impact:    { FR: "5. Impact & Emploi",           EN: "5. Impact & Employment",       AR: "5. الأثر والتوظيف" },
  sec_impact_note:{ FR: "Informations optionnelles qui enrichissent le score d'impact.", EN: "Optional information that enriches the impact score.", AR: "معلومات اختيارية تُثري نقاط الأثر." },
  femaleStaff:   { FR: "Part des femmes dans l'effectif (%)", EN: "Female staff share (%)",       AR: "نسبة الموظفات (%)" },
  youthStaffPct: { FR: "Part des moins de 30 ans dans l'effectif (%)", EN: "Staff share under 30 years old (%)", AR: "نسبة الموظفين دون 30 عاماً (%)" },
  underYes:      { FR: "Oui",                          EN: "Yes",                          AR: "نعم" },
  underPartial:  { FR: "Partiellement",                EN: "Partially",                    AR: "جزئياً" },
  underNo:       { FR: "Non",                          EN: "No",                           AR: "لا" },
  impactDescQ:   { FR: "Votre société mène-t-elle des actions en faveur de l'impact social, environnemental ou de la gouvernance ? Si oui, décrivez-les librement.", EN: "Does your company carry out any actions for social, environmental or governance impact? If so, describe them freely.", AR: "هل تقوم شركتك بأي إجراءات لدعم الأثر الاجتماعي أو البيئي أو الحوكمة؟ إن كان الأمر كذلك، صفها بحرية." },
  impactDescPH:  { FR: "Ex: 30% d'énergies renouvelables, partenariats avec des coopératives rurales, programme d'apprentissage jeunes…", EN: "E.g. 30% renewable energy, partnerships with rural cooperatives, youth apprenticeship programme…", AR: "مثال: 30% طاقة متجددة، شراكات مع تعاونيات ريفية، برنامج تدريب للشباب…" },
  usesDebt:      { FR: "Votre société a-t-elle recours à l'emprunt bancaire ou obligataire ? *", EN: "Does your company use bank or bond borrowing? *", AR: "هل تستخدم شركتك الاقتراض البنكي أو السندات؟ *" },
  debtYes:       { FR: "Oui",                          EN: "Yes",                          AR: "نعم" },
  debtNo:        { FR: "Non",                          EN: "No",                           AR: "لا" },
  interestQ:     { FR: "Ces emprunts portent-ils intérêt ? *", EN: "Do these borrowings bear interest? *", AR: "هل تحمل هذه القروض فوائد؟ *" },
  interestYes:   { FR: "Oui, avec intérêts",           EN: "Yes, interest-bearing",        AR: "نعم، بفوائد" },
  interestNo:    { FR: "Non (ex. mourabaha, ijara)", EN: "No (e.g. murabaha, ijara)",    AR: "لا (مثل المرابحة، الإجارة)" },
  debtRatioPctQ: { FR: "Ratio dettes portant intérêt / actif total", EN: "Interest-bearing debt / total assets", AR: "نسبة الديون المحملة بفوائد / إجمالي الأصول" },
  debtRange1:    { FR: "Moins de 33%",    EN: "Below 33%",        AR: "أقل من 33%" },
  debtRange2:    { FR: "Entre 33% et 50%", EN: "Between 33–50%",   AR: "بين 33% و50%" },
  debtRange3:    { FR: "Plus de 50%",      EN: "Above 50%",        AR: "أكثر من 50%" },
  // Sector other
  sectorOtherLabel: { FR: "Précisez le secteur *",    EN: "Please specify the sector *",  AR: "حدد القطاع *" },
  // Documents
  docsTitle:     { FR: "5. Documents",                 EN: "5. Documents",                 AR: "5. الوثائق" },
  docsNote:      { FR: "Téléchargez vos documents directement. Les formats acceptés sont PDF, Word, Excel et PowerPoint (max 20 Mo par fichier).", EN: "Upload your documents directly. Accepted formats are PDF, Word, Excel and PowerPoint (max 20 MB per file).", AR: "ارفع وثائقك مباشرة. الصيغ المقبولة: PDF وWord وExcel وPowerPoint (حد أقصى 20 ميجابايت لكل ملف)." },
  docsBP:        { FR: "Plan d'affaires",              EN: "Business plan",                AR: "خطة الأعمال" },
  docsFS:        { FR: "États financiers",             EN: "Financial statements",         AR: "القوائم المالية" },
  docsMS:        { FR: "Étude de marché",              EN: "Market study",                 AR: "دراسة السوق" },
  docsPD:        { FR: "Pitch deck",                   EN: "Pitch deck",                   AR: "عرض المشروع" },
  docsCD:        { FR: "Documents sociaux",            EN: "Corporate documents",          AR: "الوثائق القانونية" },
  docsExtra:     { FR: "+ Ajouter un document",        EN: "+ Add a document",             AR: "+ إضافة وثيقة" },
  docsExtraName: { FR: "Nom du document",              EN: "Document name",                AR: "اسم الوثيقة" },
  docsUploaded:  { FR: "Téléchargé",                   EN: "Uploaded",                     AR: "تم الرفع" },
  docsUpload:    { FR: "Choisir un fichier",           EN: "Choose file",                  AR: "اختر ملفاً" },
  submit:        { FR: "Soumettre mon dossier →",      EN: "Submit my file →",             AR: "تقديم ملفي ←" },
  required:      { FR: "* Champs obligatoires",        EN: "* Required fields",            AR: "* حقول إلزامية" },
  incomplete:    { FR: "Veuillez remplir tous les champs obligatoires avant de soumettre.", EN: "Please fill in all required fields before submitting.", AR: "يرجى ملء جميع الحقول الإلزامية قبل التقديم." },
  // Score screen
  scoreTitle:    { FR: "Votre score préliminaire EMERGE", EN: "Your preliminary EMERGE score", AR: "نقاطك الأولية من EMERGE" },
  scoreNote:     { FR: "Ce score est une évaluation préliminaire basée sur les informations soumises. Il sera révisé et confirmé lors de la due diligence par nos analystes financiers.", EN: "This score is a preliminary assessment based on the information submitted. It will be reviewed and confirmed during due diligence by our financial analysts.", AR: "هذه النقاط تقييم أولي مبني على المعلومات المقدمة. سيتم مراجعتها وتأكيدها خلال العناية الواجبة من قبل محللينا الماليين." },
  nextSteps:     { FR: "Prochaines étapes", EN: "Next steps", AR: "الخطوات التالية" },
  step1:         { FR: "Votre dossier est en file d'attente pour la revue de nos analystes financiers.", EN: "Your file is queued for review by our financial analysts.", AR: "ملفك في قائمة انتظار مراجعة محللينا الماليين." },
  step2:         { FR: "La due diligence comprend la vérification des documents, une revue des données publiques et un échange avec votre équipe.", EN: "Due diligence includes document verification, a public-data review and an exchange with your team.", AR: "تشمل العناية الواجبة التحقق من الوثائق ومراجعة البيانات العامة وتبادلاً مع فريقك." },
  step3:         { FR: "Vous recevrez une décision sous 10 à 20 jours ouvrables.", EN: "You will receive a decision within 10 to 20 business days.", AR: "ستتلقى قراراً في غضون 10 إلى 20 يوم عمل." },
  disclaimer:    { FR: "Ce score est un résumé de due diligence indicatif. Il ne constitue pas un conseil en investissement.", EN: "This score is an indicative due-diligence summary. It does not constitute investment advice.", AR: "هذه النقاط ملخص عناية واجبة إرشادي. لا تُعدّ توصية استثمارية." },
  overallLabel:  { FR: "Score global",                 EN: "Overall score",                AR: "النتيجة الإجمالية" },
  backHome:      { FR: "Retour à l'accueil",           EN: "Back to home",                 AR: "العودة إلى الرئيسية" },
};

// ─── Field helpers ────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.7rem 0.9rem", borderRadius: "8px", border: "1.5px solid #e8ecf0", fontSize: "0.88rem", color: "#0f1923", background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.2s" };
const errorInputStyle: React.CSSProperties = { ...inputStyle, border: "1.5px solid #e05c5c", background: "#fff8f8" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#4a5568", marginBottom: "0.4rem" };
const sectionStyle: React.CSSProperties = { background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "1.5rem", marginBottom: "1.25rem" };
const sectionTitleStyle: React.CSSProperties = { fontSize: "0.9rem", fontWeight: 800, color: "#0f1923", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "2px solid #eaf6fb" };
const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" };
const gridClass = "emerge-grid-2";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={labelStyle}>{label}</label>{children}</div>;
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Submit() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];
  const [stage, setStage] = useState<Stage>("form");
  const [error, setError] = useState(false);
  const [touched, setTouched] = useState(false);
  const [barsVisible, setBarsVisible] = useState(false);
  const scoreRef = useRef<HTMLDivElement>(null);
  const [criteria, setCriteria] = useState<ScoreCriterion[]>([]);
  const [overall, setOverall] = useState(0);

  const [form, setForm] = useState<FormData>({
    username: "", password: "", acceptTerms: false,
    contactName: "", contactEmail: "", contactPhone: "", contactRole: "",
    companyName: "", legalForm: "", registrationNumber: "", city: "", sector: "", sectorOther: "",
    foundedYear: "", employees: "", website: "", projectTitle: "", projectDesc: "",
    fundingAmount: "", equity: "", useOfFunds: "", horizon: "",
    ceoName: "", ceoBackground: "", teamSize: "",
    usesDebt: "", hasInterestBearing: "",
    femaleStaffPct: "", youthStaffPct: "", debtRatioPct: "", impactDesc: "",
    uploadedFiles: {}, extraDocs: [],
    hasFinancials: false, hasBusinessPlan: false, hasMarketStudy: false, hasPitchDeck: false,
  });

  const set = (k: keyof FormData, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (stage !== "score") return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setBarsVisible(true); }, { threshold: 0.1 });
    if (scoreRef.current) observer.observe(scoreRef.current);
    return () => observer.disconnect();
  }, [stage]);

  const flags: Record<string, string> = { FR: "/img/flag_fr.png", AR: "/img/flag_ar.png", EN: "/img/flag_en.png" };

  const requiredFilled = form.username && form.password && form.password.length >= 8 &&
    form.acceptTerms && form.contactName && form.contactEmail && form.contactPhone &&
    form.companyName && form.legalForm && form.registrationNumber && form.city &&
    form.sector && (form.sector !== "other" || form.sectorOther) &&
    form.foundedYear && form.employees && form.projectTitle && form.projectDesc &&
    form.fundingAmount && form.equity && form.useOfFunds && form.horizon &&
    form.ceoName && form.ceoBackground && form.usesDebt;

  const handleSubmit = () => {
    if (!requiredFilled) { setError(true); setTouched(true); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setError(false);
    setStage("analysing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAnalysisComplete = () => {
    const c = scoreFromForm(form);
    setCriteria(c);
    setOverall(overallScore(c));
    setStage("score");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (stage === "analysing") return <AnalysingScreen lang={lang} onComplete={handleAnalysisComplete} />;

  const overallBand = overall >= 80 ? "excellent" : overall >= 65 ? "high" : overall >= 45 ? "medium" : "low";
  const overallBandCfg = bandConfig[overallBand];

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

      {stage === "form" && (
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 2rem 5rem" }}>
          {/* Header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eaf6fb", color: "#2a6a8a", padding: "0.4rem 1rem", borderRadius: "100px", fontSize: "0.78rem", fontWeight: 600, marginBottom: "1rem", border: "1px solid #c0e4f0" }}>
              <span style={{ width: "7px", height: "7px", background: "#5bbdd4", borderRadius: "50%", display: "inline-block" }} />
              {ui.badge[lang]}
            </div>
            <h1 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#0f1923", marginBottom: "0.75rem" }}>{ui.title[lang]}</h1>
            <p style={{ fontSize: "0.9rem", color: "#6b7a8d", lineHeight: 1.7, marginBottom: "0.5rem" }}>{ui.subtitle[lang]}</p>
            <p style={{ fontSize: "0.75rem", color: "#8a96a3", fontStyle: "italic" }}>{ui.required[lang]}</p>
          </div>

          {error && (
            <div style={{ background: "#fdf0f0", border: "1px solid #f0b0b0", borderRadius: "10px", padding: "0.9rem 1.1rem", marginBottom: "1.5rem", fontSize: "0.82rem", color: "#c0392b" }}>
              ⚠ {ui.incomplete[lang]}
            </div>
          )}

          {/* SECTION 0 — Account */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>{ui.sec0[lang]}</div>
            <p style={{ fontSize: "0.78rem", color: "#6b7a8d", marginBottom: "1.1rem", lineHeight: 1.6, fontStyle: "italic" }}>{ui.sec0note[lang]}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="emerge-grid-2" style={gridStyle}>
                <Field label={ui.username[lang]}>
                  <input style={touched && !form.username ? errorInputStyle : inputStyle} value={form.username} onChange={e => set("username", e.target.value)} placeholder="greenroots_ma" />
                  <span style={{ fontSize: "0.7rem", color: "#8a96a3", marginTop: "3px", display: "block" }}>{ui.usernameHint[lang]}</span>
                </Field>
                <Field label={ui.password[lang]}>
                  <input style={touched && (form.password.length < 8) ? errorInputStyle : inputStyle} type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" />
                  <span style={{ fontSize: "0.7rem", color: "#8a96a3", marginTop: "3px", display: "block" }}>{ui.passwordHint[lang]}</span>
                </Field>
              </div>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", padding: "0.75rem 1rem", borderRadius: "9px", border: `1.5px solid ${form.acceptTerms ? "#2a4a7a" : "#e8ecf0"}`, background: form.acceptTerms ? "linear-gradient(135deg,rgba(91,189,212,0.08),rgba(42,74,122,0.08))" : "#f8f9fb", transition: "all 0.15s" }}>
                <input type="checkbox" checked={form.acceptTerms} onChange={e => set("acceptTerms", e.target.checked)} style={{ accentColor: "#2a4a7a", width: "16px", height: "16px", marginTop: "2px", flexShrink: 0 }} />
                <span style={{ fontSize: "0.82rem", color: "#0f1923", lineHeight: 1.55 }}>{ui.terms[lang]}</span>
              </label>
            </div>

            {/* Contact person subsection */}
            <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid #f0f2f5" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2a4a7a", marginBottom: "4px" }}>{ui.sec0b[lang]}</div>
              <p style={{ fontSize: "0.75rem", color: "#8a96a3", marginBottom: "1rem", lineHeight: 1.55, fontStyle: "italic" }}>{ui.sec0bnote[lang]}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="emerge-grid-2" style={gridStyle}>
                  <Field label={ui.contactName[lang]}>
                    <input style={touched && !form.contactName ? errorInputStyle : inputStyle} value={form.contactName} onChange={e => set("contactName", e.target.value)} placeholder="Youssef Benali" />
                  </Field>
                  <Field label={ui.contactRole[lang]}>
                    <input style={inputStyle} value={form.contactRole} onChange={e => set("contactRole", e.target.value)} placeholder="CEO" />
                  </Field>
                  <Field label={ui.contactEmail[lang]}>
                    <input style={touched && !form.contactEmail ? errorInputStyle : inputStyle} type="email" value={form.contactEmail} onChange={e => set("contactEmail", e.target.value)} placeholder="youssef@greenroots.ma" />
                  </Field>
                  <Field label={ui.contactPhone[lang]}>
                    <input style={touched && !form.contactPhone ? errorInputStyle : inputStyle} type="tel" value={form.contactPhone} onChange={e => set("contactPhone", e.target.value)} placeholder="+212 6 00 00 00 00" />
                  </Field>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1 — Company */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>{ui.sec1[lang]}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="emerge-grid-2" style={gridStyle}>
                <Field label={ui.companyName[lang]}>
                  <input style={touched && !form.companyName ? errorInputStyle : inputStyle} value={form.companyName} onChange={e => set("companyName", e.target.value)} placeholder="GreenRoots S.A.S." />
                </Field>
                <Field label={ui.legalForm[lang]}>
                  <select style={touched && !form.legalForm ? errorInputStyle : inputStyle} value={form.legalForm} onChange={e => set("legalForm", e.target.value)}>
                    <option value="">—</option>
                    <option value="sarl">SARL</option>
                    <option value="sas">S.A.S.</option>
                    <option value="sa">S.A.</option>
                    <option value="sarlau">SARL AU</option>
                    <option value="auto">Auto-entrepreneur</option>
                  </select>
                </Field>
                <Field label={ui.regNumber[lang]}>
                  <input style={touched && !form.registrationNumber ? errorInputStyle : inputStyle} value={form.registrationNumber} onChange={e => set("registrationNumber", e.target.value)} placeholder="RC 123456" />
                </Field>
                <Field label={ui.city[lang]}>
                  <input style={touched && !form.city ? errorInputStyle : inputStyle} value={form.city} onChange={e => set("city", e.target.value)} placeholder="Casablanca" />
                </Field>
                <Field label={ui.sector[lang]}>
                  <select style={touched && !form.sector ? errorInputStyle : inputStyle} value={form.sector} onChange={e => set("sector", e.target.value)}>
                    <option value="">—</option>
                    <option value="agritech">AgriTech</option>
                    <option value="fintech">FinTech</option>
                    <option value="cleantech">CleanTech</option>
                    <option value="healthtech">HealthTech</option>
                    <option value="edtech">EdTech</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="logistics">Logistique & Transport</option>
                    <option value="real_estate">Immobilier</option>
                    <option value="tourism">Tourisme & Hôtellerie</option>
                    <option value="food">Agroalimentaire</option>
                    <option value="manufacturing">Industrie & Manufacturing</option>
                    <option value="construction">BTP & Construction</option>
                    <option value="retail">Commerce & Distribution</option>
                    <option value="media">Médias & Communication</option>
                    <option value="sport">Sport & Loisirs</option>
                    <option value="social">Impact Social & ONG</option>
                    <option value="services">Services aux entreprises</option>
                    <option value="other">{lang === "FR" ? "Autre (préciser)" : lang === "AR" ? "أخرى (حدد)" : "Other (specify)"}</option>
                  </select>
                </Field>
                {form.sector === "other" && (
                  <Field label={ui.sectorOtherLabel[lang]}>
                    <input style={touched && !form.sectorOther ? errorInputStyle : inputStyle} value={form.sectorOther} onChange={e => set("sectorOther", e.target.value)} placeholder={lang === "FR" ? "Ex: Biotechnologie" : lang === "AR" ? "مثال: التكنولوجيا الحيوية" : "E.g. Biotechnology"} />
                  </Field>
                )}
                <Field label={ui.foundedYear[lang]}>
                  <input style={touched && !form.foundedYear ? errorInputStyle : inputStyle} type="number" value={form.foundedYear} onChange={e => set("foundedYear", e.target.value)} placeholder="2021" min="1900" max="2026" />
                </Field>
                <Field label={ui.employees[lang]}>
                  <input style={touched && !form.employees ? errorInputStyle : inputStyle} type="number" value={form.employees} onChange={e => set("employees", e.target.value)} placeholder="12" min="0" />
                </Field>
                <Field label={ui.website[lang]}>
                  <input style={inputStyle} value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://monentreprise.ma" />
                </Field>
              </div>
            </div>
          </div>

          {/* SECTION 2 — Project & funding */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>{ui.sec2[lang]}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Field label={ui.projectTitle[lang]}>
                <input style={touched && !form.projectTitle ? errorInputStyle : inputStyle} value={form.projectTitle} onChange={e => set("projectTitle", e.target.value)} placeholder="Extension de la gamme produit & recrutement commercial" />
              </Field>
              <Field label={ui.projectDesc[lang]}>
                <textarea style={{ ...(touched && !form.projectDesc ? errorInputStyle : inputStyle), minHeight: "120px", resize: "vertical" }} value={form.projectDesc} onChange={e => set("projectDesc", e.target.value)} placeholder={ui.projectDescPH[lang]} />
              </Field>
              <div className="emerge-grid-2" style={gridStyle}>
                <Field label={ui.funding[lang]}>
                  <input style={touched && !form.fundingAmount ? errorInputStyle : inputStyle} value={form.fundingAmount} onChange={e => set("fundingAmount", e.target.value)} placeholder="1 000 000" />
                </Field>
                <Field label={ui.equity[lang]}>
                  <input style={touched && !form.equity ? errorInputStyle : inputStyle} type="number" value={form.equity} onChange={e => set("equity", e.target.value)} placeholder="18" min="1" max="49" />
                </Field>
              </div>
              <Field label={ui.useOfFunds[lang]}>
                <textarea style={{ ...(touched && !form.useOfFunds ? errorInputStyle : inputStyle), minHeight: "80px", resize: "vertical" }} value={form.useOfFunds} onChange={e => set("useOfFunds", e.target.value)} placeholder={ui.useOfFundsPH[lang]} />
              </Field>
              <Field label={ui.horizon[lang]}>
                <select style={touched && !form.horizon ? errorInputStyle : inputStyle} value={form.horizon} onChange={e => set("horizon", e.target.value)}>
                  <option value="">—</option>
                  <option value="3">3 {lang === "AR" ? "سنوات" : lang === "FR" ? "ans" : "years"}</option>
                  <option value="5">5 {lang === "AR" ? "سنوات" : lang === "FR" ? "ans" : "years"}</option>
                  <option value="7">7 {lang === "AR" ? "سنوات" : lang === "FR" ? "ans" : "years"}</option>
                  <option value="10">10 {lang === "AR" ? "سنوات" : lang === "FR" ? "ans" : "years"}</option>
                </select>
                <span style={{ fontSize: "0.7rem", color: "#8a96a3", marginTop: "4px", display: "block", lineHeight: 1.5 }}>{ui.horizonHint[lang]}</span>
              </Field>
            </div>
          </div>

          {/* SECTION 3 — Team */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>{ui.sec3[lang]}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="emerge-grid-2" style={gridStyle}>
                <Field label={ui.ceoName[lang]}>
                  <input style={touched && !form.ceoName ? errorInputStyle : inputStyle} value={form.ceoName} onChange={e => set("ceoName", e.target.value)} placeholder="Youssef Benali" />
                </Field>
                <Field label={ui.teamSize[lang]}>
                  <input style={inputStyle} type="number" value={form.teamSize} onChange={e => set("teamSize", e.target.value)} placeholder="3" min="1" />
                </Field>
              </div>
              <Field label={ui.ceoBackground[lang]}>
                <textarea style={{ ...(touched && !form.ceoBackground ? errorInputStyle : inputStyle), minHeight: "90px", resize: "vertical" }} value={form.ceoBackground} onChange={e => set("ceoBackground", e.target.value)} placeholder={ui.ceoBackPH[lang]} />
              </Field>
            </div>
          </div>

          {/* SECTION 4 — Financial structure */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>{ui.sec_fin[lang]}</div>
            <p style={{ fontSize: "0.78rem", color: "#6b7a8d", marginBottom: "1.1rem", lineHeight: 1.6, fontStyle: "italic" }}>{ui.sec_fin_note[lang]}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>{ui.usesDebt[lang]}</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {([["yes", ui.debtYes[lang]], ["no", ui.debtNo[lang]]] as [string,string][]).map(([val, lbl]) => (
                    <button key={val} onClick={() => set("usesDebt", val)}
                      style={{ flex: 1, padding: "0.7rem", borderRadius: "9px", border: `1.5px solid ${form.usesDebt === val ? "#2a4a7a" : touched && !form.usesDebt ? "#e05c5c" : "#e8ecf0"}`, background: form.usesDebt === val ? "linear-gradient(135deg,rgba(91,189,212,0.08),rgba(42,74,122,0.08))" : touched && !form.usesDebt ? "#fff8f8" : "#f8f9fb", cursor: "pointer", fontSize: "0.85rem", color: form.usesDebt === val ? "#0f1923" : "#4a5568", fontWeight: form.usesDebt === val ? 600 : 400, transition: "all 0.15s" }}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
               {form.usesDebt === "yes" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>{ui.interestQ[lang]}</label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {([["yes", ui.interestYes[lang]], ["no", ui.interestNo[lang]]] as [string,string][]).map(([val, lbl]) => (
                        <button key={val} onClick={() => set("hasInterestBearing", val)}
                          style={{ flex: 1, padding: "0.65rem", borderRadius: "9px", border: `1.5px solid ${form.hasInterestBearing === val ? "#2a4a7a" : "#e8ecf0"}`, background: form.hasInterestBearing === val ? "linear-gradient(135deg,rgba(91,189,212,0.08),rgba(42,74,122,0.08))" : "#f8f9fb", cursor: "pointer", fontSize: "0.85rem", color: form.hasInterestBearing === val ? "#0f1923" : "#4a5568", fontWeight: form.hasInterestBearing === val ? 600 : 400, transition: "all 0.15s" }}>
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                  {form.hasInterestBearing === "yes" && (
                    <div>
                      <label style={labelStyle}>{ui.debtRatioPctQ[lang]}</label>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        {([["low", ui.debtRange1[lang]], ["mid", ui.debtRange2[lang]], ["high", ui.debtRange3[lang]]] as [string,string][]).map(([val, lbl]) => (
                          <button key={val} onClick={() => set("debtRatioPct", val)}
                            style={{ flex: 1, padding: "0.65rem", borderRadius: "9px", border: `1.5px solid ${form.debtRatioPct === val ? "#2a4a7a" : "#e8ecf0"}`, background: form.debtRatioPct === val ? "linear-gradient(135deg,rgba(91,189,212,0.08),rgba(42,74,122,0.08))" : "#f8f9fb", cursor: "pointer", fontSize: "0.82rem", color: form.debtRatioPct === val ? "#0f1923" : "#4a5568", fontWeight: form.debtRatioPct === val ? 600 : 400, transition: "all 0.15s" }}>
                            {lbl}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* SECTION 5 — Impact & Employment */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>{ui.sec_impact[lang]}</div>
            <p style={{ fontSize: "0.78rem", color: "#6b7a8d", marginBottom: "1.1rem", lineHeight: 1.6, fontStyle: "italic" }}>{ui.sec_impact_note[lang]}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="emerge-grid-2" style={gridStyle}>
                <Field label={ui.femaleStaff[lang]}>
                  <input style={inputStyle} type="number" value={form.femaleStaffPct} onChange={e => set("femaleStaffPct", e.target.value)} placeholder="35" min="0" max="100" />
                </Field>
                <Field label={ui.youthStaffPct[lang]}>
                  <input style={inputStyle} type="number" value={form.youthStaffPct} onChange={e => set("youthStaffPct", e.target.value)} placeholder="28" min="0" max="100" />
                </Field>
              </div>
              <Field label={ui.impactDescQ[lang]}>
                <textarea style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} value={form.impactDesc} onChange={e => set("impactDesc", e.target.value)} placeholder={ui.impactDescPH[lang]} />
              </Field>
            </div>
          </div>

          {/* SECTION 6 — Documents */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>{ui.docsTitle[lang]}</div>
            <p style={{ fontSize: "0.78rem", color: "#6b7a8d", marginBottom: "1.1rem", lineHeight: 1.6, fontStyle: "italic" }}>{ui.docsNote[lang]}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1rem" }}>
              {([
                ["businessPlan", ui.docsBP[lang], "📄"],
                ["financials",   ui.docsFS[lang], "📊"],
                ["marketStudy",  ui.docsMS[lang], "🔍"],
                ["pitchDeck",    ui.docsPD[lang], "📑"],
                ["corporateDocs",ui.docsCD[lang], "🏛️"],
              ] as [string, string, string][]).map(([key, label, icon]) => {
                const uploaded = form.uploadedFiles[key];
                return (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.75rem 1rem", borderRadius: "9px", border: `1.5px solid ${uploaded ? "#2a7a4a" : "#e8ecf0"}`, background: uploaded ? "#edf7f0" : "#f8f9fb", transition: "all 0.2s" }}>
                    <span style={{ fontSize: "1rem", flexShrink: 0 }}>{icon}</span>
                    <span style={{ flex: 1, fontSize: "0.85rem", color: uploaded ? "#2a7a4a" : "#0f1923", fontWeight: uploaded ? 600 : 400 }}>
                      {label}
                      {uploaded && <span style={{ fontSize: "0.72rem", color: "#2a7a4a", marginLeft: "8px", fontStyle: "italic" }}>✓ {uploaded}</span>}
                    </span>
                    <label style={{ cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, color: uploaded ? "#2a7a4a" : "#2a4a7a", background: uploaded ? "#d4edda" : "#eaf6fb", padding: "4px 12px", borderRadius: "100px", border: `1px solid ${uploaded ? "#2a7a4a" : "#5bbdd4"}`, whiteSpace: "nowrap", transition: "all 0.15s" }}>
                      {uploaded ? ui.docsUploaded[lang] : ui.docsUpload[lang]}
                      <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" style={{ display: "none" }}
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) set("uploadedFiles", { ...form.uploadedFiles, [key]: file.name });
                        }} />
                    </label>
                  </div>
                );
              })}
            </div>

            {/* Extra documents */}
            <div style={{ borderTop: "1px solid #f0f2f5", paddingTop: "1rem" }}>
              {form.extraDocs.map((doc, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
                  <input style={{ ...inputStyle, flex: 1 }} value={doc.name} onChange={e => {
                    const updated = [...form.extraDocs];
                    updated[i] = { ...updated[i], name: e.target.value };
                    set("extraDocs", updated as any);
                  }} placeholder={ui.docsExtraName[lang]} />
                  <label style={{ cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, color: doc.filename ? "#2a7a4a" : "#2a4a7a", background: doc.filename ? "#d4edda" : "#eaf6fb", padding: "8px 12px", borderRadius: "8px", border: `1px solid ${doc.filename ? "#2a7a4a" : "#5bbdd4"}`, whiteSpace: "nowrap", flexShrink: 0 }}>
                    {doc.filename ? `✓ ${doc.filename.length > 12 ? doc.filename.substring(0,12)+"…" : doc.filename}` : ui.docsUpload[lang]}
                    <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" style={{ display: "none" }}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const updated = [...form.extraDocs];
                          updated[i] = { ...updated[i], filename: file.name };
                          set("extraDocs", updated as any);
                        }
                      }} />
                  </label>
                  <button onClick={() => set("extraDocs", form.extraDocs.filter((_, j) => j !== i) as any)}
                    style={{ background: "none", border: "none", color: "#8a96a3", cursor: "pointer", fontSize: "1rem", padding: "4px", flexShrink: 0 }}>✕</button>
                </div>
              ))}
              <button onClick={() => set("extraDocs", [...form.extraDocs, { name: "", filename: "" }] as any)}
                style={{ background: "none", border: "1.5px dashed #c0d0e0", borderRadius: "9px", color: "#2a4a7a", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, padding: "0.6rem 1rem", width: "100%", transition: "all 0.15s" }}>
                {ui.docsExtra[lang]}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button onClick={handleSubmit}
            style={{ width: "100%", background: requiredFilled ? "linear-gradient(135deg,#5bbdd4,#2a4a7a)" : "#c8d0d8", color: "#fff", border: "none", borderRadius: "12px", padding: "1rem", fontSize: "1rem", fontWeight: 700, cursor: requiredFilled ? "pointer" : "not-allowed", transition: "background 0.3s" }}>
            {ui.submit[lang]}
          </button>

          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#fff8e6", border: "1px solid #f0d090", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.72rem", color: "#7a6000", lineHeight: 1.6 }}>⚠️ {ui.disclaimer[lang]}</div>
          </div>
        </div>
      )}

      {stage === "score" && (
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 2rem 5rem" }}>
          {/* Score header */}
          <div style={{ background: "#fff", border: `2px solid ${overallBandCfg.color}`, borderRadius: "18px", padding: "2rem", marginBottom: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", color: overallBandCfg.color, textTransform: "uppercase", marginBottom: "0.5rem" }}>
              {ui.scoreTitle[lang]}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap", margin: "1.5rem 0" }}>
              {/* Ring */}
              <div style={{ position: "relative", width: "100px", height: "100px", flexShrink: 0 }}>
                <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#f0f2f5" strokeWidth="8" />
                  <circle cx="50" cy="50" r="44" fill="none" stroke={overallBandCfg.color} strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 44}`}
                    strokeDashoffset={`${2 * Math.PI * 44 * (1 - overall / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f1923", lineHeight: 1 }}>{overall}</span>
                  <span style={{ fontSize: "0.55rem", color: "#8a96a3", fontWeight: 600 }}>/100</span>
                </div>
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: overallBandCfg.color, background: overallBandCfg.bg, borderRadius: "100px", padding: "3px 12px", display: "inline-block", marginBottom: "0.4rem" }}>
                  {bandConfig[overallBand].label[lang as Lang]}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#6b7a8d", lineHeight: 1.6, maxWidth: "320px" }}>{ui.scoreNote[lang]}</div>
              </div>
            </div>
          </div>

          {/* Score bars */}
          <div ref={scoreRef} style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            {criteria.map(c => <ScoreBar key={c.key} c={c} lang={lang} visible={barsVisible} />)}
          </div>

          {/* Next steps */}
          <div style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0f1923", marginBottom: "1rem" }}>{ui.nextSteps[lang]}</div>
            {[ui.step1[lang], ui.step2[lang], ui.step3[lang]].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "0.75rem", alignItems: "flex-start" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg,#5bbdd4,#2a4a7a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#fff", fontSize: "0.7rem", fontWeight: 700 }}>{i + 1}</span>
                </div>
                <p style={{ fontSize: "0.84rem", color: "#4a5568", lineHeight: 1.65, margin: 0 }}>{s}</p>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div style={{ background: "#fff8e6", border: "1px solid #f0d090", borderRadius: "10px", padding: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.72rem", color: "#7a6000", lineHeight: 1.6 }}>⚠️ {ui.disclaimer[lang]}</div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexDirection: "column" }}>
            <Link href="/status" style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg,#5bbdd4,#2a4a7a)", color: "#fff", padding: "0.9rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none" }}>
              {lang === "FR" ? "Suivre mon dossier →" : lang === "AR" ? "متابعة ملفي ←" : "Track my file →"}
            </Link>
            <Link href="/" style={{ display: "block", textAlign: "center", background: "#f8f9fb", color: "#6b7a8d", padding: "0.75rem", borderRadius: "12px", fontWeight: 600, fontSize: "0.85rem", textDecoration: "none", border: "1px solid #e8ecf0" }}>
              {lang === "FR" ? "← Retour à l'accueil" : lang === "AR" ? "← العودة إلى الرئيسية" : "← Back to home"}
            </Link>
          </div>
        </div>
      )}

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
