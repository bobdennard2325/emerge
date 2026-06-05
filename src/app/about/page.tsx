"use client";
import Link from "next/link";
import { translations } from "../translations";
import { useLanguage } from "../LanguageContext";

export default function About() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const flags: Record<string, string> = {
    FR: "/img/flag_fr.png", AR: "/img/flag_ar.png", EN: "/img/flag_en.png",
  };

  const ui = {
    badge:       { FR: "À propos",                      EN: "About",                         AR: "حول" },
    title:       { FR: "Qui sommes-nous ?",              EN: "Who are we?",                   AR: "من نحن؟" },
    subtitle:    { FR: "EMERGE est la première plateforme marocaine de financement participatif en capital propulsée par l'intelligence artificielle.", EN: "EMERGE is Morocco's first AI-powered equity crowdfunding platform.", AR: "EMERGE هي أول منصة مغربية للتمويل الجماعي بالأسهم مدعومة بالذكاء الاصطناعي." },

    // EMERGE section
    emergeTitle: { FR: "EMERGE Capital",                 EN: "EMERGE Capital",                AR: "EMERGE Capital" },
    emergeP1:    { FR: "EMERGE connecte les entrepreneurs marocains cherchant des capitaux avec des investisseurs particuliers souhaitant accéder à des opportunités à fort potentiel de croissance. Grâce à un moteur d'IA propriétaire, chaque projet soumis fait l'objet d'une évaluation multi-critères impartiale, complétée par une due diligence humaine conduite par des analystes financiers expérimentés.", EN: "EMERGE connects Moroccan entrepreneurs seeking capital with individual investors looking for high-growth opportunities. Through a proprietary AI engine, every submitted project undergoes an impartial multi-criteria assessment, complemented by human due diligence conducted by experienced financial analysts.", AR: "تربط EMERGE رواد الأعمال المغاربة الباحثين عن رأس المال بالمستثمرين الأفراد الراغبين في الوصول إلى فرص النمو العالي. من خلال محرك ذكاء اصطناعي خاص، يخضع كل مشروع مقدم لتقييم موضوعي متعدد المعايير، مكمَّلاً بعناية واجبة بشرية يجريها محللون ماليون متمرسون." },
    emergeP2:    { FR: "La plateforme est conçue pour élargir l'accès à l'investissement privé au Maroc, avec des options conformes à la Charia pour les investisseurs souhaitant respecter les principes de la finance islamique.", EN: "The platform is designed to broaden access to private investment in Morocco, with Sharia-compliant options for investors wishing to adhere to Islamic finance principles.", AR: "صُمِّمت المنصة لتوسيع الوصول إلى الاستثمار الخاص في المغرب، مع خيارات متوافقة مع الشريعة الإسلامية للمستثمرين الراغبين في الالتزام بمبادئ التمويل الإسلامي." },

    // OVERSEE section
    overseeTitle:{ FR: "Un projet OVERSEE",              EN: "An OVERSEE initiative",         AR: "مبادرة OVERSEE" },
    overseeP1:   { FR: "EMERGE est une initiative d'OVERSEE, banque d'investissement agréée par l'Autorité Marocaine du Marché des Capitaux (AMMC). OVERSEE accompagne depuis plusieurs années entreprises et investisseurs dans leurs opérations de capital, de conseil et de financement sur les marchés marocains et internationaux.", EN: "EMERGE is an initiative of OVERSEE, an investment bank licensed by the Moroccan Capital Markets Authority (AMMC). OVERSEE has for several years been accompanying companies and investors in their capital, advisory and financing transactions on Moroccan and international markets.", AR: "EMERGE مبادرة من OVERSEE، وهو بنك استثماري مرخّص من قِبل هيئة مسالك رأس المال المغربية (AMMC). ترافق OVERSEE منذ سنوات عديدة الشركات والمستثمرين في عمليات رأس المال والاستشارات والتمويل في الأسواق المغربية والدولية." },
    overseeP2:   { FR: "L'agrément AMMC d'OVERSEE garantit que la plateforme EMERGE est développée et opérée dans le respect du cadre réglementaire marocain des marchés de capitaux, assurant la transparence, la protection des investisseurs et la conformité réglementaire.", EN: "OVERSEE's AMMC licence ensures that the EMERGE platform is developed and operated in compliance with Morocco's capital markets regulatory framework, guaranteeing transparency, investor protection and regulatory compliance.", AR: "يضمن ترخيص OVERSEE من AMMC أن منصة EMERGE مُطوَّرة ومُشغَّلة وفق الإطار التنظيمي المغربي لأسواق رأس المال، مما يكفل الشفافية وحماية المستثمرين والامتثال التنظيمي." },
    overseeLink: { FR: "Visiter le site OVERSEE →",      EN: "Visit OVERSEE's website →",     AR: "زيارة موقع OVERSEE ←" },

    // Regulatory section
    regTitle:    { FR: "Cadre réglementaire",            EN: "Regulatory framework",          AR: "الإطار التنظيمي" },
    regP1:       { FR: "EMERGE est en cours d'autorisation sous le régime de financement participatif en capital défini par l'AMMC. La plateforme est structurée pour respecter l'ensemble des exigences réglementaires en matière de protection des investisseurs, de transparence des informations et de suitabilité des placements.", EN: "EMERGE is in the process of authorisation under the equity crowdfunding regime defined by the AMMC. The platform is structured to comply with all regulatory requirements regarding investor protection, information transparency and investment suitability.", AR: "EMERGE في مرحلة الحصول على الترخيص ضمن نظام التمويل الجماعي بالأسهم الذي حددته AMMC. صُمِّمت المنصة لتستوفي جميع المتطلبات التنظيمية المتعلقة بحماية المستثمرين وشفافية المعلومات وملاءمة الاستثمارات." },

    // Values
    valuesTitle: { FR: "Nos valeurs",                   EN: "Our values",                    AR: "قيمنا" },
    v1title:     { FR: "Impartialité",                  EN: "Impartiality",                  AR: "الحيادية" },
    v1:          { FR: "Le score IA est généré algorithmiquement sans intervention humaine sur le résultat. Les entrepreneurs ne peuvent améliorer leur score qu'en fournissant de nouvelles informations.", EN: "The AI score is generated algorithmically without human intervention on the result. Entrepreneurs can only improve their score by providing new information.", AR: "يُولَّد نقاط الذكاء الاصطناعي خوارزمياً دون تدخل بشري في النتيجة. لا يمكن لرواد الأعمال تحسين نقاطهم إلا بتقديم معلومات جديدة." },
    v2title:     { FR: "Accessibilité",                 EN: "Accessibility",                 AR: "إمكانية الوصول" },
    v2:          { FR: "L'investissement privé a longtemps été réservé aux institutions et aux particuliers fortunés. EMERGE démocratise cet accès pour tous les Marocains, avec des tickets d'entrée accessibles.", EN: "Private investment has long been reserved for institutions and wealthy individuals. EMERGE democratises this access for all Moroccans, with accessible minimum investment tickets.", AR: "ظلّ الاستثمار الخاص محجوزاً تاريخياً للمؤسسات والأثرياء. تُديمقراطِ EMERGE هذا الوصول لجميع المغاربة بحدود استثمار ميسورة." },
    v3title:     { FR: "Transparence",                  EN: "Transparency",                  AR: "الشفافية" },
    v3:          { FR: "Chaque score est accompagné de son détail et d'une divulgation claire de ses limites. Nous ne présentons jamais un score comme un conseil en investissement.", EN: "Every score is accompanied by its breakdown and a clear disclosure of its limitations. We never present a score as investment advice.", AR: "يُرفَق كل تقييم بتفاصيله وإفصاح واضح عن حدوده. لا نُقدّم التقييم أبداً بوصفه نصيحة استثمارية." },
    v4title:     { FR: "Inclusion",                     EN: "Inclusion",                     AR: "الشمول" },
    v4:          { FR: "Des options conformes à la Charia permettent à un segment d'investisseurs que les plateformes conventionnelles ne peuvent pas servir d'accéder aux mêmes opportunités.", EN: "Sharia-compliant options allow a segment of investors that conventional platforms cannot serve to access the same opportunities.", AR: "تتيح الخيارات المتوافقة مع الشريعة لشريحة من المستثمرين التي لا تستطيع المنصات التقليدية خدمتها الوصول إلى نفس الفرص." },

    ammc:        { FR: "Régulé par l'AMMC",             EN: "Regulated by AMMC",             AR: "خاضع لرقابة AMMC" },
    contact:     { FR: "Contact",                       EN: "Contact",                       AR: "التواصل" },
    contactVal:  { FR: "contact@emerge.ma",             EN: "contact@emerge.ma",             AR: "contact@emerge.ma" },
  };

  return (
    <main dir={t.dir} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8f9fb", color: "#0f1923", fontSize: "15px", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{ background: "#0f1923", padding: "0 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "68px", position: "sticky", top: 0, zIndex: 100 }}>
        <img src="/img/logo_emerge_cropped.png" alt="Emerge Capital" width={70} style={{ height: "auto", objectFit: "contain" }} />
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          {([
            { label: lang === "FR" ? "Campagnes" : lang === "AR" ? "الحملات" : "Campaigns", href: "/" },
            { label: lang === "FR" ? "Comment ça marche" : lang === "AR" ? "كيف يعمل" : "How it works", href: "/how-it-works" },
            { label: lang === "FR" ? "Investisseurs" : lang === "AR" ? "المستثمرون" : "Investors", href: "/investor" },
            { label: lang === "FR" ? "À propos" : lang === "AR" ? "حول" : "About", href: "/about" },
          ] as {label:string;href:string}[]).map(({ label, href }) => (
            <Link key={href} href={href} style={{ color: href === "/about" ? "#5bbdd4" : "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.82rem", fontWeight: href === "/about" ? 700 : 500 }}>{label}</Link>
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
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eaf6fb", color: "#2a6a8a", padding: "0.4rem 1rem", borderRadius: "100px", fontSize: "0.78rem", fontWeight: 600, marginBottom: "1rem", border: "1px solid #c0e4f0" }}>
          <span style={{ width: "7px", height: "7px", background: "#5bbdd4", borderRadius: "50%", display: "inline-block" }} />
          {ui.badge[lang]}
        </div>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f1923", marginBottom: "1rem" }}>{ui.title[lang]}</h1>
        <p style={{ fontSize: "1rem", color: "#6b7a8d", lineHeight: 1.75, maxWidth: "560px", margin: "0 auto" }}>{ui.subtitle[lang]}</p>
      </section>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "3rem 2rem 5rem" }}>

        {/* EMERGE section */}
        <div style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "16px", padding: "2rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.25rem" }}>
            <img src="/img/logo_emerge_cropped.png" alt="EMERGE" width={60} style={{ height: "auto" }} />
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f1923", margin: 0 }}>{ui.emergeTitle[lang]}</h2>
          </div>
          <p style={{ fontSize: "0.88rem", color: "#4a5568", lineHeight: 1.8, marginBottom: "1rem" }}>{ui.emergeP1[lang]}</p>
          <p style={{ fontSize: "0.88rem", color: "#4a5568", lineHeight: 1.8, margin: 0 }}>{ui.emergeP2[lang]}</p>
        </div>

        {/* OVERSEE section */}
        <div style={{ background: "linear-gradient(135deg,#0f1923 0%,#1a3a6a 100%)", borderRadius: "16px", padding: "2rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            <div>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#5bbdd4", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>{ui.overseeTitle[lang]}</div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", margin: 0 }}>OVERSEE</h2>
            </div>
            <a href="https://www.oversee-international.com" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(91,189,212,0.15)", border: "1px solid rgba(91,189,212,0.4)", color: "#5bbdd4", padding: "0.55rem 1.2rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
              🌐 {ui.overseeLink[lang]}
            </a>
          </div>
          <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.8, marginBottom: "1rem" }}>{ui.overseeP1[lang]}</p>
          <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.8, marginBottom: "1.25rem" }}>{ui.overseeP2[lang]}</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "8px", padding: "0.6rem 1rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#5bbdd4" }}>🏛️ {ui.ammc[lang]}</span>
          </div>
        </div>

        {/* Regulatory framework */}
        <div style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "16px", padding: "2rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f1923", marginBottom: "1rem" }}>{ui.regTitle[lang]}</h2>
          <p style={{ fontSize: "0.88rem", color: "#4a5568", lineHeight: 1.8, margin: 0 }}>{ui.regP1[lang]}</p>
        </div>

        {/* Values */}
        <div style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "16px", padding: "2rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f1923", marginBottom: "1.5rem" }}>{ui.valuesTitle[lang]}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            {[
              { title: ui.v1title[lang], body: ui.v1[lang], icon: "⚖️" },
              { title: ui.v2title[lang], body: ui.v2[lang], icon: "🚪" },
              { title: ui.v3title[lang], body: ui.v3[lang], icon: "🔍" },
              { title: ui.v4title[lang], body: ui.v4[lang], icon: "☪️" },
            ].map(v => (
              <div key={v.title} style={{ background: "#f8f9fb", borderRadius: "12px", padding: "1.1rem" }}>
                <div style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{v.icon}</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f1923", marginBottom: "0.4rem" }}>{v.title}</div>
                <p style={{ fontSize: "0.78rem", color: "#6b7a8d", lineHeight: 1.6, margin: 0 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "16px", padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#8a96a3", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>{ui.contact[lang]}</div>
            <a href="mailto:contact@emerge.ma" style={{ fontSize: "0.9rem", fontWeight: 700, color: "#2a4a7a", textDecoration: "none" }}>{ui.contactVal[lang]}</a>
          </div>
          <a href="https://www.oversee-international.com" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: "0.82rem", fontWeight: 600, color: "#5bbdd4", textDecoration: "none" }}>
            oversee-international.com ↗
          </a>
        </div>
      </div>

      <footer style={{ background: "#0f1923", color: "#8a96a3", textAlign: "center", padding: "1.5rem", fontSize: "0.78rem" }}>
        © 2026 Emerge Capital · Casablanca, Maroc ·{" "}
        <a href="#" style={{ color: "#5bbdd4", textDecoration: "none" }}>{t.footer.legal}</a> ·{" "}
        <a href="#" style={{ color: "#5bbdd4", textDecoration: "none" }}>{t.footer.privacy}</a> ·{" "}
        <Link href="/glossary" style={{ color: "#5bbdd4", textDecoration: "none" }}>{lang === "FR" ? "Lexique" : lang === "AR" ? "القاموس" : "Glossary"}</Link>
      </footer>
    </main>
  );
}
