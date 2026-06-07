/**
 * EMERGE Capital — Prototype v1.8
 * ─────────────────────────────────────────────────────────────
 * File        : emerge/src/app/privacy/page.tsx
 * Route       : /privacy
 * Description : Privacy policy — aligned with loi 09-08
 * Project     : Morocco's first AI-powered equity crowdfunding platform
 * Operator    : OVERSEE (AMMC-licensed investment bank)
 * Author      : EMERGE Capital / OVERSEE
 * Created     : June 2026
 * Stack       : Next.js 16 · TypeScript · React · Trilingual FR/EN/AR
 * ─────────────────────────────────────────────────────────────
 */
"use client";
import Link from "next/link";
import { translations } from "../translations";
import { useLanguage } from "../LanguageContext";

const sections = [
  {
    id: "controller",
    title: { FR: "Responsable du traitement", EN: "Data controller", AR: "المتحكم في البيانات" },
    content: {
      FR: `Les données personnelles collectées sur la plateforme EMERGE sont traitées par OVERSEE, en sa qualité de responsable du traitement au sens de la loi marocaine n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel.\n\nContact DPO : privacy@emerge.ma`,
      EN: `Personal data collected on the EMERGE platform is processed by OVERSEE, as data controller within the meaning of Moroccan Law No. 09-08 on the protection of individuals with regard to the processing of personal data.\n\nDPO contact: privacy@emerge.ma`,
      AR: `تُعالَج البيانات الشخصية المجمعة على منصة EMERGE من قِبل OVERSEE، بوصفها المتحكم في البيانات بمعنى القانون المغربي رقم 09-08 المتعلق بحماية الأشخاص الطبيعيين فيما يتعلق بمعالجة البيانات الشخصية.\n\nالتواصل مع مسؤول حماية البيانات: privacy@emerge.ma`,
    },
  },
  {
    id: "data-collected",
    title: { FR: "Données collectées", EN: "Data collected", AR: "البيانات المجمعة" },
    content: {
      FR: `EMERGE collecte les données personnelles suivantes :\n\n• Données d'identité : nom, prénom, adresse email, numéro de téléphone\n• Données KYC (investisseurs) : pièce d'identité, justificatif de domicile, situation financière déclarée\n• Données de profil : préférences d'investissement, tolérance au risque, historique d'investissement\n• Données techniques : adresse IP, données de navigation, cookies de session\n• Données soumises par les porteurs de projets : documents d'entreprise, états financiers, informations sur l'équipe`,
      EN: `EMERGE collects the following personal data:\n\n• Identity data: surname, first name, email address, phone number\n• KYC data (investors): identity document, proof of address, declared financial situation\n• Profile data: investment preferences, risk tolerance, investment history\n• Technical data: IP address, browsing data, session cookies\n• Data submitted by project owners: company documents, financial statements, team information`,
      AR: `تجمع EMERGE البيانات الشخصية التالية:\n\n• بيانات الهوية: الاسم الأخير، الاسم الأول، البريد الإلكتروني، رقم الهاتف\n• بيانات KYC (المستثمرون): وثيقة هوية، إثبات عنوان، الوضع المالي المُعلن\n• بيانات الملف: تفضيلات الاستثمار، تحمّل المخاطر، تاريخ الاستثمار\n• البيانات التقنية: عنوان IP، بيانات التصفح، ملفات تعريف الارتباط\n• البيانات المُقدَّمة من أصحاب المشاريع: وثائق الشركة، القوائم المالية، معلومات الفريق`,
    },
  },
  {
    id: "purpose",
    title: { FR: "Finalités du traitement", EN: "Purposes of processing", AR: "أغراض المعالجة" },
    content: {
      FR: `Les données sont traitées pour les finalités suivantes :\n\n• Gestion du compte utilisateur et authentification\n• Vérification d'identité (KYC) conformément aux obligations réglementaires\n• Profilage du risque investisseur et recommandation d'opportunités\n• Traitement des transactions d'investissement\n• Communication des rapports périodiques aux investisseurs\n• Amélioration des algorithmes de scoring et de la plateforme\n• Respect des obligations légales et réglementaires (LCB-FT, AMMC)`,
      EN: `Data is processed for the following purposes:\n\n• User account management and authentication\n• Identity verification (KYC) in accordance with regulatory obligations\n• Investor risk profiling and opportunity recommendations\n• Processing of investment transactions\n• Communication of periodic reports to investors\n• Improvement of scoring algorithms and the platform\n• Compliance with legal and regulatory obligations (AML/CFT, AMMC)`,
      AR: `تُعالَج البيانات للأغراض التالية:\n\n• إدارة حساب المستخدم والمصادقة\n• التحقق من الهوية (KYC) وفقاً للالتزامات التنظيمية\n• تحديد ملف مخاطر المستثمر وتوصية الفرص\n• معالجة معاملات الاستثمار\n• إبلاغ التقارير الدورية للمستثمرين\n• تحسين خوارزميات التقييم والمنصة\n• الامتثال للالتزامات القانونية والتنظيمية (مكافحة غسل الأموال، AMMC)`,
    },
  },
  {
    id: "retention",
    title: { FR: "Durée de conservation", EN: "Data retention", AR: "مدة الاحتفاظ بالبيانات" },
    content: {
      FR: `Les données sont conservées pour les durées suivantes :\n\n• Données de compte : durée de la relation contractuelle + 5 ans\n• Données KYC : 5 ans après la fin de la relation commerciale (obligation réglementaire)\n• Données de transaction : 10 ans (obligations comptables et réglementaires)\n• Données techniques : 13 mois maximum`,
      EN: `Data is retained for the following periods:\n\n• Account data: duration of the contractual relationship + 5 years\n• KYC data: 5 years after the end of the commercial relationship (regulatory obligation)\n• Transaction data: 10 years (accounting and regulatory obligations)\n• Technical data: maximum 13 months`,
      AR: `تُحتجز البيانات للفترات التالية:\n\n• بيانات الحساب: مدة العلاقة التعاقدية + 5 سنوات\n• بيانات KYC: 5 سنوات بعد نهاية العلاقة التجارية (التزام تنظيمي)\n• بيانات المعاملات: 10 سنوات (التزامات محاسبية وتنظيمية)\n• البيانات التقنية: 13 شهراً كحد أقصى`,
    },
  },
  {
    id: "rights",
    title: { FR: "Vos droits", EN: "Your rights", AR: "حقوقك" },
    content: {
      FR: `Conformément à la loi n° 09-08, vous disposez des droits suivants :\n\n• Droit d'accès à vos données personnelles\n• Droit de rectification des données inexactes\n• Droit d'opposition au traitement\n• Droit à l'effacement (dans les limites des obligations légales de conservation)\n\nPour exercer vos droits, contactez notre DPO à privacy@emerge.ma. Nous répondrons dans un délai de 30 jours.`,
      EN: `In accordance with Law No. 09-08, you have the following rights:\n\n• Right of access to your personal data\n• Right to rectification of inaccurate data\n• Right to object to processing\n• Right to erasure (within the limits of legal retention obligations)\n\nTo exercise your rights, contact our DPO at privacy@emerge.ma. We will respond within 30 days.`,
      AR: `وفقاً للقانون رقم 09-08، لديك الحقوق التالية:\n\n• حق الوصول إلى بياناتك الشخصية\n• حق تصحيح البيانات غير الدقيقة\n• حق الاعتراض على المعالجة\n• حق الحذف (ضمن حدود الالتزامات القانونية للاحتفاظ)\n\nلممارسة حقوقك، تواصل مع مسؤول حماية البيانات على privacy@emerge.ma. سنردّ في غضون 30 يوماً.`,
    },
  },
  {
    id: "cookies",
    title: { FR: "Cookies", EN: "Cookies", AR: "ملفات تعريف الارتباط" },
    content: {
      FR: `EMERGE utilise des cookies strictement nécessaires au fonctionnement de la plateforme (authentification, préférences de langue). Aucun cookie publicitaire ou de traçage tiers n'est utilisé.\n\nVous pouvez configurer votre navigateur pour refuser les cookies, ce qui peut affecter certaines fonctionnalités de la plateforme.`,
      EN: `EMERGE uses cookies strictly necessary for the operation of the platform (authentication, language preferences). No advertising or third-party tracking cookies are used.\n\nYou can configure your browser to refuse cookies, which may affect certain platform features.`,
      AR: `تستخدم EMERGE ملفات تعريف الارتباط الضرورية تماماً لتشغيل المنصة (المصادقة، تفضيلات اللغة). لا تُستخدم ملفات تعريف الارتباط الإعلانية أو تتبع أطراف ثالثة.\n\nيمكنك تهيئة متصفحك لرفض ملفات تعريف الارتباط، مما قد يؤثر على بعض ميزات المنصة.`,
    },
  },
];

export default function Privacy() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const flags: Record<string, string> = {
    FR: "/img/flag_fr.png", AR: "/img/flag_ar.png", EN: "/img/flag_en.png",
  };

  const ui = {
    title:    { FR: "Politique de confidentialité", EN: "Privacy policy",         AR: "سياسة الخصوصية" },
    subtitle: { FR: "Comment EMERGE collecte, utilise et protège vos données personnelles, conformément à la loi marocaine n° 09-08.", EN: "How EMERGE collects, uses and protects your personal data, in accordance with Moroccan Law No. 09-08.", AR: "كيف تجمع EMERGE بياناتك الشخصية وتستخدمها وتحميها، وفقاً للقانون المغربي رقم 09-08." },
    updated:  { FR: "Dernière mise à jour : juin 2026", EN: "Last updated: June 2026", AR: "آخر تحديث: يونيو 2026" },
  };

  return (
    <main dir={t.dir} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8f9fb", color: "#0f1923", fontSize: "15px", minHeight: "100vh" }}>

      <nav style={{ background: "#0f1923", padding: "0 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "68px", position: "sticky", top: 0, zIndex: 100 }}>
        <img src="/img/logo_emerge_cropped.png" alt="Emerge Capital" width={70} style={{ height: "auto", objectFit: "contain" }} />
        <div className="emerge-nav-links" style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.82rem", fontWeight: 500 }}>{lang === "FR" ? "Accueil" : lang === "AR" ? "الرئيسية" : "Home"}</Link>
          <Link href="/about" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.82rem", fontWeight: 500 }}>{lang === "FR" ? "À propos" : lang === "AR" ? "حول" : "About"}</Link>
          <Link href="/legal" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.82rem", fontWeight: 500 }}>{t.footer.legal}</Link>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {(["FR", "AR", "EN"] as const).filter(l => l !== lang).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <img src={flags[l]} alt={l} width={32} height={22} style={{ borderRadius: "4px", display: "block" }} />
            </button>
          ))}
        </div>
      </nav>

      <section style={{ background: "#fff", borderBottom: "1px solid #e8ecf0", padding: "3rem 3rem 2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f1923", marginBottom: "0.6rem" }}>{ui.title[lang]}</h1>
        <p style={{ fontSize: "0.88rem", color: "#6b7a8d", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto 0.75rem" }}>{ui.subtitle[lang]}</p>
        <p style={{ fontSize: "0.75rem", color: "#aab0ba", fontStyle: "italic" }}>{ui.updated[lang]}</p>
      </section>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "2.5rem 2rem 5rem" }}>
        {sections.map((s, i) => (
          <div key={s.id} id={s.id} style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "1.75rem", marginBottom: "1rem", scrollMarginTop: "80px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#5bbdd4,#2a4a7a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.72rem", fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
              <h2 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f1923", margin: 0 }}>{s.title[lang]}</h2>
            </div>
            {s.content[lang].split('\n\n').map((para, pi) => (
              <p key={pi} style={{ fontSize: "0.85rem", color: "#4a5568", lineHeight: 1.8, margin: "0 0 0.75rem", whiteSpace: "pre-line" }}>{para}</p>
            ))}
          </div>
        ))}
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
