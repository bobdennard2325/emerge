"use client";
import { useEffect } from "react";
import Link from "next/link";
import { translations } from "../translations";
import { useLanguage } from "../LanguageContext";

// ─── Section data ─────────────────────────────────────────────────────────────
const sections = [
  {
    id: "ai-platform",
    icon: "🤖",
    color: "#185fa5",
    bg: "#eaf2fb",
    title: {
      FR: "La première plateforme marocaine de financement participatif propulsée par l'IA",
      EN: "Morocco's first AI-powered equity crowdfunding platform",
      AR: "أول منصة مغربية للتمويل الجماعي بالأسهم مدعومة بالذكاء الاصطناعي",
    },
    body: [
      {
        FR: "EMERGE combine intelligence artificielle et expertise humaine pour évaluer chaque projet de manière impartiale, rigoureuse et transparente. Notre moteur d'IA analyse les documents soumis selon huit critères : maturité de la société, opportunité de marché, chance de succès, probabilité de croissance, potentiel de rendement, impact & durabilité, conformité Charia et bien-être social.",
        EN: "EMERGE combines artificial intelligence and human expertise to assess each project impartially, rigorously and transparently. Our AI engine analyses submitted documents across eight criteria: company maturity, market opportunity, chance of success, growth probability, return potential, impact & sustainability, Sharia compliance and social welfare.",
        AR: "تجمع EMERGE بين الذكاء الاصطناعي والخبرة البشرية لتقييم كل مشروع بموضوعية وصرامة وشفافية. يحلّل محرك الذكاء الاصطناعي لدينا الوثائق المقدمة وفق ثمانية معايير: نضج الشركة، فرصة السوق، احتمالية النجاح، احتمالية النمو، إمكانية العائد، الأثر والاستدامة، الامتثال الشرعي والرفاه الاجتماعي.",
      },
      {
        FR: "Le score IA n'est pas la fin du processus — c'est le début. Chaque projet qui dépasse le seuil minimal est ensuite soumis à la revue de nos analystes financiers, qui vérifient les documents, croisent les données publiques et échangent directement avec l'équipe du projet. L'algorithme filtre ; l'humain valide.",
        EN: "The AI score is not the end of the process — it is the beginning. Every project that passes the minimum threshold is then submitted to review by our financial analysts, who verify documents, cross-reference public data and exchange directly with the project team. The algorithm filters; the human validates.",
        AR: "نقاط الذكاء الاصطناعي ليست نهاية العملية — بل هي البداية. كل مشروع يتجاوز الحد الأدنى يخضع بعدها لمراجعة محللينا الماليين، الذين يتحقون من الوثائق ويتقاطعون مع البيانات العامة ويتبادلون مباشرةً مع فريق المشروع. الخوارزمية تصفّي؛ الإنسان يتحقق.",
      },
      {
        FR: "Ce que cela signifie pour vous : chaque opportunité présentée sur EMERGE a fait l'objet d'une double évaluation — algorithmique et humaine. Le score affiché est un résumé de due diligence indicatif, pas un conseil en investissement.",
        EN: "What this means for you: every opportunity presented on EMERGE has undergone a dual assessment — algorithmic and human. The displayed score is an indicative due-diligence summary, not investment advice.",
        AR: "ما يعنيه هذا بالنسبة لك: كل فرصة مُقدَّمة على EMERGE خضعت لتقييم مزدوج — خوارزمي وبشري. النقاط المعروضة ملخص عناية واجبة إرشادي، لا توصية استثمارية.",
      },
    ],
    points: [
      {
        icon: "📄", title: { FR: "Analyse documentaire", EN: "Document analysis", AR: "تحليل الوثائق" },
        body: { FR: "États financiers, plan d'affaires, étude de marché, pitch deck — tout est analysé automatiquement.", EN: "Financial statements, business plan, market study, pitch deck — everything is analysed automatically.", AR: "القوائم المالية، خطة الأعمال، دراسة السوق، عرض المشروع — كل شيء يُحلَّل تلقائياً." },
      },
      {
        icon: "🔄", title: { FR: "Score itératif", EN: "Iterative score", AR: "نقاط تكرارية" },
        body: { FR: "Les porteurs peuvent améliorer leur score en fournissant de nouvelles informations. Chaque version est horodatée et auditée.", EN: "Project owners can improve their score by supplying new information. Every version is timestamped and audited.", AR: "يمكن لأصحاب المشاريع تحسين نقاطهم بتقديم معلومات جديدة. كل نسخة مختومة بالتوقيت ومراجعة." },
      },
      {
        icon: "👤", title: { FR: "Validation humaine", EN: "Human validation", AR: "التحقق البشري" },
        body: { FR: "Aucun projet ne va en ligne sans revue d'un analyste financier qualifié, incluant un échange direct avec l'équipe.", EN: "No project goes live without review by a qualified financial analyst, including a direct exchange with the team.", AR: "لا يُنشر أي مشروع دون مراجعة محلل مالي مؤهل، تشمل تبادلاً مباشراً مع الفريق." },
      },
    ],
  },
  {
    id: "ammc",
    icon: "🏛️",
    color: "#2a4a7a",
    bg: "#eaf2fb",
    title: {
      FR: "Plateforme régulée par l'Autorité Marocaine du Marché des Capitaux (AMMC)",
      EN: "Platform regulated by the Moroccan Capital Markets Authority (AMMC)",
      AR: "منصة خاضعة لرقابة هيئة مسالك رأس المال المغربية (AMMC)",
    },
    body: [
      {
        FR: "EMERGE est en cours d'autorisation sous le cadre réglementaire de financement participatif en capital défini par l'AMMC, l'autorité de surveillance des marchés financiers au Maroc. Opérer sous ce régime n'est pas une formalité — c'est une garantie structurelle pour les investisseurs.",
        EN: "EMERGE is in the process of authorisation under the equity crowdfunding regulatory framework defined by the AMMC, the financial markets supervisory authority in Morocco. Operating under this regime is not a formality — it is a structural guarantee for investors.",
        AR: "EMERGE في مرحلة الحصول على الترخيص ضمن إطار تنظيم التمويل الجماعي بالأسهم الذي حددته AMMC، هيئة الإشراف على الأسواق المالية في المغرب. العمل في ظل هذا النظام ليس شكلية — بل ضمان هيكلي للمستثمرين.",
      },
      {
        FR: "EMERGE est une initiative d'OVERSEE, banque d'investissement agréée par l'AMMC. Cette affiliation garantit que la plateforme est développée et opérée par des professionnels des marchés de capitaux soumis à des obligations réglementaires strictes.",
        EN: "EMERGE is an initiative of OVERSEE, an investment bank licensed by the AMMC. This affiliation ensures that the platform is developed and operated by capital markets professionals subject to strict regulatory obligations.",
        AR: "EMERGE مبادرة من OVERSEE، وهو بنك استثماري مرخّص من قِبل AMMC. تضمن هذه الرابطة أن المنصة مُطوَّرة ومُشغَّلة من قِبل محترفي أسواق رأس المال الخاضعين لالتزامات تنظيمية صارمة.",
      },
    ],
    points: [
      {
        icon: "📋", title: { FR: "Cadre réglementaire", EN: "Regulatory framework", AR: "الإطار التنظيمي" },
        body: { FR: "Le régime AMMC impose des obligations de transparence, de protection des investisseurs et de suitabilité des placements.", EN: "The AMMC regime imposes obligations of transparency, investor protection and investment suitability.", AR: "يفرض نظام AMMC التزامات الشفافية وحماية المستثمرين وملاءمة الاستثمارات." },
      },
      {
        icon: "🏦", title: { FR: "Adossé à OVERSEE", EN: "Backed by OVERSEE", AR: "مدعوم من OVERSEE" },
        body: { FR: "OVERSEE est agréé par l'AMMC en tant que banque d'investissement. Ses obligations réglementaires s'étendent à EMERGE.", EN: "OVERSEE is licensed by the AMMC as an investment bank. Its regulatory obligations extend to EMERGE.", AR: "OVERSEE مرخّص من AMMC بوصفه بنكاً استثمارياً. التزاماته التنظيمية تمتد إلى EMERGE." },
      },
      {
        icon: "🔍", title: { FR: "Supervision continue", EN: "Ongoing supervision", AR: "الإشراف المستمر" },
        body: { FR: "Les opérations de la plateforme, les processus de due diligence et les informations divulguées sont soumis au contrôle de l'AMMC.", EN: "Platform operations, due diligence processes and disclosed information are subject to AMMC oversight.", AR: "عمليات المنصة وإجراءات العناية الواجبة والمعلومات المُفصَح عنها خاضعة لرقابة AMMC." },
      },
    ],
    link: { href: "https://www.oversee-international.com", label: { FR: "Visiter OVERSEE →", EN: "Visit OVERSEE →", AR: "زيارة OVERSEE ←" } },
  },
  {
    id: "secured",
    icon: "🔒",
    color: "#0f6e56",
    bg: "#edf7f0",
    title: {
      FR: "Fonds sécurisés",
      EN: "Secured funds",
      AR: "أموال مؤمّنة",
    },
    body: [
      {
        FR: "Les fonds des investisseurs ne transitent jamais directement vers les porteurs de projets. Ils sont collectés et séquestrés par la plateforme jusqu'à l'atteinte de l'objectif de financement. Si l'objectif n'est pas atteint, les fonds sont intégralement remboursés aux investisseurs.",
        EN: "Investor funds never pass directly to project owners. They are collected and held in escrow by the platform until the funding target is reached. If the target is not met, funds are fully refunded to investors.",
        AR: "لا تنتقل أموال المستثمرين مباشرةً إلى أصحاب المشاريع. يتم تحصيلها واحتجازها من قِبل المنصة حتى بلوغ هدف التمويل. إذا لم يُحقَّق الهدف، تُردّ الأموال بالكامل إلى المستثمرين.",
      },
      {
        FR: "Les paiements s'effectuent exclusivement via des rails bancaires réglementés. Aucune transaction en cryptomonnaie n'est acceptée. Les fonds levés sont versés à la société nette de la commission de succès d'EMERGE uniquement après confirmation de l'atteinte de l'objectif.",
        EN: "Payments are made exclusively via regulated banking rails. No cryptocurrency transactions are accepted. Raised funds are transferred to the company net of EMERGE's success fee only after confirmation that the target has been reached.",
        AR: "تتم المدفوعات حصراً عبر القنوات البنكية المنظّمة. لا تُقبل معاملات العملات المشفرة. تُحوَّل الأموال المجمعة إلى الشركة صافيةً من عمولة نجاح EMERGE فقط بعد تأكيد بلوغ الهدف.",
      },
    ],
    points: [
      {
        icon: "🏦", title: { FR: "Collecte séquestrée", EN: "Escrow collection", AR: "تحصيل محتجز" },
        body: { FR: "Les fonds sont détenus séparément jusqu'à la fin de la campagne. Aucun accès pour le porteur avant l'atteinte de l'objectif.", EN: "Funds are held separately until the end of the campaign. No access for the project owner before the target is met.", AR: "تُحتجز الأموال بشكل منفصل حتى نهاية الحملة. لا يمكن لصاحب المشروع الوصول إليها قبل بلوغ الهدف." },
      },
      {
        icon: "↩️", title: { FR: "Remboursement garanti", EN: "Guaranteed refund", AR: "استرداد مضمون" },
        body: { FR: "En cas d'échec de la campagne, 100% des fonds investis sont restitués. Pas de frais de remboursement.", EN: "If the campaign fails, 100% of invested funds are returned. No refund fees.", AR: "في حالة فشل الحملة، تُردّ 100% من الأموال المستثمرة. لا رسوم استرداد." },
      },
      {
        icon: "🏛️", title: { FR: "Rails bancaires réglementés", EN: "Regulated banking rails", AR: "قنوات بنكية منظّمة" },
        body: { FR: "Toutes les transactions respectent les exigences LCB-FT (lutte contre le blanchiment et le financement du terrorisme).", EN: "All transactions comply with AML/CFT requirements (anti-money laundering and counter-terrorist financing).", AR: "جميع المعاملات تمتثل لمتطلبات مكافحة غسل الأموال وتمويل الإرهاب." },
      },
    ],
  },
  {
    id: "verified",
    icon: "✅",
    color: "#2a7a4a",
    bg: "#edf7f0",
    title: {
      FR: "Projets vérifiés",
      EN: "Verified projects",
      AR: "مشاريع موثّقة",
    },
    body: [
      {
        FR: "Seuls les projets qui franchissent l'ensemble du processus de validation — score IA minimal, vérification documentaire, revue des données publiques et échange avec l'équipe par nos analystes — sont publiés sur la plateforme. Les projets qui obtiennent le badge « EMERGE Vérifié » ont passé nos critères les plus exigeants.",
        EN: "Only projects that pass the full validation process — minimum AI score, document verification, public data review and team exchange by our analysts — are published on the platform. Projects that earn the 'EMERGE Verified' badge have passed our most demanding criteria.",
        AR: "فقط المشاريع التي تجتاز عملية التحقق الكاملة — الحد الأدنى من نقاط الذكاء الاصطناعي والتحقق من الوثائق ومراجعة البيانات العامة وتبادل الفريق من قِبل محللينا — تُنشر على المنصة. المشاريع التي تحصل على شارة 'EMERGE موثّق' اجتازت معاييرنا الأكثر صرامة.",
      },
    ],
    points: [
      {
        icon: "1️⃣", title: { FR: "Score IA ≥ seuil minimum", EN: "AI score ≥ minimum threshold", AR: "نقاط الذكاء الاصطناعي ≥ الحد الأدنى" },
        body: { FR: "Aucun projet sous le seuil défini n'est transmis aux analystes.", EN: "No project below the defined threshold is passed to analysts.", AR: "لا يُحال أي مشروع دون الحد المحدد إلى المحللين." },
      },
      {
        icon: "2️⃣", title: { FR: "Vérification documentaire", EN: "Document verification", AR: "التحقق من الوثائق" },
        body: { FR: "États financiers, registre de commerce, pacte d'actionnaires — tout est vérifié par nos analystes.", EN: "Financial statements, company registry, shareholders' agreement — all verified by our analysts.", AR: "القوائم المالية، السجل التجاري، عقد المساهمين — كل شيء يتحقق منه محللونا." },
      },
      {
        icon: "3️⃣", title: { FR: "Échange avec l'équipe", EN: "Team exchange", AR: "التبادل مع الفريق" },
        body: { FR: "Nos analystes financiers échangent directement avec la direction du projet pour évaluer la crédibilité et la clarté stratégique.", EN: "Our financial analysts exchange directly with project management to assess credibility and strategic clarity.", AR: "يتبادل محللونا الماليون مباشرةً مع إدارة المشروع لتقييم المصداقية والوضوح الاستراتيجي." },
      },
    ],
  },
  {
    id: "reporting",
    icon: "📊",
    color: "#8a5a00",
    bg: "#fdf5e8",
    title: {
      FR: "Reporting transparent",
      EN: "Transparent reporting",
      AR: "تقارير شفافة",
    },
    body: [
      {
        FR: "La relation entre les investisseurs et les sociétés financées ne s'arrête pas à la clôture de la campagne. EMERGE impose aux sociétés financées de soumettre des rapports périodiques à leurs investisseurs, couvrant la performance financière, les jalons clés et tout événement significatif.",
        EN: "The relationship between investors and funded companies does not end at the close of the campaign. EMERGE requires funded companies to submit periodic reports to their investors, covering financial performance, key milestones and any significant events.",
        AR: "لا تنتهي العلاقة بين المستثمرين والشركات الممولة عند إغلاق الحملة. تُلزم EMERGE الشركات الممولة بتقديم تقارير دورية لمستثمريها، تغطي الأداء المالي والمعالم الرئيسية وأي أحداث جوهرية.",
      },
      {
        FR: "Le respect de ces obligations de reporting conditionne l'accès de la société à de futures levées sur la plateforme et à la participation au marché secondaire. La transparence n'est pas optionnelle — c'est une condition d'accès.",
        EN: "Compliance with these reporting obligations conditions the company's access to future raises on the platform and participation in the secondary market. Transparency is not optional — it is an access condition.",
        AR: "يشترط الامتثال لهذه الالتزامات التقريرية وصول الشركة إلى جولات تمويل مستقبلية على المنصة والمشاركة في السوق الثانوية. الشفافية ليست اختيارية — بل شرط وصول.",
      },
    ],
    points: [
      {
        icon: "📅", title: { FR: "Rapports semestriels minimum", EN: "Minimum semi-annual reports", AR: "تقارير نصف سنوية على الأقل" },
        body: { FR: "Performance financière, indicateurs clés et développements significatifs, au minimum tous les six mois.", EN: "Financial performance, key indicators and significant developments, at minimum every six months.", AR: "الأداء المالي والمؤشرات الرئيسية والتطورات الجوهرية، كحد أدنى كل ستة أشهر." },
      },
      {
        icon: "🔔", title: { FR: "Notification des événements significatifs", EN: "Significant event notification", AR: "إشعار الأحداث الجوهرية" },
        body: { FR: "Changement de direction, contrat majeur, procédure judiciaire — tout événement matériel doit être notifié sans délai.", EN: "Change of management, major contract, legal proceedings — any material event must be notified without delay.", AR: "تغيير الإدارة، عقد رئيسي، إجراءات قانونية — يجب إخطار أي حدث جوهري فوراً." },
      },
      {
        icon: "⚖️", title: { FR: "Conformité comme condition d'accès", EN: "Compliance as access condition", AR: "الامتثال كشرط وصول" },
        body: { FR: "Une société qui ne respecte pas ses obligations perd l'accès aux futures levées et au marché secondaire.", EN: "A company that fails to meet its obligations loses access to future raises and the secondary market.", AR: "تفقد الشركة التي لا تفي بالتزاماتها الوصول إلى الجولات المستقبلية والسوق الثانوية." },
      },
    ],
  },
  {
    id: "sharia",
    icon: "☪️",
    color: "#2a4a7a",
    bg: "#eaf2fb",
    title: {
      FR: "Conformité Charia",
      EN: "Sharia compliance",
      AR: "الامتثال الشرعي",
    },
    body: [
      {
        FR: "EMERGE propose des options conformes à la Charia pour les investisseurs souhaitant respecter les principes de la finance islamique. Les projets sont évalués selon des critères de conformité Charia rigoureux, basés sur les normes AAOIFI et les standards internationaux de la finance islamique.",
        EN: "EMERGE offers Sharia-compliant options for investors wishing to adhere to Islamic finance principles. Projects are assessed according to rigorous Sharia compliance criteria, based on AAOIFI standards and international Islamic finance standards.",
        AR: "تقدم EMERGE خيارات متوافقة مع الشريعة الإسلامية للمستثمرين الراغبين في الالتزام بمبادئ التمويل الإسلامي. تُقيَّم المشاريع وفق معايير صارمة للامتثال الشرعي مبنية على معايير AAOIFI والمعايير الدولية للتمويل الإسلامي.",
      },
      {
        FR: "La conformité Charia n'est pas auto-déclarée — elle est évaluée par nos analystes à partir de la structure financière de la société, de ses activités et de ses contrats. Les projets conformes affichent le badge ☪ et sont proposés en priorité aux investisseurs ayant exprimé cette préférence.",
        EN: "Sharia compliance is not self-declared — it is assessed by our analysts based on the company's financial structure, activities and contracts. Compliant projects display the ☪ badge and are prioritised for investors who have expressed this preference.",
        AR: "الامتثال الشرعي ليس تصريحاً ذاتياً — يُقيَّم من قِبل محللينا بناءً على الهيكل المالي للشركة وأنشطتها وعقودها. المشاريع المتوافقة تُعرض شارة ☪ وتُقدَّم بالأولوية للمستثمرين الذين أبدوا هذا التفضيل.",
      },
    ],
    points: [
      {
        icon: "🏭", title: { FR: "Screening de l'activité", EN: "Activity screening", AR: "فحص النشاط" },
        body: { FR: "Les activités prohibées (alcool, tabac, jeux, armement, assurance conventionnelle) sont exclues.", EN: "Prohibited activities (alcohol, tobacco, gambling, weapons, conventional insurance) are excluded.", AR: "الأنشطة المحظورة (الكحول، التبغ، القمار، الأسلحة، التأمين التقليدي) مستبعدة." },
      },
      {
        icon: "📊", title: { FR: "Ratios financiers", EN: "Financial ratios", AR: "النسب المالية" },
        body: { FR: "Ratio d'endettement portant intérêt / actif total ≤ 33% (seuil AAOIFI). Liquidités non placées dans des comptes rémunérés.", EN: "Interest-bearing debt / total assets ratio ≤ 33% (AAOIFI threshold). Cash not placed in interest-bearing accounts.", AR: "نسبة الديون المحملة بفوائد / إجمالي الأصول ≤ 33% (حد AAOIFI). السيولة غير موضوعة في حسابات تحمل فوائد." },
      },
      {
        icon: "💼", title: { FR: "Pureté des revenus", EN: "Revenue purity", AR: "نقاء الإيرادات" },
        body: { FR: "Au moins 95% des revenus doivent provenir de l'activité principale déclarée et conforme.", EN: "At least 95% of revenues must come from the declared compliant main activity.", AR: "يجب أن تأتي 95% على الأقل من الإيرادات من النشاط الرئيسي المُعلن المتوافق." },
      },
      {
        icon: "⚖️", title: { FR: "Instrument d'investissement", EN: "Investment instrument", AR: "أداة الاستثمار" },
        body: { FR: "Les investissements sont sous forme de capital (actions) — partage des profits et pertes — et non de dette portant intérêt.", EN: "Investments are in the form of equity — profit and loss sharing — not interest-bearing debt.", AR: "الاستثمارات في شكل أسهم — مشاركة في الأرباح والخسائر — وليس ديوناً تحمل فوائد." },
      },
    ],
  },
  {
    id: "impact",
    icon: "🌍",
    color: "#0f6e56",
    bg: "#edf7f0",
    title: {
      FR: "Investissement à impact",
      EN: "Impact investing",
      AR: "الاستثمار المؤثر",
    },
    body: [
      {
        FR: "EMERGE intègre l'impact social, environnemental et de gouvernance au cœur de son évaluation des projets. Le score d'impact n'est pas un label marketing — c'est une évaluation quantitative basée sur des indicateurs mesurables soumis à la vérification de nos analystes.",
        EN: "EMERGE integrates social, environmental and governance impact at the heart of its project assessment. The impact score is not a marketing label — it is a quantitative assessment based on measurable indicators subject to verification by our analysts.",
        AR: "تدمج EMERGE الأثر الاجتماعي والبيئي والحوكمة في صميم تقييمها للمشاريع. نقاط الأثر ليست علامة تسويقية — بل تقييم كمي مبني على مؤشرات قابلة للقياس خاضعة لتحقق محللينا.",
      },
    ],
    points: [
      {
        icon: "👩", title: { FR: "Inclusion des femmes", EN: "Women's inclusion", AR: "إدماج المرأة" },
        body: { FR: "Part des femmes dans l'effectif — les projets qui dépassent 30% bénéficient d'un bonus d'impact significatif.", EN: "Female staff share — projects exceeding 30% benefit from a significant impact bonus.", AR: "نسبة النساء في الطاقم — المشاريع التي تتجاوز 30% تستفيد من مكافأة أثر كبيرة." },
      },
      {
        icon: "🎓", title: { FR: "Emploi des jeunes", EN: "Youth employment", AR: "توظيف الشباب" },
        body: { FR: "Part des moins de 30 ans dans l'effectif — signal fort d'impact social et de contribution au tissu économique jeune.", EN: "Share of under-30s in the workforce — a strong signal of social impact and contribution to the young economic fabric.", AR: "نسبة من هم دون 30 عاماً في القوى العاملة — إشارة قوية على الأثر الاجتماعي والمساهمة في النسيج الاقتصادي الشبابي." },
      },
      {
        icon: "☀️", title: { FR: "Énergie renouvelable", EN: "Renewable energy", AR: "الطاقة المتجددة" },
        body: { FR: "Utilisation d'énergies renouvelables dans les opérations — contribue à l'alignement sur la stratégie nationale énergie 2030.", EN: "Use of renewable energy in operations — contributes to alignment with the national energy strategy 2030.", AR: "استخدام الطاقة المتجددة في العمليات — يساهم في التوافق مع الاستراتيجية الوطنية للطاقة 2030." },
      },
      {
        icon: "🏘️", title: { FR: "Populations rurales & sous-desservies", EN: "Rural & underserved populations", AR: "السكان الريفيون وغير المخدومين" },
        body: { FR: "Les projets qui servent directement les populations rurales ou à faibles revenus reçoivent un bonus d'impact supplémentaire.", EN: "Projects that directly serve rural or low-income populations receive an additional impact bonus.", AR: "المشاريع التي تخدم مباشرةً السكان الريفيين أو ذوي الدخل المنخفض تحصل على مكافأة أثر إضافية." },
      },
      {
        icon: "🎯", title: { FR: "Alignement ODD", EN: "SDG alignment", AR: "التوافق مع أهداف التنمية المستدامة" },
        body: { FR: "Les porteurs identifient les Objectifs de Développement Durable (ODD) que leur projet adresse. Les projets alignés sur 3+ ODD bénéficient d'un score d'impact plus élevé.", EN: "Project owners identify the Sustainable Development Goals (SDGs) their project addresses. Projects aligned with 3+ SDGs benefit from a higher impact score.", AR: "يُحدد أصحاب المشاريع أهداف التنمية المستدامة التي يعالجها مشروعهم. المشاريع المتوافقة مع 3+ أهداف تستفيد من نقاط أثر أعلى." },
      },
      {
        icon: "🏭", title: { FR: "Création d'emplois", EN: "Job creation", AR: "خلق فرص العمل" },
        body: { FR: "Le nombre d'emplois créés — directs et indirects — est un signal fort d'impact économique régional.", EN: "The number of jobs created — direct and indirect — is a strong signal of regional economic impact.", AR: "عدد الوظائف المُنشأة — المباشرة وغير المباشرة — إشارة قوية على الأثر الاقتصادي الإقليمي." },
      },
    ],
  },
];

// ─── Section Card component ───────────────────────────────────────────────────
function SectionCard({ s, lang }: { s: typeof sections[0]; lang: string }) {
  return (
    <div id={s.id} style={{ scrollMarginTop: "80px", background: "#fff", border: "1px solid #e8ecf0", borderRadius: "20px", padding: "2.5rem", marginBottom: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "1.75rem" }}>
        <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>
          {s.icon}
        </div>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f1923", lineHeight: 1.3, margin: 0 }}>{s.title[lang]}</h2>
      </div>

      {/* Body paragraphs */}
      {s.body.map((p, i) => (
        <p key={i} style={{ fontSize: "0.88rem", color: "#4a5568", lineHeight: 1.8, marginBottom: i < s.body.length - 1 ? "1rem" : "1.5rem" }}>{p[lang]}</p>
      ))}

      {/* Points grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.9rem" }}>
        {s.points.map((pt, i) => (
          <div key={i} style={{ background: s.bg, borderRadius: "12px", padding: "1rem 1.1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "1rem" }}>{pt.icon}</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: s.color }}>{pt.title[lang]}</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6b7a8d", lineHeight: 1.6, margin: 0 }}>{pt.body[lang]}</p>
          </div>
        ))}
      </div>

      {'link' in s && (s as any).link && (
        <div style={{ marginTop: "1.25rem" }}>
          <a href={(s as any).link.href} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: "0.82rem", fontWeight: 600, color: s.color, textDecoration: "none" }}>
            {(s as any).link.label[lang]}
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Trust() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const flags: Record<string, string> = {
    FR: "/img/flag_fr.png", AR: "/img/flag_ar.png", EN: "/img/flag_en.png",
  };

  // Scroll to hash on mount
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  const ui = {
    title:    { FR: "Confiance & Transparence",  EN: "Trust & Transparency",     AR: "الثقة والشفافية" },
    subtitle: { FR: "Tout ce qui fait d'EMERGE une plateforme de confiance — notre fonctionnement, nos engagements, nos garanties.", EN: "Everything that makes EMERGE a trusted platform — how we work, our commitments, our guarantees.", AR: "كل ما يجعل EMERGE منصة موثوقة — كيف نعمل، التزاماتنا، ضماناتنا." },
    jump:     { FR: "Accéder à une section",     EN: "Jump to a section",        AR: "الانتقال إلى قسم" },
    back:     { FR: "← Accueil",                EN: "← Home",                  AR: "← الرئيسية" },
  };

  const jumpLabels: Record<string, Record<string, string>> = {
    "ai-platform": { FR: "🤖 Plateforme IA",       EN: "🤖 AI Platform",         AR: "🤖 منصة الذكاء الاصطناعي" },
    "ammc":        { FR: "🏛️ Régulation AMMC",     EN: "🏛️ AMMC Regulation",     AR: "🏛️ تنظيم AMMC" },
    "secured":     { FR: "🔒 Fonds sécurisés",      EN: "🔒 Secured funds",        AR: "🔒 أموال مؤمّنة" },
    "verified":    { FR: "✅ Projets vérifiés",     EN: "✅ Verified projects",    AR: "✅ مشاريع موثّقة" },
    "reporting":   { FR: "📊 Reporting",            EN: "📊 Reporting",            AR: "📊 التقارير" },
    "sharia":      { FR: "☪️ Conformité Charia",    EN: "☪️ Sharia compliance",   AR: "☪️ الامتثال الشرعي" },
    "impact":      { FR: "🌍 Impact",               EN: "🌍 Impact",               AR: "🌍 الأثر" },
  };

  return (
    <main dir={t.dir} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8f9fb", color: "#0f1923", fontSize: "15px", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{ background: "#0f1923", padding: "0 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "68px", position: "sticky", top: 0, zIndex: 100 }}>
        <img src="/img/logo_emerge_cropped.png" alt="Emerge Capital" width={70} style={{ height: "auto", objectFit: "contain" }} />
        <div className="emerge-nav-links" style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          {([
            { label: lang === "FR" ? "Campagnes" : lang === "AR" ? "الحملات" : "Campaigns", href: "/" },
            { label: lang === "FR" ? "Comment ça marche" : lang === "AR" ? "كيف يعمل" : "How it works", href: "/how-it-works" },
            { label: lang === "FR" ? "À propos" : lang === "AR" ? "حول" : "About", href: "/about" },
          ] as {label:string;href:string}[]).map(({ label, href }) => (
            <Link key={href} href={href} style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.82rem", fontWeight: 500 }}>{label}</Link>
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
      <section style={{ background: "#fff", borderBottom: "1px solid #e8ecf0", padding: "3.5rem 3rem 2.5rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eaf6fb", color: "#2a6a8a", padding: "0.4rem 1rem", borderRadius: "100px", fontSize: "0.78rem", fontWeight: 600, marginBottom: "1rem", border: "1px solid #c0e4f0" }}>
          <span style={{ width: "7px", height: "7px", background: "#5bbdd4", borderRadius: "50%", display: "inline-block" }} />
          {ui.title[lang]}
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f1923", marginBottom: "0.75rem" }}>{ui.title[lang]}</h1>
        <p style={{ fontSize: "0.92rem", color: "#6b7a8d", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto 2rem" }}>{ui.subtitle[lang]}</p>

        {/* Jump links */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`}
              onClick={e => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
              style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}33`, padding: "0.4rem 1rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 600, textDecoration: "none", cursor: "pointer" }}>
              {jumpLabels[s.id][lang]}
            </a>
          ))}
        </div>
      </section>

      {/* SECTIONS */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "2.5rem 2rem 5rem" }}>
        {sections.map(s => <SectionCard key={s.id} s={s} lang={lang} />)}
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
