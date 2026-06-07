/**
 * EMERGE Capital — Prototype v1.8
 * ─────────────────────────────────────────────────────────────
 * File        : emerge/src/app/layout.tsx
 * Route       : root
 * Description : Root layout — font, responsive CSS, language provider
 * Project     : Morocco's first AI-powered equity crowdfunding platform
 * Operator    : OVERSEE (AMMC-licensed investment bank)
 * Author      : EMERGE Capital / OVERSEE
 * Created     : June 2026
 * Stack       : Next.js 16 · TypeScript · React · Trilingual FR/EN/AR
 * ─────────────────────────────────────────────────────────────
 */
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./LanguageContext";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Emerge Capital",
  description: "Plateforme d'investissement participatif au Maroc",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          /* ── Global responsive rules ── */

          /* Nav links hidden on mobile */
          @media (max-width: 768px) {
            .emerge-nav-links { display: none !important; }
          }

          /* Section padding */
          @media (max-width: 768px) {
            .emerge-hero,
            .emerge-section {
              padding-left: 1rem !important;
              padding-right: 1rem !important;
            }
          }

          /* 2-col grids → 1-col on mobile */
          @media (max-width: 600px) {
            .emerge-grid-2 { grid-template-columns: 1fr !important; }
          }

          /* 3-col grids → 1-col on mobile */
          @media (max-width: 768px) {
            .emerge-grid-3 { grid-template-columns: 1fr !important; }
            .emerge-campaign-cards { grid-template-columns: 1fr !important; }
          }

          /* 4/5-col grids → 2-col on mobile */
          @media (max-width: 600px) {
            .emerge-grid-4 { grid-template-columns: 1fr 1fr !important; }
          }

          /* Campaign builder: split → stack on tablet */
          @media (max-width: 900px) {
            .emerge-builder-grid {
              grid-template-columns: 1fr !important;
            }
            .emerge-preview-sticky {
              position: static !important;
              top: auto !important;
            }
          }

          /* Project page sidebar */
          @media (max-width: 900px) {
            .emerge-sidebar { display: none !important; }
          }

          /* General nav padding tightening */
          @media (max-width: 480px) {
            nav { padding: 0 1rem !important; }
            h1 { font-size: 1.5rem !important; }
          }

          /* Horizontal scroll prevention */
          body { overflow-x: hidden; }
          * { box-sizing: border-box; }
        `}</style>
      </head>
      <body className={jakarta.className}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
