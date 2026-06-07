/**
 * EMERGE Capital — Prototype version 1
 * ─────────────────────────────────────────────────────────────
 * File        : emerge/src/app/legal/page.tsx
 * Route       : /legal
 * Description : Legal notices — publisher, regulatory framework, disclaimers, Moroccan law
 * Project     : Moroccan equity crowdfunding platform
 * Operator    : OVERSEE (AMMC-licensed investment bank)
 * Author      : EMERGE Capital / OVERSEE
 * Created     : June 2026
 * Stack       : Next.js 16 · TypeScript · React · Trilingual FR/EN/AR
 * ─────────────────────────────────────────────────────────────
 * © 2026 EMERGE. All rights reserved.
 */
"use client";
import Link from "next/link";
import { translations } from "../translations";
import { useLanguage } from "../LanguageContext";

const sections = [
  {
    id: "publisher",
    title: { FR: "Éditeur de la plateforme", EN: "Platform publisher", AR: "ناشر المنصة" },
    content: {
      FR: `EMERGE Capital est une plateforme de financement participatif en capital opérée par OVERSEE, société anonyme de droit marocain, banque d'investissement agréée par l'Autorité Marocaine du Marché des Capitaux (AMMC).\n\nSiège social : Casablanca, Maroc\nContact : contact@emerge.ma\nSite web : emerge.ma`,
      EN: `EMERGE Capital is an equity crowdfunding platform operated by OVERSEE, a Moroccan joint-stock company and investment bank licensed by the Moroccan Capital Markets Authority (AMMC).\n\nRegistered office: Casablanca, Morocco\nContact: contact@emerge.ma\nWebsite: emerge.ma`,
      AR: `EMERGE Capital منصة تمويل جماعي بالأسهم تُشغّلها OVERSEE، شركة مساهمة مغربية وبنك استثماري مرخّص من قِبل هيئة مسالك رأس المال المغربية (AMMC).\n\nالمقر الرئيسي: الدار البيضاء، المغرب\nالتواصل: contact@emerge.ma\nالموقع: emerge.ma`,
    },
  },
  {
    id: "regulation",
    title: { FR: "Cadre réglementaire", EN: "Regulatory framework", AR: "الإطار التنظيمي" },
    content: {
      FR: `EMERGE opère sous le régime de financement participatif en capital défini par l'AMMC. La plateforme est en cours d'autorisation formelle auprès de l'AMMC conformément à la réglementation applicable.\n\nOVERSEE est agréée par l'AMMC en tant que banque d'investissement. Les opérations de la plateforme sont soumises au contrôle permanent de l'AMMC.`,
      EN: `EMERGE operates under the equity crowdfunding regime defined by the AMMC. The platform is in the process of formal authorisation with the AMMC in accordance with applicable regulations.\n\nOVERSEE is licensed by the AMMC as an investment bank. Platform operations are subject to ongoing AMMC oversight.`,
      AR: `تعمل EMERGE في إطار نظام التمويل الجماعي بالأسهم الذي حددته AMMC. المنصة في مرحلة الحصول على التفويض الرسمي من AMMC وفقاً للوائح المعمول بها.\n\nOVERSEE مرخّصة من AMMC بوصفها بنكاً استثمارياً. عمليات المنصة خاضعة للرقابة المستمرة من AMMC.`,
    },
  },
  {
    id: "disclaimer",
    title: { FR: "Avertissements importants", EN: "Important disclaimers", AR: "تنبيهات مهمة" },
    content: {
      FR: `Les informations présentées sur EMERGE ne constituent pas un conseil en investissement. Le score EMERGE est un résumé de due diligence indicatif et ne constitue pas une recommandation d'investir.\n\nInvestir dans des sociétés non cotées comporte des risques importants, notamment la perte en capital, l'illiquidité et la dilution. Vous pouvez perdre tout ou partie de votre investissement. N'investissez que les sommes que vous pouvez vous permettre de perdre.\n\nLes valorisations et projections présentées sont indicatives et ne constituent pas une promesse de rendement. Les performances passées ne préjugent pas des résultats futurs.`,
      EN: `Information presented on EMERGE does not constitute investment advice. The EMERGE score is an indicative due-diligence summary and does not constitute a recommendation to invest.\n\nInvesting in unlisted companies carries significant risks, including capital loss, illiquidity and dilution. You may lose all or part of your investment. Only invest amounts you can afford to lose.\n\nValuations and projections presented are indicative and do not constitute a promise of returns. Past performance does not predict future results.`,
      AR: `المعلومات المُقدَّمة على EMERGE لا تُشكّل نصيحة استثمارية. نقاط EMERGE ملخص عناية واجبة إرشادي ولا تُعدّ توصية بالاستثمار.\n\nالاستثمار في الشركات غير المُدرجة ينطوي على مخاطر كبيرة، منها خسارة رأس المال وانعدام السيولة والتخفيف. قد تخسر كل أو جزء من استثمارك. استثمر فقط المبالغ التي تستطيع تحمّل خسارتها.\n\nالتقييمات والتوقعات المُقدَّمة إرشادية ولا تُشكّل وعداً بالعائد. الأداء السابق لا يضمن النتائج المستقبلية.`,
    },
  },
  {
    id: "ip",
    title: { FR: "Propriété intellectuelle", EN: "Intellectual property", AR: "الملكية الفكرية" },
    content: {
      FR: `L'ensemble des éléments de la plateforme EMERGE — marques, logos, textes, algorithmes, interfaces, score IA — sont la propriété exclusive d'OVERSEE et sont protégés par les lois applicables en matière de propriété intellectuelle.\n\nToute reproduction, représentation, modification ou exploitation non autorisée est strictement interdite.`,
      EN: `All elements of the EMERGE platform — brands, logos, texts, algorithms, interfaces, AI score — are the exclusive property of OVERSEE and are protected by applicable intellectual property laws.\n\nAny unauthorised reproduction, representation, modification or exploitation is strictly prohibited.`,
      AR: `جميع عناصر منصة EMERGE — العلامات التجارية والشعارات والنصوص والخوارزميات والواجهات ونقاط الذكاء الاصطناعي — ملكية حصرية لـ OVERSEE وتحميها قوانين الملكية الفكرية المعمول بها.\n\nيُحظر بشكل صارم أي استنساخ أو تمثيل أو تعديل أو استغلال غير مصرّح به.`,
    },
  },
  {
    id: "liability",
    title: { FR: "Limitation de responsabilité", EN: "Limitation of liability", AR: "تحديد المسؤولية" },
    content: {
      FR: `EMERGE et OVERSEE ne sauraient être tenus responsables des pertes financières résultant d'investissements réalisés via la plateforme. Les décisions d'investissement relèvent de la seule responsabilité de l'investisseur.\n\nLes contenus soumis par les porteurs de projets (pitch films, textes de campagne, documents) sont sous la responsabilité exclusive de leurs auteurs. EMERGE vérifie l'exactitude des informations mais ne peut en garantir l'exhaustivité.`,
      EN: `EMERGE and OVERSEE cannot be held liable for financial losses resulting from investments made via the platform. Investment decisions are the sole responsibility of the investor.\n\nContent submitted by project owners (pitch films, campaign texts, documents) is the exclusive responsibility of their authors. EMERGE verifies the accuracy of information but cannot guarantee its completeness.`,
      AR: `لا يمكن مساءلة EMERGE وOVERSEE عن الخسائر المالية الناجمة عن الاستثمارات المُنجزة عبر المنصة. قرارات الاستثمار مسؤولية المستثمر الحصرية.\n\nالمحتوى المُقدَّم من أصحاب المشاريع (أفلام العرض، نصوص الحملة، الوثائق) هو المسؤولية الحصرية لمؤلفيه. تتحقق EMERGE من دقة المعلومات لكن لا تضمن اكتمالها.`,
    },
  },
  {
    id: "law",
    title: { FR: "Droit applicable", EN: "Applicable law", AR: "القانون المعمول به" },
    content: {
      FR: `La plateforme EMERGE est soumise au droit marocain. Tout litige relatif à l'utilisation de la plateforme relève de la compétence exclusive des tribunaux de Casablanca, Maroc.`,
      EN: `The EMERGE platform is subject to Moroccan law. Any dispute relating to the use of the platform falls under the exclusive jurisdiction of the courts of Casablanca, Morocco.`,
      AR: `منصة EMERGE خاضعة للقانون المغربي. أي نزاع يتعلق باستخدام المنصة يخضع للاختصاص الحصري لمحاكم الدار البيضاء، المغرب.`,
    },
  },
];

export default function Legal() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const flags: Record<string, string> = {
    FR: "/img/flag_fr.png", AR: "/img/flag_ar.png", EN: "/img/flag_en.png",
  };

  const ui = {
    title:    { FR: "Mentions légales",   EN: "Legal notices",      AR: "الشروط القانونية" },
    subtitle: { FR: "Informations légales relatives à la plateforme EMERGE Capital et à son opérateur OVERSEE.", EN: "Legal information relating to the EMERGE Capital platform and its operator OVERSEE.", AR: "المعلومات القانونية المتعلقة بمنصة EMERGE Capital ومشغّلها OVERSEE." },
    updated:  { FR: "Dernière mise à jour : juin 2026", EN: "Last updated: June 2026", AR: "آخر تحديث: يونيو 2026" },
  };

  return (
    <main dir={t.dir} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8f9fb", color: "#0f1923", fontSize: "15px", minHeight: "100vh" }}>

      <nav style={{ background: "#0f1923", padding: "0 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "68px", position: "sticky", top: 0, zIndex: 100 }}>
        <img src="/img/logo_emerge_cropped.png" alt="Emerge Capital" width={70} style={{ height: "auto", objectFit: "contain" }} />
        <div className="emerge-nav-links" style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.82rem", fontWeight: 500 }}>{lang === "FR" ? "Accueil" : lang === "AR" ? "الرئيسية" : "Home"}</Link>
          <Link href="/about" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.82rem", fontWeight: 500 }}>{lang === "FR" ? "À propos" : lang === "AR" ? "حول" : "About"}</Link>
          <Link href="/trust" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.82rem", fontWeight: 500 }}>{lang === "FR" ? "Confiance" : lang === "AR" ? "الثقة" : "Trust"}</Link>
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
        <p style={{ fontSize: "0.88rem", color: "#6b7a8d", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 0.75rem" }}>{ui.subtitle[lang]}</p>
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
