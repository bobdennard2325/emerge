/**
 * EMERGE Capital — Prototype v1.8
 * ─────────────────────────────────────────────────────────────
 * File        : emerge/src/app/how-it-works/page.tsx
 * Route       : /how-it-works
 * Description : How it works — investor & entrepreneur journey tabs
 * Project     : Morocco's first AI-powered equity crowdfunding platform
 * Operator    : OVERSEE (AMMC-licensed investment bank)
 * Author      : EMERGE Capital / OVERSEE
 * Created     : June 2026
 * Stack       : Next.js 16 · TypeScript · React · Trilingual FR/EN/AR
 * ─────────────────────────────────────────────────────────────
 */
"use client";
import { useState } from "react";
import Link from "next/link";
import { translations } from "../translations";
import { useLanguage } from "../LanguageContext";

// ─── Content ──────────────────────────────────────────────────────────────────

const investorSteps = [
  {
    number: "01",
    icon: "👤",
    title: { FR: "Créez votre profil", EN: "Create your profile", AR: "أنشئ ملفك الشخصي" },
    desc: { FR: "Inscrivez-vous gratuitement et répondez à un questionnaire rapide. La plateforme identifie votre profil de risque et vos préférences sectorielles pour vous proposer les opportunités les plus adaptées.", EN: "Sign up for free and complete a short questionnaire. The platform identifies your risk profile and sector preferences to surface the most relevant opportunities for you.", AR: "سجّل مجاناً وأجب على استبيان قصير. تحدد المنصة ملف مخاطرك وتفضيلاتك القطاعية لتقترح عليك أنسب الفرص." },
  },
  {
    number: "02",
    icon: "🔍",
    title: { FR: "Explorez les projets", EN: "Explore projects", AR: "استكشف المشاريع" },
    desc: { FR: "Parcourez les campagnes en cours, filtrées par secteur, stade de maturité et conformité Charia. Chaque projet est accompagné d'une analyse IA multi-critères et d'un pitch film réalisé par l'entrepreneur.", EN: "Browse live campaigns filtered by sector, maturity stage and Sharia compliance. Every project includes an AI multi-criteria analysis and a pitch film produced by the entrepreneur.", AR: "تصفح الحملات الجارية مصنّفةً حسب القطاع ومرحلة النضج والامتثال الشرعي. يتضمن كل مشروع تحليلاً بالذكاء الاصطناعي وفيلم عرض من إنتاج صاحب المشروع." },
  },
  {
    number: "03",
    icon: "📊",
    title: { FR: "Évaluez en confiance", EN: "Evaluate with confidence", AR: "قيّم بثقة" },
    desc: { FR: "Consultez le score EMERGE — une évaluation impartiale basée sur les états financiers, le plan d'affaires, les documents d'immatriculation et les données publiques disponibles en ligne. Nos algorithmes d'IA analysent ces éléments selon huit critères : maturité, opportunité de marché, chance de succès, potentiel de rendement, conformité Charia et impact social. Chaque dossier fait également l'objet de vérifications humaines, incluant un échange entre nos analystes financiers et l'équipe du projet. Ce n'est pas un conseil en investissement, mais un résumé de due diligence.", EN: "Review the EMERGE score — an impartial assessment built on financial statements, the business plan, registration documents and publicly available data. Our AI algorithms analyse these across eight criteria: maturity, market opportunity, chance of success, return potential, Sharia compliance and social impact. Every file also undergoes human checks, including a direct exchange between our financial analysts and the project team. Not investment advice, but a rigorous due-diligence summary.", AR: "راجع نقاط EMERGE — تقييم موضوعي مبني على القوائم المالية وخطة الأعمال ووثائق التسجيل والبيانات المتاحة للعموم على الإنترنت. تحلّل خوارزميات الذكاء الاصطناعي لدينا هذه العناصر وفق ثمانية معايير: النضج وفرصة السوق واحتمالية النجاح وإمكانية العائد والامتثال الشرعي والأثر الاجتماعي. يخضع كل ملف أيضاً لمراجعات بشرية تشمل تواصلاً مباشراً بين محللينا الماليين وفريق المشروع. ليست توصية استثمارية، بل ملخص عناية واجبة." },
  },
  {
    number: "04",
    icon: "💰",
    title: { FR: "Investissez", EN: "Invest", AR: "استثمر" },
    desc: { FR: "Choisissez votre montant à partir du ticket minimum affiché, transférez vos fonds en toute sécurité et devenez actionnaire. La plateforme gère la documentation juridique et l'inscription au registre des associés.", EN: "Choose your amount from the displayed minimum ticket, transfer your funds securely and become a shareholder. The platform handles the legal documentation and entry in the shareholder register.", AR: "اختر مبلغك انطلاقاً من الحد الأدنى للاستثمار المعروض، حوّل أموالك بأمان وأصبح مساهماً. تتولى المنصة التوثيق القانوني والتسجيل في سجل المساهمين." },
  },
  {
    number: "05",
    icon: "📈",
    title: { FR: "Suivez vos investissements", EN: "Track your investments", AR: "تابع استثماراتك" },
    desc: { FR: "Recevez des rapports périodiques des entreprises dans lesquelles vous avez investi. En cas de cession ou d'exit, la plateforme vous accompagne dans la réalisation de votre plus-value.", EN: "Receive periodic reports from the companies you have invested in. In the event of a sale or exit, the platform supports you in realising your return.", AR: "استلم تقارير دورية من الشركات التي استثمرت فيها. في حالة بيع أو خروج، ترافقك المنصة في تحقيق عائدك." },
  },
];

const entrepreneurSteps = [
  {
    number: "01",
    icon: "📋",
    title: { FR: "Soumettez votre dossier", EN: "Submit your file", AR: "قدّم ملفك" },
    desc: { FR: "Inscrivez-vous gratuitement et complétez le formulaire de soumission. Téléchargez vos documents : plan d'affaires, états financiers, étude de marché et pitch deck. La soumission est entièrement gratuite.", EN: "Sign up for free and complete the submission form. Upload your documents: business plan, financial statements, market study and pitch deck. Submission is entirely free.", AR: "سجّل مجاناً وأكمل نموذج التقديم. ارفع وثائقك: خطة الأعمال والقوائم المالية ودراسة السوق وعرض المشروع. التقديم مجاني تماماً." },
  },
  {
    number: "02",
    icon: "🤖",
    title: { FR: "Recevez votre score IA", EN: "Receive your AI score", AR: "احصل على نقاط الذكاء الاصطناعي" },
    desc: { FR: "Nos algorithmes analysent votre dossier selon huit critères : maturité, opportunité de marché, chance de succès, TRI cible, impact, durabilité, conformité Charia et bien-être social. Vous voyez votre score et pouvez enrichir votre dossier pour l'améliorer.", EN: "Our algorithms analyse your file across eight criteria: maturity, market opportunity, chance of success, target IRR, impact, sustainability, Sharia compliance and social welfare. You see your score and can enrich your file to improve it.", AR: "تحلّل خوارزمياتنا ملفك وفق ثمانية معايير: النضج وفرصة السوق واحتمالية النجاح ومعدل العائد المستهدف والأثر والاستدامة والامتثال الشرعي والرفاه الاجتماعي. ترى نقاطك ويمكنك إثراء ملفك لتحسينها." },
  },
  {
    number: "03",
    icon: "🎬",
    title: { FR: "Créez votre pitch film", EN: "Create your pitch film", AR: "أنشئ فيلم عرضك" },
    desc: { FR: "Utilisez les outils fournis par la plateforme — scripts assistés par IA, storyboard, voix off et templates — pour produire un court film de pitch. C'est votre film, vous en êtes l'auteur et vous en assumez la responsabilité. EMERGE vérifie son exactitude avant publication.", EN: "Use the platform's provided tools — AI-assisted scripts, storyboard, voiceover and templates — to produce a short pitch film. It is your film; you author it and own it. EMERGE verifies its accuracy before publication.", AR: "استخدم الأدوات التي توفرها المنصة — سيناريوهات بمساعدة الذكاء الاصطناعي ولوحة القصة والتعليق الصوتي والقوالب — لإنتاج فيلم عرض قصير. إنه فيلمك أنت مؤلفه ومسؤول عنه. تتحقق EMERGE من دقته قبل النشر." },
  },
  {
    number: "04",
    icon: "🚀",
    title: { FR: "Lancez votre campagne", EN: "Launch your campaign", AR: "أطلق حملتك" },
    desc: { FR: "Une fois votre dossier validé, votre campagne est mise en ligne. Les investisseurs peuvent parcourir votre projet, consulter votre score et regarder votre film. La plateforme gère les souscriptions et la collecte des fonds.", EN: "Once your file is validated, your campaign goes live. Investors can browse your project, review your score and watch your film. The platform manages subscriptions and fund collection.", AR: "بمجرد التحقق من ملفك، تنطلق حملتك. يمكن للمستثمرين تصفح مشروعك ومراجعة نقاطك ومشاهدة فيلمك. تتولى المنصة إدارة الاكتتابات وتحصيل الأموال." },
  },
  {
    number: "05",
    icon: "✅",
    title: { FR: "Recevez les fonds & reportez", EN: "Receive funds & report", AR: "استلم الأموال وأعدّ التقارير" },
    desc: { FR: "En cas de succès, EMERGE retient une commission sur les fonds levés. Vous recevez le solde et vous engagez à soumettre des rapports périodiques à vos investisseurs. La transparence est une condition pour accéder à de futures levées sur la plateforme.", EN: "On success, EMERGE retains a commission on the funds raised. You receive the balance and commit to submitting periodic reports to your investors. Transparency is a condition for accessing future raises on the platform.", AR: "عند النجاح، تحتجز EMERGE عمولة على الأموال المجمعة. تستلم الرصيد وتلتزم بتقديم تقارير دورية لمستثمريك. الشفافية شرط للوصول إلى جولات تمويل مستقبلية على المنصة." },
  },
];

const faqItems = [
  {
    q: { FR: "Qui peut investir sur EMERGE ?", EN: "Who can invest on EMERGE?", AR: "من يمكنه الاستثمار على EMERGE؟" },
    a: { FR: "Toute personne physique résidant au Maroc ou à l'étranger, sous réserve de compléter le questionnaire de profil investisseur et d'accepter les conditions d'utilisation.", EN: "Any individual residing in Morocco or abroad, subject to completing the investor profile questionnaire and accepting the terms of use.", AR: "أي شخص طبيعي مقيم في المغرب أو خارجه، شريطة استكمال استبيان الملف الاستثماري وقبول شروط الاستخدام." },
  },
  {
    q: { FR: "Quel est le montant minimum pour investir ?", EN: "What is the minimum investment amount?", AR: "ما الحد الأدنى للاستثمار؟" },
    a: { FR: "Le ticket minimum varie selon les projets et est affiché clairement sur chaque fiche projet. Il est conçu pour rendre l'investissement accessible au plus grand nombre.", EN: "The minimum ticket varies by project and is clearly displayed on each project page. It is designed to make investing accessible to as many people as possible.", AR: "يتفاوت الحد الأدنى للاستثمار حسب المشروع ويُعرض بوضوح على كل صفحة مشروع. وهو مصمم لجعل الاستثمار في متناول أكبر عدد ممكن من الناس." },
  },
  {
    q: { FR: "La plateforme est-elle régulée ?", EN: "Is the platform regulated?", AR: "هل المنصة خاضعة للرقابة؟" },
    a: { FR: "EMERGE opère sous le cadre réglementaire du financement participatif en capital défini par l'Autorité Marocaine du Marché des Capitaux (AMMC). Tous les projets publiés ont été soumis à un processus de vérification.", EN: "EMERGE operates under the equity crowdfunding regulatory framework defined by the Moroccan Capital Markets Authority (AMMC). All published projects have gone through a verification process.", AR: "تعمل EMERGE في إطار تنظيم التمويل الجماعي بالأسهم الذي تحدده هيئة مسالك رأس المال المغربية (AMMC). جميع المشاريع المنشورة خضعت لعملية تحقق." },
  },
  {
    q: { FR: "Le score IA est-il un conseil en investissement ?", EN: "Is the AI score investment advice?", AR: "هل نقاط الذكاء الاصطناعي توصية استثمارية؟" },
    a: { FR: "Non. Le score EMERGE est un résumé de due diligence présenté à titre indicatif. Il n'est pas une recommandation d'investir ou de ne pas investir. Tout investissement comporte des risques, y compris la perte partielle ou totale du capital.", EN: "No. The EMERGE score is a due-diligence summary presented on an indicative basis. It is not a recommendation to invest or not to invest. All investments involve risks, including partial or total loss of capital.", AR: "لا. نقاط EMERGE ملخص عناية واجبة يُقدَّم على أساس إرشادي. وهو ليس توصية بالاستثمار أو عدمه. جميع الاستثمارات تنطوي على مخاطر، بما فيها الخسارة الجزئية أو الكلية لرأس المال." },
  },
];

// ─── UI labels ────────────────────────────────────────────────────────────────
const ui = {
  back:          { FR: "← Retour à l'accueil",         EN: "← Back to home",              AR: "← العودة إلى الرئيسية" },
  badge:         { FR: "Comment ça marche",             EN: "How it works",                 AR: "كيف يعمل" },
  title:         { FR: "Simple, transparent, accessible", EN: "Simple, transparent, accessible", AR: "بسيط وشفاف وفي متناول الجميع" },
  subtitle:      { FR: "EMERGE connecte les entreprises marocaines en croissance avec des investisseurs avisés. Voici comment la plateforme fonctionne pour chacun.", EN: "EMERGE connects Moroccan growth companies with smart investors. Here is how the platform works for each of you.", AR: "تربط EMERGE شركات النمو المغربية بالمستثمرين الأذكياء. إليك كيفية عمل المنصة لكل طرف." },
  investorTab:   { FR: "Je suis investisseur",          EN: "I am an investor",             AR: "أنا مستثمر" },
  entrepreneurTab:{ FR: "Je suis entrepreneur",         EN: "I am an entrepreneur",         AR: "أنا رياديّ" },
  investorCta:   { FR: "Créer mon profil investisseur", EN: "Create my investor profile",   AR: "إنشاء ملفي الاستثماري" },
  entrepreneurCta:{ FR: "Soumettre mon projet",         EN: "Submit my project",            AR: "تقديم مشروعي" },
  browseCta:     { FR: "Voir les campagnes",            EN: "Browse campaigns",             AR: "تصفح الحملات" },
  faqTitle:      { FR: "Questions fréquentes",          EN: "Frequently asked questions",   AR: "الأسئلة الشائعة" },
  regulated:     { FR: "Régulé par l'AMMC",             EN: "Regulated by AMMC",            AR: "خاضع لرقابة AMMC" },
  secured:       { FR: "Fonds sécurisés",               EN: "Secured funds",                AR: "أموال مؤمّنة" },
  verified:      { FR: "Projets vérifiés",              EN: "Verified projects",            AR: "مشاريع موثّقة" },
  transparent:   { FR: "Rapports transparents",         EN: "Transparent reporting",        AR: "تقارير شفافة" },
};

// ─── Step card ────────────────────────────────────────────────────────────────
function StepCard({ step, accent }: { step: typeof investorSteps[0]; index: number; accent: string }) {
  const { lang } = useLanguage();
  return (
    <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", padding: "1.5rem", background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", marginBottom: "1rem" }}>
      <div style={{ flexShrink: 0, width: "48px", height: "48px", borderRadius: "12px", background: `linear-gradient(135deg, ${accent}22, ${accent}44)`, border: `1.5px solid ${accent}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>
        {step.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.4rem" }}>
          <span style={{ fontSize: "0.65rem", fontWeight: 800, color: accent, letterSpacing: "0.1em" }}>{step.number}</span>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f1923", margin: 0 }}>{step.title[lang]}</h3>
        </div>
        <p style={{ fontSize: "0.84rem", color: "#6b7a8d", lineHeight: 1.7, margin: 0 }}>{step.desc[lang]}</p>
      </div>
    </div>
  );
}

// ─── FAQ item ────────────────────────────────────────────────────────────────
function FaqItem({ item }: { item: typeof faqItems[0] }) {
  const { lang } = useLanguage();
  return (
    <div style={{ borderBottom: "1px solid #e8ecf0", padding: "1.25rem 0" }}>
      <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f1923", marginBottom: "0.5rem" }}>
        {item.q[lang]}
      </div>
      <p style={{ fontSize: "0.84rem", color: "#6b7a8d", lineHeight: 1.7, margin: 0 }}>{item.a[lang]}</p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function HowItWorks() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<"investor" | "entrepreneur">("investor");

  const flags: Record<string, string> = {
    FR: "/img/flag_fr.png", AR: "/img/flag_ar.png", EN: "/img/flag_en.png",
  };

  const steps = activeTab === "investor" ? investorSteps : entrepreneurSteps;
  const accent = activeTab === "investor" ? "#2a4a7a" : "#0f6e56";

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
            { label: lang === "FR" ? "Confiance & Sécurité" : lang === "AR" ? "الثقة والأمان" : "Trust & Safety", href: "/trust" },
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

      {/* HERO */}
      <section style={{ background: "#fff", borderBottom: "1px solid #e8ecf0", padding: "4rem 3rem 3rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eaf6fb", color: "#2a6a8a", padding: "0.4rem 1rem", borderRadius: "100px", fontSize: "0.78rem", fontWeight: 600, marginBottom: "1.5rem", border: "1px solid #c0e4f0" }}>
          <span style={{ width: "7px", height: "7px", background: "#5bbdd4", borderRadius: "50%", display: "inline-block" }} />
          {ui.badge[lang]}
        </div>
        <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "#0f1923", marginBottom: "1rem", lineHeight: 1.15 }}>
          {ui.title[lang]}
        </h1>
        <p style={{ fontSize: "1rem", color: "#6b7a8d", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto 2.5rem" }}>
          {ui.subtitle[lang]}
        </p>

        {/* Audience toggle */}
        <div style={{ display: "inline-flex", background: "#f0f2f5", borderRadius: "12px", padding: "4px", gap: "4px" }}>
          {(["investor", "entrepreneur"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: "0.6rem 1.5rem", borderRadius: "9px", border: "none", cursor: "pointer", fontSize: "0.88rem", fontWeight: 600, transition: "all 0.2s", background: activeTab === tab ? "#fff" : "transparent", color: activeTab === tab ? "#0f1923" : "#6b7a8d", boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
              {tab === "investor" ? ui.investorTab[lang] : ui.entrepreneurTab[lang]}
            </button>
          ))}
        </div>
      </section>

      {/* STEPS */}
      <section style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 2rem" }}>
        {steps.map((step, i) => (
          <StepCard key={step.number} step={step} index={i} accent={accent} />
        ))}

        {/* CTA */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
          {activeTab === "investor" ? (
            <>
              <Link href="/investor" style={{ background: "linear-gradient(135deg,#5bbdd4,#2a4a7a)", color: "#fff", padding: "0.85rem 2.2rem", borderRadius: "10px", fontSize: "0.95rem", fontWeight: 700, textDecoration: "none" }}>
                {ui.investorCta[lang]}
              </Link>
              <Link href="/" style={{ border: "1.5px solid #2a4a7a", color: "#2a4a7a", padding: "0.85rem 2rem", borderRadius: "10px", fontSize: "0.95rem", fontWeight: 600, textDecoration: "none" }}>
                {ui.browseCta[lang]}
              </Link>
            </>
          ) : (
            <Link href="/submit" style={{ background: "linear-gradient(135deg,#5bbdd4,#0f6e56)", color: "#fff", padding: "0.85rem 2.2rem", borderRadius: "10px", fontSize: "0.95rem", fontWeight: 700, textDecoration: "none" }}>
              {ui.entrepreneurCta[lang]}
            </Link>
          )}
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{ background: "#fff", borderTop: "1px solid #e8ecf0", borderBottom: "1px solid #e8ecf0", padding: "2rem 3rem", display: "flex", justifyContent: "center", gap: "2.5rem", alignItems: "center", flexWrap: "wrap" }}>
        {[
          { icon: "🏛️", label: ui.regulated[lang] },
          { icon: "🔒", label: ui.secured[lang] },
          { icon: "✅", label: ui.verified[lang] },
          { icon: "📊", label: ui.transparent[lang] },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "#4a5568", fontWeight: 500 }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#eaf6fb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>{item.icon}</div>
            {item.label}
          </div>
        ))}
      </div>

      {/* FAQ */}
      <section style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 2rem 4rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f1923", marginBottom: "0.25rem" }}>{ui.faqTitle[lang]}</h2>
        <div style={{ height: "3px", width: "40px", background: "linear-gradient(90deg,#5bbdd4,#2a4a7a)", borderRadius: "2px", marginBottom: "1.5rem" }} />
        {faqItems.map((item, i) => <FaqItem key={i} item={item} />)}
      </section>

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
