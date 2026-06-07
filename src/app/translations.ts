export type Lang = "FR" | "EN" | "AR";

export type Translations = {
  dir: "ltr" | "rtl";
  nav: {
    campaigns: string;
    howItWorks: string;
    investors: string;
    about: string;
    login: string;
    start: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    subtitle: string;
    cta1: string;
    cta2: string;
    cta: string;
  };
  campaigns: {
    title: string;
    seeAll: string;
    raised: string;
    daysLeft: string;
  };
  trust: {
    regulated: string;
    secured: string;
    verified: string;
    transparent: string;
  };
  footer: {
    legal: string;
    privacy: string;
    glossary: string;
  };
};

export const translations: Record<Lang, Translations> = {
  FR: {
    dir: "ltr",
    nav: {
      campaigns:  "Campagnes",
      howItWorks: "Comment ça marche",
      investors:  "Investisseurs",
      about:      "À propos",
      login:      "Se connecter",
      start:      "Déposer un projet",
    },
    hero: {
      badge:    "Plateforme régulée par l'AMMC",
      title1:   "Investissez dans",
      title2:   "les startups marocaines",
      subtitle: "La première plateforme de financement participatif en capital du Maroc. Des projets vérifiés, un score IA impartial, des options conformes à la Charia.",
      cta1:     "Voir les projets",
      cta2:     "Comment ça marche",
      cta:      "Découvrir les projets",
    },
    campaigns: {
      title:    "Projets en cours de financement",
      seeAll:   "Voir tout",
      raised:   "levés",
      daysLeft: "jours restants",
    },
    trust: {
      regulated:   "Plateforme régulée par l'AMMC",
      secured:     "Fonds sécurisés",
      verified:    "Projets vérifiés",
      transparent: "Reporting transparent",
    },
    footer: {
      legal:   "Mentions légales",
      privacy: "Confidentialité",
      glossary:"Lexique",
    },
  },

  EN: {
    dir: "ltr",
    nav: {
      campaigns:  "Campaigns",
      howItWorks: "How it works",
      investors:  "Investors",
      about:      "About",
      login:      "Sign in",
      start:      "Submit a project",
    },
    hero: {
      badge:    "Platform regulated by the AMMC",
      title1:   "Invest in",
      title2:   "Moroccan startups",
      subtitle: "Morocco's first equity crowdfunding platform. Verified projects, impartial AI scoring, Sharia-compliant options.",
      cta1:     "Browse projects",
      cta2:     "How it works",
      cta:      "Discover projects",
    },
    campaigns: {
      title:    "Projects currently raising",
      seeAll:   "See all",
      raised:   "raised",
      daysLeft: "days left",
    },
    trust: {
      regulated:   "Platform regulated by the AMMC",
      secured:     "Secured funds",
      verified:    "Verified projects",
      transparent: "Transparent reporting",
    },
    footer: {
      legal:   "Legal",
      privacy: "Privacy",
      glossary:"Glossary",
    },
  },

  AR: {
    dir: "rtl",
    nav: {
      campaigns:  "الحملات",
      howItWorks: "كيف يعمل",
      investors:  "المستثمرون",
      about:      "حول",
      login:      "تسجيل الدخول",
      start:      "تقديم مشروع",
    },
    hero: {
      badge:    "منصة خاضعة لرقابة AMMC",
      title1:   "استثمر في",
      title2:   "الشركات الناشئة المغربية",
      subtitle: "أول منصة مغربية للتمويل الجماعي بالأسهم. مشاريع موثّقة، تقييم ذكاء اصطناعي محايد، خيارات متوافقة مع الشريعة.",
      cta1:     "تصفح المشاريع",
      cta2:     "كيف يعمل",
      cta:      "اكتشف المشاريع",
    },
    campaigns: {
      title:    "مشاريع قيد التمويل",
      seeAll:   "عرض الكل",
      raised:   "جُمع",
      daysLeft: "أيام متبقية",
    },
    trust: {
      regulated:   "منصة خاضعة لرقابة AMMC",
      secured:     "أموال مؤمّنة",
      verified:    "مشاريع موثّقة",
      transparent: "تقارير شفافة",
    },
    footer: {
      legal:   "الشروط القانونية",
      privacy: "الخصوصية",
      glossary:"القاموس",
    },
  },
};
