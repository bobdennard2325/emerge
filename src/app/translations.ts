export const translations = {
  FR: {
    dir: "ltr",
    nav: {
      campaigns: "Campagnes",
      howItWorks: "Comment ça marche",
      investors: "Investisseurs",
      about: "À propos",
      login: "Se connecter",
      start: "Commencer",
    },
    hero: {
      badge: "Plateforme régulée par l'Autorité Marocaine du Marché des Capitaux",
      title1: "Investissez dans les",
      title2: "champions de demain",
      subtitle: "Emerge Capital connecte les startups marocaines visionnaires avec des investisseurs avisés. Devenez actionnaire des entreprises qui façonnent l'avenir de l'Afrique.",
      cta1: "Voir les campagnes",
      cta2: "Comment ça marche",
    },
    campaigns: {
      title: "Campagnes en cours",
      seeAll: "Voir toutes →",
      raised: "levés",
      daysLeft: "jours restants",
    },
    trust: {
      regulated: "Régulé par l'AMMC",
      secured: "Fonds sécurisés",
      verified: "Startups vérifiées",
      transparent: "Rapports transparents",
    },
    footer: {
      legal: "Mentions légales",
      privacy: "Politique de confidentialité",
    },
  },
  EN: {
    dir: "ltr",
    nav: {
      campaigns: "Campaigns",
      howItWorks: "How it works",
      investors: "Investors",
      about: "About",
      login: "Sign in",
      start: "Get started",
    },
    hero: {
      badge: "Regulated platform by the Moroccan Capital Markets Authority",
      title1: "Invest in",
      title2: "tomorrow's champions",
      subtitle: "Emerge Capital connects visionary Moroccan startups with smart investors. Own a stake in the companies shaping Africa's future.",
      cta1: "Browse campaigns",
      cta2: "How it works",
    },
    campaigns: {
      title: "Live campaigns",
      seeAll: "See all →",
      raised: "raised",
      daysLeft: "days left",
    },
    trust: {
      regulated: "Regulated by AMMC",
      secured: "Secured funds",
      verified: "Verified startups",
      transparent: "Transparent reporting",
    },
    footer: {
      legal: "Legal notice",
      privacy: "Privacy policy",
    },
  },
  AR: {
    dir: "rtl",
    nav: {
      campaigns: "الحملات",
      howItWorks: "كيف يعمل",
      investors: "المستثمرون",
      about: "من نحن",
      login: "تسجيل الدخول",
      start: "ابدأ الآن",
    },
    hero: {
      badge: "منصة خاضعة لرقابة هيئة مسالك رأس المال المغربية",
      title1: "استثمر في",
      title2: "أبطال الغد",
      subtitle: "تربط Emerge Capital الشركات الناشئة المغربية الرائدة بالمستثمرين الأذكياء. امتلك حصة في الشركات التي تصنع مستقبل أفريقيا.",
      cta1: "تصفح الحملات",
      cta2: "كيف يعمل",
    },
    campaigns: {
      title: "الحملات الجارية",
      seeAll: "عرض الكل →",
      raised: "تم جمعها",
      daysLeft: "أيام متبقية",
    },
    trust: {
      regulated: "خاضع لرقابة AMMC",
      secured: "أموال مؤمّنة",
      verified: "شركات ناشئة موثّقة",
      transparent: "تقارير شفافة",
    },
    footer: {
      legal: "الإشعار القانوني",
      privacy: "سياسة الخصوصية",
    },
  },
};

export type Lang = keyof typeof translations;