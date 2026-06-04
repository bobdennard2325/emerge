"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { translations, Lang } from "../../translations";
import { useLanguage } from "../../LanguageContext";

type ScoreCriterion = {
  key: string;
  label: Record<Lang, string>;
  score: number;
  band: "low" | "medium" | "high" | "excellent";
  note: Record<Lang, string>;
};

type ProjectData = {
  id: string;
  tag: Record<Lang, string>;
  tagBg: string; tagColor: string; sectorBg: string;
  title: Record<Lang, string>;
  company: string;
  location: Record<Lang, string>;
  sharia: boolean;
  stage: Record<Lang, string>;
  raised: string; goal: string; pct: number; days: number; investors: number;
  minTicket: string; targetReturn: string;
  horizon: Record<Lang, string>;
  summary: Record<Lang, string>;
  overallScore: number;
  overallBand: "low" | "medium" | "high" | "excellent";
  verified: boolean;
  criteria: ScoreCriterion[];
  team: { name: string; role: Record<Lang, string>; initials: string; color: string }[];
  docs: { label: Record<Lang, string>; icon: string }[];
};

const projectData: ProjectData = {
  id: "solara",
  tag: { FR: "CLEANTECH", EN: "CLEANTECH", AR: "تكنولوجيا نظيفة" },
  tagBg: "#d8ecb8", tagColor: "#3b6d11", sectorBg: "#f0f5e8",
  title: {
    FR: "Solara — Énergie solaire abordable pour les PME",
    EN: "Solara — Affordable solar energy for SMEs",
    AR: "Solara — الطاقة الشمسية الميسورة للمؤسسات الصغيرة",
  },
  company: "Solara Energy S.A.",
  location: { FR: "Marrakech, Maroc", EN: "Marrakech, Morocco", AR: "مراكش، المغرب" },
  sharia: false,
  stage: { FR: "Amorçage", EN: "Seed", AR: "التأسيس" },
  raised: "450 000 MAD",
  goal: "1 000 000 MAD",
  pct: 45,
  days: 32,
  investors: 198,
  minTicket: "2 000 MAD",
  targetReturn: "2.8x",
  horizon: { FR: "7 ans", EN: "7 years", AR: "7 سنوات" },
  summary: {
    FR: "Solara propose aux PME marocaines des panneaux solaires en location-vente sans apport initial. Le modèle permet aux entreprises de réduire leur facture énergétique de 50% dès le premier mois, tout en devenant propriétaires de leur installation après 5 ans. 23 PME sont déjà équipées dans la région Marrakech-Safi.",
    EN: "Solara offers Moroccan SMEs lease-to-own solar panels with zero upfront cost. The model allows businesses to reduce their energy bill by 50% from the first month, while becoming owners of their installation after 5 years. 23 SMEs are already equipped in the Marrakech-Safi region.",
    AR: "تقدّم Solara للمؤسسات الصغيرة والمتوسطة المغربية ألواحاً شمسية بنظام الإيجار المنتهي بالتمليك دون أي دفعة أولى. يتيح النموذج للشركات تخفيض فاتورة الطاقة بنسبة 50% منذ الشهر الأول، مع امتلاك المنشأة بعد 5 سنوات. 23 مؤسسة مجهّزة بالفعل في جهة مراكش-آسفي.",
  },
  overallScore: 64,
  overallBand: "medium",
  verified: false,
  criteria: [
    {
      key: "maturity", score: 52, band: "medium",
      label: { FR: "Maturité", EN: "Maturity", AR: "النضج" },
      note: { FR: "23 clients PME actifs, phase d\'amorçage, revenus locatifs mensuels en croissance", EN: "23 active SME clients, seed stage, growing monthly lease revenue", AR: "23 عميل نشط، مرحلة التأسيس، إيرادات إيجارية شهرية في نمو" },
    },
    {
      key: "market", score: 78, band: "high",
      label: { FR: "Opportunité marché", EN: "Market opportunity", AR: "فرصة السوق" },
      note: { FR: "600 000 PME au Maroc, stratégie nationale solaire Noor, coûts de l\'énergie en hausse", EN: "600,000 SMEs in Morocco, Noor national solar strategy, rising energy costs", AR: "600,000 مؤسسة صغيرة ومتوسطة في المغرب، استراتيجية نور الشمسية الوطنية، ارتفاع تكاليف الطاقة" },
    },
    {
      key: "success", score: 61, band: "medium",
      label: { FR: "Chance de succès", EN: "Chance of success", AR: "احتمالية النجاح" },
      note: { FR: "Modèle validé mais dépendance au financement initial et aux partenaires installateurs", EN: "Validated model but dependency on initial financing and installer partners", AR: "نموذج مُتحقَّق منه لكن يعتمد على التمويل الأولي وشركاء التركيب" },
    },
    {
      key: "growth", score: 69, band: "high",
      label: { FR: "Probabilité de croissance", EN: "Growth probability", AR: "احتمالية النمو" },
      note: { FR: "Scalable avec capital, expansion vers Agadir et Fès prévue en 2026", EN: "Scalable with capital, expansion to Agadir and Fès planned for 2026", AR: "قابل للتوسع مع رأس المال، توسع نحو أكادير وفاس مخطط له في 2026" },
    },
    {
      key: "return", score: 58, band: "medium",
      label: { FR: "TRI / Multiple cible", EN: "Target IRR / multiple", AR: "معدل العائد المستهدف" },
      note: { FR: "Multiple 2.8x sur 7 ans, flux de trésorerie stables mais horizon long", EN: "2.8x multiple over 7 years, stable cash flows but long horizon", AR: "مضاعف 2.8x على 7 سنوات، تدفقات نقدية مستقرة لكن أفق زمني طويل" },
    },
    {
      key: "impact", score: 84, band: "excellent",
      label: { FR: "Impact & durabilité", EN: "Impact & sustainability", AR: "الأثر والاستدامة" },
      note: { FR: "Réduction CO2 estimée à 340 tonnes/an, aligné ODD 7 et 13, contribution directe à la transition énergétique", EN: "Estimated 340 tonnes CO2 reduction per year, aligned with SDGs 7 and 13, direct contribution to energy transition", AR: "تخفيض مقدّر بـ340 طن ثاني أكسيد الكربون سنوياً، متوافق مع هدفي التنمية 7 و13" },
    },
    {
      key: "sharia", score: 45, band: "medium",
      label: { FR: "Conformité Charia", EN: "Sharia compliance", AR: "الامتثال الشرعي" },
      note: { FR: "Activité permise mais structure de financement à revoir pour conformité complète", EN: "Permitted activity but financing structure to be reviewed for full compliance", AR: "النشاط مسموح به لكن هيكل التمويل يحتاج مراجعة للامتثال الكامل" },
    },
    {
      key: "social", score: 72, band: "high",
      label: { FR: "Bien-être social", EN: "Social welfare", AR: "الرفاه الاجتماعي" },
      note: { FR: "31 emplois directs et indirects, soutien aux artisans et PME locales, formation technique", EN: "31 direct and indirect jobs, support for local craftsmen and SMEs, technical training", AR: "31 وظيفة مباشرة وغير مباشرة، دعم الحرفيين والمؤسسات المحلية، تدريب تقني" },
    },
  ],
  team: [
    { name: "Rachid Bouazza", role: { FR: "CEO & Fondateur", EN: "CEO & Founder", AR: "الرئيس التنفيذي والمؤسس" }, initials: "RB", color: "#3b6d11" },
    { name: "Zineb Moussaoui", role: { FR: "Directrice Financière", EN: "Finance Director", AR: "المديرة المالية" }, initials: "ZM", color: "#5bbdd4" },
    { name: "Hamza El Ouafi", role: { FR: "Responsable Technique", EN: "Technical Manager", AR: "المسؤول التقني" }, initials: "HO", color: "#8a96a3" },
  ],
  docs: [
    { label: { FR: "Business Plan", EN: "Business Plan", AR: "خطة الأعمال" }, icon: "📄" },
    { label: { FR: "États Financiers", EN: "Financial Statements", AR: "القوائم المالية" }, icon: "📊" },
    { label: { FR: "Étude de Marché", EN: "Market Study", AR: "دراسة السوق" }, icon: "🔍" },
    { label: { FR: "Pitch Deck", EN: "Pitch Deck", AR: "عرض المشروع" }, icon: "📑" },
  ],
};

const flags: Record<Lang, string> = {
  FR: "/img/flag_fr.png",
  AR: "/img/flag_ar.png",
  EN: "/img/flag_en.png",
};

const bandConfig = {
  low:       { label: { FR: "Faible",    EN: "Low",       AR: "منخفض" }, color: "#e05c5c", bg: "#fdf0f0" },
  medium:    { label: { FR: "Moyen",     EN: "Medium",    AR: "متوسط" }, color: "#d4870a", bg: "#fdf5e8" },
  high:      { label: { FR: "Élevé",     EN: "High",      AR: "مرتفع" }, color: "#2a7a4a", bg: "#edf7f0" },
  excellent: { label: { FR: "Excellent", EN: "Excellent", AR: "ممتاز" }, color: "#185fa5", bg: "#eaf2fb" },
};

const bandToGradient = {
  low: "linear-gradient(90deg,#e05c5c,#e87a7a)",
  medium: "linear-gradient(90deg,#d4870a,#f0a832)",
  high: "linear-gradient(90deg,#2a7a4a,#5bbdd4)",
  excellent: "linear-gradient(90deg,#185fa5,#5bbdd4)",
};

function ScoreBar({ criterion, lang, visible }: { criterion: ScoreCriterion; lang: Lang; visible: boolean }) {
  const band = bandConfig[criterion.band];
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f1923" }}>{criterion.label[lang]}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: band.color, background: band.bg, padding: "2px 8px", borderRadius: "100px" }}>{band.label[lang]}</span>
          <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0f1923" }}>{criterion.score}</span>
        </div>
      </div>
      <div style={{ background: "#f0f2f5", borderRadius: "6px", height: "8px", overflow: "hidden" }}>
        <div style={{ width: visible ? `${criterion.score}%` : "0%", height: "8px", borderRadius: "6px", background: bandToGradient[criterion.band], transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
      <div style={{ fontSize: "0.72rem", color: "#8a96a3", marginTop: "0.25rem", lineHeight: 1.4 }}>{criterion.note[lang]}</div>
    </div>
  );
}

function PitchFilm({ lang }: { lang: Lang }) {
  const [playing, setPlaying] = useState(false);
  const labels = {
    play:     { FR: "Voir le pitch film",    EN: "Watch pitch film",     AR: "شاهد فيلم العرض" },
    duration: { FR: "2 min 32 sec",          EN: "2 min 32 sec",         AR: "دقيقتان و32 ثانية" },
    note:     { FR: "Film produit par l'entrepreneur avec les outils EMERGE", EN: "Film produced by the entrepreneur using EMERGE tools", AR: "فيلم أنتجه صاحب المشروع باستخدام أدوات EMERGE" },
  };
  return (
    <div style={{ position: "relative", borderRadius: "14px", overflow: "hidden", background: "#0f1923", aspectRatio: "16/9", cursor: "pointer" }} onClick={() => setPlaying(!playing)}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#1a2a0a 0%,#3a5a1a 40%,#2a4a10 70%,#1a2a0a 100%)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,rgba(91,189,212,0.04) 0px,transparent 1px,transparent 40px,rgba(91,189,212,0.04) 40px), repeating-linear-gradient(90deg,rgba(91,189,212,0.04) 0px,transparent 1px,transparent 40px,rgba(91,189,212,0.04) 40px)" }} />
      {!playing ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(91,189,212,0.2)", border: "2px solid rgba(91,189,212,0.6)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
            <div style={{ width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: "22px solid #5bbdd4", marginLeft: "4px" }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", marginBottom: "4px" }}>{labels.play[lang]}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>{labels.duration[lang]}</div>
          </div>
          <div style={{ position: "absolute", bottom: "12px", left: 0, right: 0, textAlign: "center" }}>
            <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>{labels.note[lang]}</span>
          </div>
          <div style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", borderRadius: "6px", padding: "4px 10px", fontSize: "0.68rem", color: "#5bbdd4", fontWeight: 700, letterSpacing: "0.06em" }}>
            🎬 PITCH FILM
          </div>
        </div>
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", fontStyle: "italic" }}>
            {lang === "AR" ? "▶ جارٍ التشغيل..." : lang === "FR" ? "▶ Lecture en cours..." : "▶ Playing..."}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectDetail() {
  const { lang, setLang } = useLanguage();
  const [investing, setInvesting] = useState(false);
  const [amount, setAmount] = useState("");
  const [barsVisible, setBarsVisible] = useState(false);
  const scoreRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];
  const p = projectData;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setBarsVisible(true);
    }, { threshold: 0.2 });
    if (scoreRef.current) observer.observe(scoreRef.current);
    return () => observer.disconnect();
  }, []);

  const ui = {
    back:         { FR: "← Retour aux campagnes",     EN: "← Back to campaigns",    AR: "← العودة إلى الحملات" },
    verified:     { FR: "EMERGE Vérifié",              EN: "EMERGE Verified",         AR: "موثّق من EMERGE" },
    sharia:       { FR: "Conforme Charia",             EN: "Sharia Compliant",        AR: "متوافق مع الشريعة" },
    raised:       { FR: "collectés",                   EN: "raised",                  AR: "جُمع" },
    of:           { FR: "sur",                         EN: "of",                      AR: "من" },
    investors:    { FR: "investisseurs",               EN: "investors",               AR: "مستثمر" },
    daysLeft:     { FR: "jours restants",              EN: "days left",               AR: "أيام متبقية" },
    minTicket:    { FR: "Ticket minimum",              EN: "Min. investment",         AR: "الحد الأدنى للاستثمار" },
    targetReturn: { FR: "Retour cible",                EN: "Target return",           AR: "العائد المستهدف" },
    invest:       { FR: "Investir maintenant",         EN: "Invest now",              AR: "استثمر الآن" },
    amountLabel:  { FR: "Montant à investir (MAD)",    EN: "Amount to invest (MAD)",  AR: "المبلغ المراد استثماره (د.م.)" },
    confirm:      { FR: "Confirmer l'investissement",  EN: "Confirm investment",      AR: "تأكيد الاستثمار" },
    cancel:       { FR: "Annuler",                     EN: "Cancel",                  AR: "إلغاء" },
    disclaimer:   { FR: "Ce n'est pas un conseil en investissement. Investir comporte des risques, dont la perte partielle ou totale du capital.", EN: "This is not investment advice. Investing involves risks, including partial or total loss of capital.", AR: "هذا ليس نصيحة استثمارية. الاستثمار ينطوي على مخاطر، بما فيها الخسارة الجزئية أو الكلية لرأس المال." },
    aiTitle:      { FR: "Analyse IA EMERGE",           EN: "EMERGE AI Analysis",      AR: "تحليل الذكاء الاصطناعي EMERGE" },
    aiSub:        { FR: "Évaluation multi-critères basée sur les documents soumis. Ce n'est pas une recommandation d'investissement.", EN: "Multi-criteria assessment based on submitted documents. This is not an investment recommendation.", AR: "تقييم متعدد المعايير بناءً على الوثائق المقدمة. هذا ليس توصية استثمارية." },
    overallLabel: { FR: "Score global",                EN: "Overall score",           AR: "النتيجة الإجمالية" },
    teamTitle:    { FR: "L'équipe",                    EN: "The team",                AR: "الفريق" },
    docsTitle:    { FR: "Documents disponibles",       EN: "Available documents",     AR: "الوثائق المتاحة" },
    docsNote:     { FR: "Connectez-vous pour accéder à la data room complète", EN: "Log in to access the full data room", AR: "سجّل دخولك للوصول إلى غرفة البيانات الكاملة" },
    aboutTitle:   { FR: "À propos du projet",          EN: "About the project",       AR: "حول المشروع" },
    filmTitle:    { FR: "Pitch Film",                  EN: "Pitch Film",              AR: "فيلم العرض" },
    warnTitle:    { FR: "Avertissement investisseur",  EN: "Investor warning",        AR: "تحذير للمستثمر" },
  };

  const overallBand = bandConfig[p.overallBand];

  return (
    <main dir={t.dir} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8f9fb", color: "#0f1923", fontSize: "15px", minHeight: "100vh" }}>
      <nav style={{ background: "#0f1923", padding: "0 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "68px", position: "sticky", top: 0, zIndex: 100 }}>
        <Image src="/img/logo_emerge_cropped.png" alt="Emerge Capital" width={70} height={38} style={{ objectFit: "contain", width: "auto", height: "auto" }} />
        <Link href="/" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", fontWeight: 500, textDecoration: "none" }}>{ui.back[lang]}</Link>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {(["FR", "AR", "EN"] as Lang[]).filter(l => l !== lang).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <img src={flags[l]} alt={l} width={32} height={22} style={{ borderRadius: "4px", display: "block" }} />
            </button>
          ))}
        </div>
      </nav>
      <div style={{ background: p.sectorBg, borderBottom: "1px solid #e8ecf0", padding: "2.5rem 3rem 0" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "1rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", padding: "3px 10px", borderRadius: "100px", background: p.tagBg, color: p.tagColor }}>{p.tag[lang]}</span>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "100px", background: "#0f1923", color: "#5bbdd4" }}>{p.stage[lang]}</span>
            {p.sharia && <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "100px", background: "#d4edda", color: "#155724" }}>☪ {ui.sharia[lang]}</span>}
            {p.verified && <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "100px", background: "#5bbdd4", color: "#fff" }}>✓ {ui.verified[lang]}</span>}
          </div>
          <h1 style={{ fontSize: "1.7rem", fontWeight: 800, color: "#0f1923", lineHeight: 1.2, marginBottom: "0.4rem", maxWidth: "700px" }}>{p.title[lang]}</h1>
          <div style={{ fontSize: "0.82rem", color: "#6b7a8d", marginBottom: "2rem" }}>{p.company} · {p.location[lang]}</div>
        </div>
      </div>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 3rem 4rem", display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "start" }}>
        <div>
          <section style={{ marginBottom: "2rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: "#8a96a3", marginBottom: "0.75rem", textTransform: "uppercase" }}>{ui.filmTitle[lang]}</div>
            <PitchFilm lang={lang} />
          </section>
          <section style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: "#8a96a3", marginBottom: "0.75rem", textTransform: "uppercase" }}>{ui.aboutTitle[lang]}</div>
            <p style={{ fontSize: "0.9rem", color: "#4a5568", lineHeight: 1.75, margin: 0 }}>{p.summary[lang]}</p>
          </section>
          <section ref={scoreRef} style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: "#8a96a3", textTransform: "uppercase", marginBottom: "4px" }}>{ui.aiTitle[lang]}</div>
                <p style={{ fontSize: "0.78rem", color: "#8a96a3", margin: 0, maxWidth: "340px", lineHeight: 1.5 }}>{ui.aiSub[lang]}</p>
              </div>
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: `conic-gradient(${overallBand.color} ${p.overallScore * 3.6}deg, #f0f2f5 0deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "62px", height: "62px", borderRadius: "50%", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f1923", lineHeight: 1 }}>{p.overallScore}</span>
                    <span style={{ fontSize: "0.55rem", color: "#8a96a3", fontWeight: 600 }}>/100</span>
                  </div>
                </div>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: overallBand.color, marginTop: "6px", background: overallBand.bg, borderRadius: "100px", padding: "2px 8px" }}>{overallBand.label[lang]}</div>
                <div style={{ fontSize: "0.65rem", color: "#8a96a3", marginTop: "2px" }}>{ui.overallLabel[lang]}</div>
              </div>
            </div>
            <div>{p.criteria.map(c => <ScoreBar key={c.key} criterion={c} lang={lang} visible={barsVisible} />)}</div>
          </section>
          <section style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: "#8a96a3", marginBottom: "1rem", textTransform: "uppercase" }}>{ui.teamTitle[lang]}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {p.team.map(m => (
                <div key={m.name} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.75rem", flexShrink: 0 }}>{m.initials}</div>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f1923" }}>{m.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7a8d" }}>{m.role[lang]}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: "#8a96a3", marginBottom: "0.5rem", textTransform: "uppercase" }}>{ui.docsTitle[lang]}</div>
            <div style={{ fontSize: "0.75rem", color: "#8a96a3", marginBottom: "1rem", fontStyle: "italic" }}>{ui.docsNote[lang]}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {p.docs.map(doc => (
                <div key={doc.label.EN} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "8px", border: "1px solid #e8ecf0", fontSize: "0.78rem", color: "#4a5568", background: "#f8f9fb", cursor: "not-allowed", opacity: 0.7 }}>
                  {doc.icon} {doc.label[lang]} <span style={{ color: "#aaa", marginLeft: "2px" }}>🔒</span>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div style={{ position: "sticky", top: "84px" }}>
          <div style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "1.5rem", marginBottom: "1rem" }}>
            <div style={{ background: "#f0f2f5", borderRadius: "6px", height: "8px", marginBottom: "0.75rem" }}>
              <div style={{ width: `${p.pct}%`, height: "8px", borderRadius: "6px", background: "linear-gradient(90deg,#5bbdd4,#2a4a7a)" }} />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f1923" }}>{p.raised}</div>
              <div style={{ fontSize: "0.78rem", color: "#6b7a8d" }}>{p.pct}% {ui.raised[lang]} · {ui.of[lang]} {p.goal}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
              {[
                { value: p.investors.toString(), label: ui.investors[lang] },
                { value: p.days.toString(), label: ui.daysLeft[lang] },
                { value: p.minTicket, label: ui.minTicket[lang] },
                { value: p.targetReturn, label: ui.targetReturn[lang] },
              ].map(s => (
                <div key={s.label} style={{ background: "#f8f9fb", borderRadius: "8px", padding: "0.6rem 0.75rem" }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0f1923" }}>{s.value}</div>
                  <div style={{ fontSize: "0.68rem", color: "#8a96a3", fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {!investing ? (
              <button onClick={() => setInvesting(true)} style={{ width: "100%", background: "linear-gradient(135deg,#5bbdd4,#2a4a7a)", color: "#fff", border: "none", borderRadius: "10px", padding: "0.9rem", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer" }}>{ui.invest[lang]}</button>
            ) : (
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#4a5568", display: "block", marginBottom: "0.4rem" }}>{ui.amountLabel[lang]}</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="2000" style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: "1.5px solid #5bbdd4", fontSize: "0.95rem", fontWeight: 600, outline: "none", boxSizing: "border-box", marginBottom: "0.6rem", color: "#0f1923" }} />
                <button style={{ width: "100%", background: "linear-gradient(135deg,#5bbdd4,#2a4a7a)", color: "#fff", border: "none", borderRadius: "10px", padding: "0.75rem", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", marginBottom: "0.4rem" }}>{ui.confirm[lang]}</button>
                <button onClick={() => setInvesting(false)} style={{ width: "100%", background: "none", color: "#6b7a8d", border: "1px solid #e8ecf0", borderRadius: "10px", padding: "0.6rem", fontSize: "0.82rem", cursor: "pointer" }}>{ui.cancel[lang]}</button>
              </div>
            )}
          </div>
          <div style={{ background: "#fff8e6", border: "1px solid #f0d090", borderRadius: "10px", padding: "1rem" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8a6a00", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>⚠ {ui.warnTitle[lang]}</div>
            <div style={{ fontSize: "0.72rem", color: "#7a6000", lineHeight: 1.55 }}>{ui.disclaimer[lang]}</div>
          </div>
        </div>
      </div>
      <footer style={{ background: "#0f1923", color: "#8a96a3", textAlign: "center", padding: "1.5rem", fontSize: "0.78rem" }}>
        © 2026 Emerge Capital · Casablanca, Maroc ·{" "}
        <a href="#" style={{ color: "#5bbdd4", textDecoration: "none" }}>{t.footer.legal}</a> ·{" "}
        <a href="#" style={{ color: "#5bbdd4", textDecoration: "none" }}>{t.footer.privacy}</a>
      </footer>
    </main>
  );
}
