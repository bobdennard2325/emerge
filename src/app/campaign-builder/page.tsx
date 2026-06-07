"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { translations, Lang } from "../translations";
import { useLanguage } from "../LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────
type Stage = "builder" | "submitted";

type CampaignForm = {
  catchphrase: string;
  catchFont: string;
  catchColor: string;
  catchBold: boolean;
  catchItalic: boolean;
  logoSize: "S" | "M" | "L";
  filmUrl: string;
  filmFile: string;
  filmDataUrl: string;
  aboutCampaign: string;
  marketOpportunity: string;
  useOfFunds: string;
  traction: string;
  logoFile: string;
  logoDataUrl: string;
  coverFile: string;
  coverDataUrl: string;
  coverColor: string;
};

// ─── Submission data from Step 1 (pre-filled from approved dossier) ───────────
const approvedDossier = {
  company: "GreenRoots S.A.S.",
  tag: { FR: "AGRITECH", EN: "AGRITECH", AR: "تكنولوجيا زراعية" },
  tagColor: "#0f6e56",
  tagBg: "#d0ede4",
  sector: { FR: "AgriTech", EN: "AgriTech", AR: "تكنولوجيا زراعية" },
  location: { FR: "Agadir, Maroc", EN: "Agadir, Morocco", AR: "أكادير، المغرب" },
  score: 78,
  scoreColor: "#2a7a4a",
  funding: "1 000 000 MAD",
  equity: "15,4%",
  sharePrice: "150 MAD",
  valuation: "5,5M MAD",
  minTicket: "1 000 MAD",
  raised: "730 000 MAD",
  pct: 73,
  days: 18,
  verified: true,
  sharia: true,
  team: [
    { name: "Youssef Benali", role: { FR: "CEO & Co-fondateur", EN: "CEO & Co-founder", AR: "الرئيس التنفيذي" }, initials: "YB", color: "#2a4a7a" },
    { name: "Nadia Chraibi", role: { FR: "CTO & Co-fondatrice", EN: "CTO & Co-founder", AR: "مديرة التقنية" }, initials: "NC", color: "#0f6e56" },
  ],
};

// ─── Color palette options for cover ─────────────────────────────────────────
const coverColors = [
  // Platform blues & teals
  { value: "linear-gradient(135deg,#0f1923 0%,#2a4a7a 100%)", label: "EMERGE Navy",  preview: "#2a4a7a" },
  { value: "linear-gradient(135deg,#0f2a3a 0%,#1a6a8a 60%,#5bbdd4 100%)", label: "Teal",     preview: "#1a6a8a" },
  { value: "linear-gradient(135deg,#0a2a4a 0%,#185fa5 100%)", label: "Ocean",    preview: "#185fa5" },
  { value: "linear-gradient(135deg,#0f2a2a 0%,#0f6e56 100%)", label: "Forest",   preview: "#0f6e56" },
  // Warm tones
  { value: "linear-gradient(135deg,#1a0f00 0%,#a05a00 100%)", label: "Amber",    preview: "#a05a00" },
  { value: "linear-gradient(135deg,#1a0a0a 0%,#8a2020 100%)", label: "Crimson",  preview: "#8a2020" },
  { value: "linear-gradient(135deg,#1a0a14 0%,#8a2060 100%)", label: "Rose",     preview: "#8a2060" },
  // Neutral / dark
  { value: "linear-gradient(135deg,#1a1a2e 0%,#3a1a6a 100%)", label: "Purple",   preview: "#3a1a6a" },
  { value: "linear-gradient(135deg,#1e1e1e 0%,#3a3a3a 100%)", label: "Slate",    preview: "#3a3a3a" },
  { value: "linear-gradient(135deg,#0a1a0a 0%,#2a4a0a 100%)", label: "Olive",    preview: "#2a4a0a" },
  { value: "linear-gradient(135deg,#1a1400 0%,#4a3800 100%)", label: "Gold",     preview: "#4a3800" },
  { value: "linear-gradient(135deg,#0a0a1a 0%,#1a1a4a 100%)", label: "Midnight", preview: "#1a1a4a" },
];

// ─── UI Labels ────────────────────────────────────────────────────────────────
const ui = {
  badge:         { FR: "Étape 2 — Configuration de la campagne", EN: "Step 2 — Campaign setup", AR: "الخطوة 2 — إعداد الحملة" },
  title:         { FR: "Créez votre page campagne", EN: "Create your campaign page", AR: "أنشئ صفحة حملتك" },
  subtitle:      { FR: "Votre dossier a été approuvé. Complétez maintenant la présentation de votre campagne. Chaque élément sera vérifié par EMERGE avant publication.", EN: "Your file has been approved. Now complete your campaign presentation. Every element will be verified by EMERGE before publication.", AR: "تمت الموافقة على ملفك. أكمل الآن عرض حملتك. ستتحقق EMERGE من كل عنصر قبل النشر." },
  approved:      { FR: "✓ Dossier approuvé",       EN: "✓ File approved",         AR: "✓ الملف معتمد" },
  preview:       { FR: "Aperçu en direct",          EN: "Live preview",            AR: "معاينة مباشرة" },
  previewNote:   { FR: "Votre page telle qu'elle apparaîtra aux investisseurs", EN: "Your page as it will appear to investors", AR: "صفحتك كما ستظهر للمستثمرين" },

  // Sections
  sec1:          { FR: "1. Identité visuelle",      EN: "1. Visual identity",      AR: "1. الهوية البصرية" },
  sec2:          { FR: "2. Pitch film",             EN: "2. Pitch film",           AR: "2. فيلم العرض" },
  sec3:          { FR: "3. Contenu de la campagne", EN: "3. Campaign content",     AR: "3. محتوى الحملة" },

  // Fields
  catchphrase:   { FR: "Accroche principale *",     EN: "Main catchphrase *",      AR: "العبارة الرئيسية *" },
  catchPH:       { FR: "Ex: Nourrir le Maroc de demain grâce à l'IA", EN: "E.g. Feeding tomorrow's Morocco through AI", AR: "مثال: إطعام المغرب الغد بفضل الذكاء الاصطناعي" },
  catchHint:     { FR: "Max 80 caractères — cette phrase apparaît sur votre carte campagne.", EN: "Max 80 characters — this line appears on your campaign card.", AR: "80 حرفاً كحد أقصى — تظهر هذه الجملة على بطاقة حملتك." },
  catchStyle:    { FR: "Style de l'accroche",       EN: "Catchphrase style",        AR: "أسلوب العبارة" },
  catchFontLbl:  { FR: "Police",                    EN: "Font",                     AR: "الخط" },
  catchColorLbl: { FR: "Couleur du texte",          EN: "Text colour",              AR: "لون النص" },
  logoSizeLbl:   { FR: "Taille du logo",            EN: "Logo size",                AR: "حجم الشعار" },
  logo:          { FR: "Logo de la société",        EN: "Company logo",            AR: "شعار الشركة" },
  cover:         { FR: "Image de couverture",       EN: "Cover image",             AR: "صورة الغلاف" },
  coverColor:    { FR: "Ou choisissez une couleur de fond", EN: "Or choose a background colour", AR: "أو اختر لون خلفية" },
  uploadLogo:    { FR: "Choisir un logo",           EN: "Choose logo",             AR: "اختر شعاراً" },
  uploadCover:   { FR: "Choisir une image",         EN: "Choose image",            AR: "اختر صورة" },
  uploaded:      { FR: "✓ Téléchargé",              EN: "✓ Uploaded",              AR: "✓ تم الرفع" },

  filmUrl:       { FR: "Lien YouTube / Vimeo",      EN: "YouTube / Vimeo link",    AR: "رابط YouTube / Vimeo" },
  filmUrlPH:     { FR: "https://youtube.com/watch?v=…", EN: "https://youtube.com/watch?v=…", AR: "https://youtube.com/watch?v=…" },
  filmOr:        { FR: "ou téléchargez le fichier directement", EN: "or upload the file directly", AR: "أو ارفع الملف مباشرة" },
  filmUpload:    { FR: "Choisir un fichier vidéo",  EN: "Choose video file",       AR: "اختر ملف فيديو" },
  filmNote:      { FR: "Formats acceptés : MP4, MOV, AVI. Durée recommandée : 2–4 minutes. EMERGE vérifiera l'exactitude des déclarations avant publication.", EN: "Accepted formats: MP4, MOV, AVI. Recommended duration: 2–4 minutes. EMERGE will verify the accuracy of statements before publication.", AR: "الصيغ المقبولة: MP4، MOV، AVI. المدة الموصى بها: 2–4 دقائق. ستتحقق EMERGE من دقة التصريحات قبل النشر." },
  filmAuthor:    { FR: "⚠ Vous êtes l'auteur de ce film et en assumez la responsabilité. EMERGE fournit les outils, pas le contenu.", EN: "⚠ You are the author of this film and bear responsibility for it. EMERGE provides the tools, not the content.", AR: "⚠ أنت مؤلف هذا الفيلم وتتحمل مسؤوليته. EMERGE توفر الأدوات، لا المحتوى." },

  about:         { FR: "À propos de la campagne *", EN: "About the campaign *",    AR: "حول الحملة *" },
  aboutPH:       { FR: "Décrivez votre campagne, ce que vous levez et pourquoi maintenant…", EN: "Describe your campaign, what you are raising and why now…", AR: "صف حملتك وما تجمعه ولماذا الآن…" },
  market:        { FR: "Opportunité de marché *",   EN: "Market opportunity *",    AR: "فرصة السوق *" },
  marketPH:      { FR: "Taille du marché, croissance, positionnement concurrentiel…", EN: "Market size, growth, competitive positioning…", AR: "حجم السوق، النمو، الموقع التنافسي…" },
  useFunds:      { FR: "Utilisation des fonds *",   EN: "Use of funds *",          AR: "استخدام الأموال *" },
  useFundsPH:    { FR: "Comment seront utilisés les fonds levés, par poste de dépense…", EN: "How the raised funds will be used, by spending category…", AR: "كيف ستُستخدم الأموال المجمعة، حسب بند الإنفاق…" },
  traction:      { FR: "Traction & réalisations clés", EN: "Traction & key achievements", AR: "الديناميكية والإنجازات الرئيسية" },
  tractionPH:    { FR: "Clients, revenus, partenaires, récompenses, brevets…", EN: "Customers, revenues, partners, awards, patents…", AR: "العملاء، الإيرادات، الشركاء، الجوائز، براءات الاختراع…" },

  submit:        { FR: "Soumettre pour vérification →", EN: "Submit for review →", AR: "تقديم للمراجعة ←" },
  incomplete:    { FR: "Veuillez remplir tous les champs obligatoires.", EN: "Please fill in all required fields.", AR: "يرجى ملء جميع الحقول الإلزامية." },

  // Submitted screen
  doneTitle:     { FR: "Campagne soumise pour vérification", EN: "Campaign submitted for review", AR: "الحملة مقدمة للمراجعة" },
  doneP1:        { FR: "Notre équipe va vérifier votre film de pitch et l'ensemble de votre contenu avant la mise en ligne. Vous recevrez une confirmation sous 2 à 5 jours ouvrables.", EN: "Our team will verify your pitch film and all your content before going live. You will receive confirmation within 2 to 5 business days.", AR: "سيتحقق فريقنا من فيلم عرضك وجميع محتواك قبل الإطلاق. ستتلقى تأكيداً خلال 2 إلى 5 أيام عمل." },
  doneBtn:       { FR: "Voir mon tableau de bord",  EN: "View my dashboard",       AR: "عرض لوحة التحكم" },

  // Preview labels
  invest:        { FR: "Investir",                  EN: "Invest",                  AR: "استثمر" },
  daysLeft:      { FR: "jours restants",            EN: "days left",               AR: "يوم متبقٍ" },
  investors:     { FR: "investisseurs",             EN: "investors",               AR: "مستثمر" },
  minT:          { FR: "Ticket min.",               EN: "Min. ticket",             AR: "الحد الأدنى" },
  teamLabel:     { FR: "L'équipe",                  EN: "The team",                AR: "الفريق" },
  scoreLbl:      { FR: "Score EMERGE",              EN: "EMERGE Score",            AR: "نقاط EMERGE" },
  verifiedLbl:   { FR: "EMERGE Vérifié",            EN: "EMERGE Verified",         AR: "EMERGE موثّق" },
  shariaLbl:     { FR: "Conforme Charia",           EN: "Sharia compliant",        AR: "متوافق شرعياً" },
};

// ─── Colour Wheel Button Icon (decorative, wraps native input) ────────────────
function ColourWheelIcon({ size = 32 }: { size?: number }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 1;
  const rings = 5;
  const segs = 36;
  const f = (n: number) => Math.round(n * 100) / 100;
  const paths: React.ReactElement[] = [];
  for (let ri = 0; ri < rings; ri++) {
    const rOuter = f(r * ((rings - ri) / rings));
    const rInner = f(r * ((rings - ri - 1) / rings));
    for (let si = 0; si < segs; si++) {
      const hue = Math.round((si / segs) * 360 + ri * (360 / segs / rings));
      const lit = Math.round(35 + (ri / (rings - 1)) * 30);
      const sat = 100 - ri * 8;
      const a1 = (si / segs) * Math.PI * 2 - Math.PI / 2;
      const a2 = ((si + 1) / segs) * Math.PI * 2 - Math.PI / 2;
      const x1o = f(cx + rOuter * Math.cos(a1)), y1o = f(cy + rOuter * Math.sin(a1));
      const x2o = f(cx + rOuter * Math.cos(a2)), y2o = f(cy + rOuter * Math.sin(a2));
      const x1i = f(cx + rInner * Math.cos(a1)), y1i = f(cy + rInner * Math.sin(a1));
      const x2i = f(cx + rInner * Math.cos(a2)), y2i = f(cy + rInner * Math.sin(a2));
      paths.push(
        <path key={`${ri}-${si}`} suppressHydrationWarning
          d={`M${x1i},${y1i} L${x1o},${y1o} A${rOuter},${rOuter} 0 0 1 ${x2o},${y2o} L${x2i},${y2i} A${rInner},${rInner} 0 0 0 ${x1i},${y1i}Z`}
          fill={`hsl(${hue},${sat}%,${lit}%)`} stroke="none" />
      );
    }
  }
  paths.push(<circle key="c" cx={cx} cy={cy} r={f(r * 0.08)} fill="white" />);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} suppressHydrationWarning
      style={{ display: "block", borderRadius: "50%", pointerEvents: "none" }}>
      {paths}
    </svg>
  );
}

// ─── Catchphrase font options ────────────────────────────────────────────────
const fontOptions = [
  { value: "Plus Jakarta Sans",          label: "Jakarta",  sample: "Aa" },
  { value: "Georgia, serif",             label: "Serif",    sample: "Aa" },
  { value: "monospace",                  label: "Mono",     sample: "Aa" },
  { value: "'Trebuchet MS', sans-serif", label: "Trebuchet",sample: "Aa" },
  { value: "'Lucida Handwriting', 'Comic Sans MS', cursive", label: "Handwriting", sample: "Aa" },
];

// ─── Camera Recording Modal ───────────────────────────────────────────────────
function CameraModal({ lang, onClose, onSave }: { lang: Lang; onClose: () => void; onSave: (filename: string, objectUrl: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [status, setStatus] = useState<"idle" | "streaming" | "recording" | "done" | "error">("idle");
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setStatus("streaming");
    } catch (e) {
      setError(lang === "FR" ? "Accès à la caméra refusé ou non disponible." : lang === "AR" ? "تم رفض الوصول إلى الكاميرا أو غير متوفرة." : "Camera access denied or unavailable.");
      setStatus("error");
    }
  }, [lang]);

  const startRecording = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (!stream) return;
    chunksRef.current = [];
    const mr = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9,opus" });
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const objectUrl = URL.createObjectURL(blob);
      const ts = new Date().toISOString().slice(0,19).replace(/:/g,"-");
      onSave(`pitch_${ts}.webm`, objectUrl);
    };
    mr.start();
    mediaRecorderRef.current = mr;
    setStatus("recording");
    setCountdown(0);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
    setStatus("done");
  };

  useEffect(() => {
    startCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(t => t.stop());
    };
  }, [startCamera]);

  // Recording timer
  useEffect(() => {
    if (status !== "recording") return;
    const iv = setInterval(() => setCountdown(n => n + 1), 1000);
    return () => clearInterval(iv);
  }, [status]);

  const fmtTime = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const labels = {
    title:    { FR: "Enregistrer votre pitch film",  EN: "Record your pitch film",         AR: "تسجيل فيلم عرضك" },
    start:    { FR: "Démarrer l'enregistrement",     EN: "Start recording",                AR: "بدء التسجيل" },
    stop:     { FR: "Arrêter l'enregistrement",      EN: "Stop recording",                 AR: "إيقاف التسجيل" },
    cancel:   { FR: "Annuler",                       EN: "Cancel",                         AR: "إلغاء" },
    done:     { FR: "Enregistrement sauvegardé ✓",   EN: "Recording saved ✓",              AR: "تم حفظ التسجيل ✓" },
    doneNote: { FR: "Votre film a été enregistré.",  EN: "Your film has been saved.",       AR: "تم حفظ فيلمك." },
    close:    { FR: "Fermer",                        EN: "Close",                          AR: "إغلاق" },
    hint:     { FR: "Durée recommandée : 2 à 4 minutes.", EN: "Recommended duration: 2 to 4 minutes.", AR: "المدة الموصى بها: 2 إلى 4 دقائق." },
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={e => { if (e.target === e.currentTarget) { const stream = videoRef.current?.srcObject as MediaStream; stream?.getTracks().forEach(t => t.stop()); onClose(); } }}>
      <div style={{ background: "#0f1923", borderRadius: "18px", padding: "1.5rem", width: "100%", maxWidth: "600px", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", margin: 0 }}>{labels.title[lang]}</h3>
          <button onClick={() => { const stream = videoRef.current?.srcObject as MediaStream; stream?.getTracks().forEach(t => t.stop()); onClose(); }}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "1.1rem" }}>✕</button>
        </div>

        {/* Video preview */}
        <div style={{ background: "#000", borderRadius: "10px", overflow: "hidden", marginBottom: "1rem", position: "relative", aspectRatio: "16/9" }}>
          <video ref={videoRef} muted={status !== "recording"} style={{ width: "100%", height: "100%", objectFit: "cover", display: status === "done" ? "none" : "block" }} />
          {status === "recording" && (
            <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: "rgba(220,50,50,0.9)", color: "#fff", fontSize: "0.75rem", fontWeight: 700, padding: "4px 10px", borderRadius: "100px", display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ width: "7px", height: "7px", background: "#fff", borderRadius: "50%", animation: "pulse 1s infinite", display: "inline-block" }} />
              {fmtTime(countdown)}
            </div>
          )}
          {status === "idle" && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: "3rem" }}>📹</div>
          )}
          {status === "done" && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: "0.75rem", background: "#0f1923", borderRadius: "10px", minHeight: "180px" }}>
              <div style={{ fontSize: "2.5rem" }}>✅</div>
              <div style={{ color: "#5bbdd4", fontWeight: 700, fontSize: "0.9rem" }}>{labels.done[lang]}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>{labels.doneNote[lang]}</div>
            </div>
          )}
          {status === "error" && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "180px", color: "#e05c5c", fontSize: "0.82rem", textAlign: "center", padding: "1rem" }}>{error}</div>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {status === "streaming" && (
            <button onClick={startRecording}
              style={{ flex: 1, background: "#e05c5c", color: "#fff", border: "none", borderRadius: "8px", padding: "0.75rem", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              ● {labels.start[lang]}
            </button>
          )}
          {status === "recording" && (
            <button onClick={stopRecording}
              style={{ flex: 1, background: "#fff", color: "#e05c5c", border: "none", borderRadius: "8px", padding: "0.75rem", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              ■ {labels.stop[lang]}
            </button>
          )}
          {status === "done" && (
            <button onClick={() => { const stream = videoRef.current?.srcObject as MediaStream; stream?.getTracks().forEach(t => t.stop()); onClose(); }}
              style={{ flex: 1, background: "linear-gradient(135deg,#5bbdd4,#2a4a7a)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.75rem", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>
              {labels.close[lang]}
            </button>
          )}
          {(status === "streaming" || status === "recording") && (
            <button onClick={() => { const stream = videoRef.current?.srcObject as MediaStream; stream?.getTracks().forEach(t => t.stop()); onClose(); }}
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "none", borderRadius: "8px", padding: "0.75rem 1rem", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}>
              {labels.cancel[lang]}
            </button>
          )}
        </div>

        {status !== "done" && status !== "error" && (
          <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", marginTop: "0.75rem", textAlign: "center", margin: "0.75rem 0 0" }}>{labels.hint[lang]}</p>
        )}
      </div>
    </div>
  );
}

// ─── Live Preview Component ───────────────────────────────────────────────────
function LivePreview({ form, lang }: { form: CampaignForm; lang: Lang }) {
  const d = approvedDossier;
  const catch_ = form.catchphrase || (lang === "FR" ? "Votre accroche apparaîtra ici…" : lang === "AR" ? "ستظهر عبارتك هنا…" : "Your catchphrase will appear here…");
  const bg = form.coverColor || coverColors[0].value;
  const hasAbout = form.aboutCampaign.length > 0;
  const hasMarket = form.marketOpportunity.length > 0;
  const hasFunds = form.useOfFunds.length > 0;
  const hasTraction = form.traction.length > 0;

  return (
    <div style={{ background: "#f0f2f5", borderRadius: "16px", overflow: "hidden", border: "1px solid #e0e4e8" }}>
      {/* Hero */}
      <div style={{ background: form.coverDataUrl ? `url(${form.coverDataUrl}) center/cover no-repeat` : bg, minHeight: "200px", padding: "2rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", justifyContent: "flex-end", position: "relative" }}>
        {/* Dark overlay when cover image is set */}
        {form.coverDataUrl && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />}
        {/* Logo */}
        {(() => {
          const sz = ({ S: "32px", M: "44px", L: "60px" } as Record<string,string>)[form.logoSize] || "44px";
          return (
            <div style={{ position: "absolute", top: "1rem", left: "1rem", width: sz, height: sz, borderRadius: "10px", background: form.logoDataUrl ? "transparent" : "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", overflow: "hidden", zIndex: 1, transition: "all 0.2s" }}>
              {form.logoDataUrl
                ? <img src={form.logoDataUrl} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                : "🏢"}
            </div>
          );
        })()}
        {/* Badges */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "0.75rem", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
          <span style={{ background: d.tagBg, color: d.tagColor, fontSize: "0.6rem", fontWeight: 800, padding: "2px 8px", borderRadius: "100px" }}>{d.tag[lang]}</span>
          {d.verified && <span style={{ background: "rgba(91,189,212,0.2)", color: "#5bbdd4", fontSize: "0.6rem", fontWeight: 700, padding: "2px 8px", borderRadius: "100px", border: "1px solid rgba(91,189,212,0.4)" }}>✓ {ui.verifiedLbl[lang]}</span>}
          {d.sharia && <span style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", fontSize: "0.6rem", fontWeight: 700, padding: "2px 8px", borderRadius: "100px" }}>☪ {ui.shariaLbl[lang]}</span>}
        </div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", marginBottom: "0.35rem", lineHeight: 1.2, position: "relative", zIndex: 1 }}>{d.company}</h3>
        <p style={{ fontSize: "0.75rem", color: form.catchColor || "rgba(255,255,255,0.8)", lineHeight: 1.4, margin: 0, fontStyle: form.catchItalic ? "italic" : catch_.includes("…") || catch_.includes("ici") ? "italic" : "normal", fontWeight: form.catchBold ? 800 : 400, fontFamily: form.catchFont || "inherit", position: "relative", zIndex: 1, transition: "all 0.2s" }}>{catch_}</p>
      </div>

      {/* Funding progress */}
      <div style={{ background: "#fff", padding: "1rem 1.25rem", borderBottom: "1px solid #f0f2f5" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#6b7a8d", marginBottom: "0.35rem" }}>
          <span style={{ fontWeight: 700, color: "#0f1923" }}>{d.raised}</span>
          <span>{d.pct}% · {d.days} {ui.daysLeft[lang]}</span>
        </div>
        <div style={{ background: "#f0f2f5", borderRadius: "4px", height: "6px" }}>
          <div style={{ width: `${d.pct}%`, height: "6px", borderRadius: "4px", background: "linear-gradient(90deg,#5bbdd4,#2a4a7a)" }} />
        </div>
      </div>

      {/* Pitch film placeholder */}
      <div style={{ background: "#0f1923", margin: "1rem 1.25rem", borderRadius: "10px", overflow: "hidden", minHeight: "110px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "6px" }}>
        {form.filmDataUrl ? (
          <video src={form.filmDataUrl} controls style={{ width: "100%", borderRadius: "10px", display: "block", maxHeight: "180px" }} />
        ) : form.filmUrl ? (
          <a href={form.filmUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", textDecoration: "none" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(91,189,212,0.2)", border: "2px solid #5bbdd4", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#5bbdd4", fontSize: "0.9rem" }}>▶</span>
            </div>
            <span style={{ fontSize: "0.68rem", color: "#5bbdd4", fontWeight: 600 }}>{lang === "FR" ? "Ouvrir le lien →" : lang === "AR" ? "فتح الرابط ←" : "Open link →"}</span>
          </a>
        ) : form.filmFile ? (
          <>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(91,189,212,0.2)", border: "2px solid #5bbdd4", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#5bbdd4", fontSize: "0.9rem" }}>▶</span>
            </div>
            <span style={{ fontSize: "0.68rem", color: "#5bbdd4", fontWeight: 600 }}>{form.filmFile}</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: "1.5rem", opacity: 0.3 }}>🎬</span>
            <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{lang === "FR" ? "Film de pitch — à renseigner" : lang === "AR" ? "فيلم العرض — للإضافة" : "Pitch film — to be added"}</span>
          </>
        )}
      </div>

      {/* Content sections */}
      <div style={{ padding: "0 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {[
          [ui.about[lang].replace(" *",""), form.aboutCampaign, hasAbout],
          [ui.market[lang].replace(" *",""), form.marketOpportunity, hasMarket],
          [ui.useFunds[lang].replace(" *",""), form.useOfFunds, hasFunds],
          [ui.traction[lang], form.traction, hasTraction],
        ].map(([label, content, has]) => (
          <div key={label as string} style={{ background: has ? "#f8f9fb" : "transparent", border: `1px solid ${has ? "#e8ecf0" : "#f0f2f5"}`, borderRadius: "8px", padding: "0.75rem" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#8a96a3", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: has ? "0.35rem" : 0 }}>{label as string}</div>
            {has ? (
              <p style={{ fontSize: "0.75rem", color: "#4a5568", lineHeight: 1.6, margin: 0 }}>{(content as string).slice(0, 120)}{(content as string).length > 120 ? "…" : ""}</p>
            ) : (
              <p style={{ fontSize: "0.72rem", color: "#c0c8d0", fontStyle: "italic", margin: 0 }}>{lang === "FR" ? "À compléter…" : lang === "AR" ? "للإكمال…" : "To be completed…"}</p>
            )}
          </div>
        ))}

        {/* Score + team */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
          <div style={{ background: "#edf7f0", borderRadius: "8px", padding: "0.75rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "#6b7a8d", textTransform: "uppercase", marginBottom: "2px" }}>{ui.scoreLbl[lang]}</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: d.scoreColor }}>{d.score}</div>
            <div style={{ fontSize: "0.55rem", color: "#8a96a3" }}>/100</div>
          </div>
          <div style={{ background: "#f8f9fb", borderRadius: "8px", padding: "0.75rem" }}>
            <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "#6b7a8d", textTransform: "uppercase", marginBottom: "6px" }}>{ui.teamLabel[lang]}</div>
            {d.team.map(m => (
              <div key={m.name} style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.45rem", color: "#fff", fontWeight: 700, flexShrink: 0 }}>{m.initials}</div>
                <div>
                  <div style={{ fontSize: "0.62rem", fontWeight: 600, color: "#0f1923", lineHeight: 1 }}>{m.name}</div>
                  <div style={{ fontSize: "0.55rem", color: "#8a96a3", lineHeight: 1 }}>{m.role[lang]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invest button */}
        <button style={{ width: "100%", background: "linear-gradient(135deg,#5bbdd4,#2a4a7a)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.7rem", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}>
          {ui.invest[lang]} · {d.minTicket} {ui.minT[lang]}
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CampaignBuilder() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];
  const [stage, setStage] = useState<Stage>("builder");
  const [error, setError] = useState(false);

  const [form, setForm] = useState<CampaignForm>({
    catchphrase: "", catchFont: "Plus Jakarta Sans", catchColor: "#ffffff", catchBold: false, catchItalic: false, logoSize: "M",
    filmUrl: "", filmFile: "", filmDataUrl: "", aboutCampaign: "",
    marketOpportunity: "", useOfFunds: "", traction: "",
    logoFile: "", logoDataUrl: "", coverFile: "", coverDataUrl: "", coverColor: coverColors[0].value,
  });

  const [customColor, setCustomColor] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [selectedSwatchColor, setSelectedSwatchColor] = useState("");
  const set = (k: keyof CampaignForm, v: string) => setForm(f => ({ ...f, [k]: v }));

  const readFile = (file: File, key: "logoDataUrl" | "coverDataUrl", nameKey: "logoFile" | "coverFile") => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setForm(f => ({ ...f, [key]: url, [nameKey]: file.name }));
    };
    reader.readAsDataURL(file);
  };

  const applyCustomColor = (raw: string) => {
    const v = raw.trim();
    if (!v) return;
    // Accept hex (#rrggbb or #rgb) or rgb(...)
    const isHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v);
    const isRgb = /^rgb\(/.test(v);
    if (isHex || isRgb) {
      set("coverColor", `linear-gradient(160deg,${v} 0%,${v} 100%)`);
    }
  };

  const flags: Record<string, string> = {
    FR: "/img/flag_fr.png", AR: "/img/flag_ar.png", EN: "/img/flag_en.png",
  };

  const required = form.catchphrase && form.aboutCampaign && form.marketOpportunity && form.useOfFunds && (form.filmUrl || form.filmFile);

  const handleSubmit = () => {
    if (!required) { setError(true); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setError(false);
    setStage("submitted");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "0.7rem 0.9rem", borderRadius: "8px", border: "1.5px solid #e8ecf0", fontSize: "0.85rem", color: "#0f1923", background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#4a5568", marginBottom: "0.4rem" };
  const sectionStyle: React.CSSProperties = { background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "1.5rem", marginBottom: "1rem" };
  const sectionTitleStyle: React.CSSProperties = { fontSize: "0.88rem", fontWeight: 800, color: "#0f1923", marginBottom: "1.1rem", paddingBottom: "0.6rem", borderBottom: "2px solid #eaf6fb" };

  if (stage === "submitted") {
    return (
      <main dir={t.dir} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8f9fb", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>

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
        <div style={{ maxWidth: "520px", padding: "2rem", textAlign: "center" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg,#5bbdd4,#2a4a7a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 1.5rem" }}>✓</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f1923", marginBottom: "0.75rem" }}>{ui.doneTitle[lang]}</h1>
          <p style={{ fontSize: "0.88rem", color: "#6b7a8d", lineHeight: 1.75, marginBottom: "2rem" }}>{ui.doneP1[lang]}</p>
          <Link href="/status" style={{ background: "linear-gradient(135deg,#5bbdd4,#2a4a7a)", color: "#fff", padding: "0.9rem 2rem", borderRadius: "10px", fontSize: "0.95rem", fontWeight: 700, textDecoration: "none" }}>
            {ui.doneBtn[lang]}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main dir={t.dir} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8f9fb", color: "#0f1923", fontSize: "15px", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{ background: "#0f1923", padding: "0 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "64px", position: "sticky", top: 0, zIndex: 100 }}>
        <img src="/img/logo_emerge_cropped.png" alt="Emerge Capital" width={70} style={{ height: "auto", objectFit: "contain" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ background: "rgba(91,189,212,0.2)", color: "#5bbdd4", fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "100px", border: "1px solid rgba(91,189,212,0.5)" }}>{ui.approved[lang]}</div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {(["FR", "AR", "EN"] as const).filter(l => l !== lang).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <img src={flags[l]} alt={l} width={32} height={22} style={{ borderRadius: "4px", display: "block" }} />
            </button>
          ))}
        </div>
      </nav>

      {/* HEADER */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8ecf0", padding: "2rem 3rem" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eaf6fb", color: "#2a6a8a", padding: "0.35rem 0.9rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.6rem", border: "1px solid #c0e4f0" }}>
            🏢 {ui.badge[lang]}
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f1923", marginBottom: "0.4rem" }}>{ui.title[lang]}</h1>
          <p style={{ fontSize: "0.85rem", color: "#6b7a8d", lineHeight: 1.6 }}>{ui.subtitle[lang]}</p>
        </div>
      </div>

      {/* SPLIT LAYOUT */}
      <div className="emerge-builder-grid" style={{ maxWidth: "1300px", margin: "0 auto", padding: "2rem", display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem", alignItems: "start" }}>

        {/* LEFT — FORM */}
        <div>
          {error && (
            <div style={{ background: "#fdf0f0", border: "1px solid #f0b0b0", borderRadius: "10px", padding: "0.9rem 1.1rem", marginBottom: "1rem", fontSize: "0.82rem", color: "#c0392b" }}>
              ⚠ {ui.incomplete[lang]}
            </div>
          )}

          {/* Section 1 — Visual identity */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>{ui.sec1[lang]}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* Catchphrase */}
              <div>
                <label style={labelStyle}>{ui.catchphrase[lang]}</label>
                <input style={{ ...inputStyle, border: `1.5px solid ${error && !form.catchphrase ? "#e05c5c" : "#e8ecf0"}` }}
                  value={form.catchphrase} maxLength={80}
                  onChange={e => set("catchphrase", e.target.value)}
                  placeholder={ui.catchPH[lang]} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3px" }}>
                  <span style={{ fontSize: "0.7rem", color: "#8a96a3" }}>{ui.catchHint[lang]}</span>
                  <span style={{ fontSize: "0.7rem", color: form.catchphrase.length > 70 ? "#d4870a" : "#8a96a3" }}>{form.catchphrase.length}/80</span>
                </div>
              </div>

              {/* Catchphrase style controls */}
              <div style={{ background: "#f8f9fb", borderRadius: "10px", padding: "0.9rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em" }}>{ui.catchStyle[lang]}</div>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                  {/* Font */}
                  <div style={{ flex: 1, minWidth: "120px" }}>
                    <label style={{ ...labelStyle, fontSize: "0.7rem" }}>{ui.catchFontLbl[lang]}</label>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {fontOptions.map(f => (
                        <button key={f.value} onClick={() => set("catchFont", f.value)} title={f.label}
                          style={{ flex: 1, padding: "5px 4px", borderRadius: "6px", border: `1.5px solid ${form.catchFont === f.value ? "#2a4a7a" : "#e8ecf0"}`, background: form.catchFont === f.value ? "#eaf6fb" : "#fff", cursor: "pointer", fontSize: "0.72rem", fontFamily: f.value, fontWeight: 600, color: form.catchFont === f.value ? "#2a4a7a" : "#6b7a8d" }}>
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Bold / Italic */}
                  <div>
                    <label style={{ ...labelStyle, fontSize: "0.7rem" }}>B / I</label>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button onClick={() => setForm(f => ({ ...f, catchBold: !f.catchBold }))}
                        style={{ width: "32px", height: "32px", borderRadius: "6px", border: `1.5px solid ${form.catchBold ? "#2a4a7a" : "#e8ecf0"}`, background: form.catchBold ? "#eaf6fb" : "#fff", cursor: "pointer", fontWeight: 900, fontSize: "0.88rem", color: form.catchBold ? "#2a4a7a" : "#6b7a8d" }}>B</button>
                      <button onClick={() => setForm(f => ({ ...f, catchItalic: !f.catchItalic }))}
                        style={{ width: "32px", height: "32px", borderRadius: "6px", border: `1.5px solid ${form.catchItalic ? "#2a4a7a" : "#e8ecf0"}`, background: form.catchItalic ? "#eaf6fb" : "#fff", cursor: "pointer", fontStyle: "italic", fontSize: "0.88rem", color: form.catchItalic ? "#2a4a7a" : "#6b7a8d" }}>I</button>
                    </div>
                  </div>
                  {/* Text colour */}
                  <div>
                    <label style={{ ...labelStyle, fontSize: "0.7rem" }}>{ui.catchColorLbl[lang]}</label>
                    <div style={{ display: "flex", gap: "4px", alignItems: "center", flexWrap: "wrap" }}>
                      {["#ffffff","#5bbdd4","#f0e68c","#ffa07a","#90ee90","#0f1923","#ffb347","#c8a2c8"].map(col => (
                        <button key={col} onClick={() => set("catchColor", col)}
                          style={{ width: "22px", height: "22px", borderRadius: "50%", background: col, border: form.catchColor === col ? "2.5px solid #2a4a7a" : "1.5px solid #e8ecf0", cursor: "pointer", outline: form.catchColor === col ? "2px solid rgba(42,74,122,0.3)" : "none", outlineOffset: "1px", flexShrink: 0, transition: "transform 0.15s" }}
                          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.15)")}
                          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                      ))}
                      {/* Divider */}
                      <div style={{ width: "1px", height: "16px", background: "#e8ecf0", flexShrink: 0 }} />
                      {/* Live preview chip */}
                      <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: form.catchColor, border: "1.5px solid #e8ecf0", flexShrink: 0 }} />
                      {/* Hex input */}
                      <input value={form.catchColor} onChange={e => set("catchColor", e.target.value)}
                        placeholder="#ffffff"
                        style={{ width: "72px", padding: "0.3rem 0.4rem", borderRadius: "6px", border: "1.5px solid #e8ecf0", fontSize: "0.7rem", fontFamily: "monospace", outline: "none", color: "#0f1923" }} />
                      {/* Wheel picker */}
                      <label style={{ width: "22px", height: "22px", borderRadius: "50%", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1.5px solid #e8ecf0", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
                        title="Custom colour">
                        <ColourWheelIcon size={20} />
                        <input type="color" value={form.catchColor}
                          onChange={e => set("catchColor", e.target.value)}
                          style={{ position: "absolute", opacity: 0, width: "22px", height: "22px", cursor: "pointer" }} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo + Cover in a grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>{ui.logo[lang]}</label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0.7rem 0.9rem", borderRadius: "8px", border: `1.5px solid ${form.logoFile ? "#2a7a4a" : "#e8ecf0"}`, background: form.logoFile ? "#edf7f0" : "#f8f9fb", cursor: "pointer", fontSize: "0.8rem", color: form.logoFile ? "#2a7a4a" : "#4a5568", fontWeight: form.logoFile ? 600 : 400 }}>
                    <span>{form.logoFile ? "✓" : "🖼"}</span>
                    <span>{form.logoFile ? form.logoFile.slice(0, 16) + (form.logoFile.length > 16 ? "…" : "") : ui.uploadLogo[lang]}</span>
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) readFile(e.target.files[0], "logoDataUrl", "logoFile"); }} />
                  </label>
                </div>
                <div>
                  <label style={labelStyle}>{ui.cover[lang]}</label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0.7rem 0.9rem", borderRadius: "8px", border: `1.5px solid ${form.coverFile ? "#2a7a4a" : "#e8ecf0"}`, background: form.coverFile ? "#edf7f0" : "#f8f9fb", cursor: "pointer", fontSize: "0.8rem", color: form.coverFile ? "#2a7a4a" : "#4a5568", fontWeight: form.coverFile ? 600 : 400 }}>
                    <span>{form.coverFile ? "✓" : "🖼"}</span>
                    <span>{form.coverFile ? form.coverFile.slice(0, 16) + (form.coverFile.length > 16 ? "…" : "") : ui.uploadCover[lang]}</span>
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) readFile(e.target.files[0], "coverDataUrl", "coverFile"); }} />
                  </label>
                </div>

              </div>

              {/* Logo size */}
              <div>
                <label style={labelStyle}>{ui.logoSizeLbl[lang]}</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {(["S", "M", "L"] as const).map(sz => (
                    <button key={sz} onClick={() => setForm(f => ({ ...f, logoSize: sz }))}
                      style={{ flex: 1, padding: "0.55rem", borderRadius: "8px", border: `1.5px solid ${form.logoSize === sz ? "#2a4a7a" : "#e8ecf0"}`, background: form.logoSize === sz ? "linear-gradient(135deg,rgba(91,189,212,0.08),rgba(42,74,122,0.08))" : "#f8f9fb", cursor: "pointer", fontSize: sz === "S" ? "0.7rem" : sz === "M" ? "0.82rem" : "0.95rem", fontWeight: 700, color: form.logoSize === sz ? "#2a4a7a" : "#6b7a8d" }}>
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover colour palette */}
              <div>
                <label style={labelStyle}>{ui.coverColor[lang]}</label>
                {/* Swatches + hex code + picker all on one line */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                  {coverColors.map(col => (
                    <button key={col.value} onClick={() => { set("coverColor", col.value); setSelectedSwatchColor(col.preview); setCustomColor(col.preview); }} title={col.label}
                      style={{ width: "28px", height: "28px", borderRadius: "6px", background: col.preview, border: form.coverColor === col.value ? "3px solid #5bbdd4" : "2px solid transparent", cursor: "pointer", flexShrink: 0, outline: form.coverColor === col.value ? "2px solid rgba(91,189,212,0.3)" : "none", outlineOffset: "2px", transition: "transform 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.12)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                  ))}
                  {/* Divider */}
                  <div style={{ width: "1px", height: "20px", background: "#e8ecf0", flexShrink: 0 }} />
                  {/* Colour preview chip */}
                  <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: customColor || "#1a3a6a", border: "1.5px solid #e8ecf0", flexShrink: 0 }} />
                  {/* Hex input */}
                  <input value={customColor} onChange={e => { setCustomColor(e.target.value); applyCustomColor(e.target.value); }}
                    placeholder="#1a3a6a"
                    style={{ width: "90px", padding: "0.4rem 0.5rem", borderRadius: "6px", border: "1.5px solid #e8ecf0", fontSize: "0.75rem", fontFamily: "monospace", outline: "none", color: "#0f1923" }} />
                  {/* Wheel picker */}
                  <label style={{ width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1.5px solid #e8ecf0", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}
                    title={lang === "FR" ? "Sélecteur de couleur" : lang === "AR" ? "منتقي الألوان" : "Colour picker"}>
                    <ColourWheelIcon size={26} />
                    <input type="color" defaultValue="#1a3a6a"
                      onChange={e => { const hex = e.target.value; setCustomColor(hex); setSelectedSwatchColor(hex); set("coverColor", `linear-gradient(135deg,${hex} 0%,${hex} 100%)`); }}
                      style={{ position: "absolute", opacity: 0, width: "28px", height: "28px", cursor: "pointer" }} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 — Pitch film */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>{ui.sec2[lang]}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={labelStyle}>{ui.filmUrl[lang]}</label>
                <input style={{ ...inputStyle, border: `1.5px solid ${error && !form.filmUrl && !form.filmFile ? "#e05c5c" : "#e8ecf0"}` }}
                  value={form.filmUrl} onChange={e => set("filmUrl", e.target.value)}
                  placeholder={ui.filmUrlPH[lang]} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ flex: 1, height: "1px", background: "#e8ecf0" }} />
                <span style={{ fontSize: "0.72rem", color: "#8a96a3" }}>{ui.filmOr[lang]}</span>
                <div style={{ flex: 1, height: "1px", background: "#e8ecf0" }} />
              </div>
              {/* Upload OR record */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0.7rem 0.9rem", borderRadius: "8px", border: `1.5px solid ${form.filmFile ? "#2a7a4a" : "#e8ecf0"}`, background: form.filmFile ? "#edf7f0" : "#f8f9fb", cursor: "pointer", fontSize: "0.82rem", color: form.filmFile ? "#2a7a4a" : "#4a5568", fontWeight: form.filmFile ? 600 : 400 }}>
                  🎬 {form.filmFile ? `✓ ${form.filmFile.slice(0,14)}${form.filmFile.length>14?"…":""}` : ui.filmUpload[lang]}
                  <input type="file" accept="video/*,.mp4,.mov,.avi" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) set("filmFile", e.target.files[0].name); }} />
                </label>
                <button onClick={() => setShowCamera(true)}
                  style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0.7rem 0.9rem", borderRadius: "8px", border: "1.5px solid #e8ecf0", background: "#f8f9fb", cursor: "pointer", fontSize: "0.82rem", color: "#4a5568", fontFamily: "inherit" }}>
                  📹 <span>{lang === "FR" ? "Enregistrer maintenant" : lang === "AR" ? "تسجيل الآن" : "Record now"}</span>
                </button>
              </div>
              <p style={{ fontSize: "0.7rem", color: "#8a96a3", margin: 0 }}>
                {lang === "FR" ? "Le bouton Enregistrer ouvre la caméra de votre appareil (PC, tablette ou téléphone)." : lang === "AR" ? "زر التسجيل يفتح كاميرا جهازك (حاسوب أو جهاز لوحي أو هاتف)." : "The Record button opens your device camera (PC, tablet or phone)."}
              </p>
              <p style={{ fontSize: "0.72rem", color: "#8a96a3", lineHeight: 1.55, margin: 0 }}>{ui.filmNote[lang]}</p>
              <div style={{ background: "#fff8e6", border: "1px solid #f0d090", borderRadius: "8px", padding: "0.7rem 0.9rem", fontSize: "0.72rem", color: "#7a6000", lineHeight: 1.5 }}>
                {ui.filmAuthor[lang]}
              </div>
            </div>
          </div>

          {/* Section 3 — Content */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>{ui.sec3[lang]}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {([
                ["aboutCampaign",       ui.about[lang],   ui.aboutPH[lang],   true],
                ["marketOpportunity",   ui.market[lang],  ui.marketPH[lang],  true],
                ["useOfFunds",          ui.useFunds[lang],ui.useFundsPH[lang],true],
                ["traction",            ui.traction[lang],ui.tractionPH[lang],false],
              ] as [keyof CampaignForm, string, string, boolean][]).map(([key, label, ph, req]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: "90px", resize: "vertical", border: `1.5px solid ${error && req && !form[key] ? "#e05c5c" : "#e8ecf0"}` }}
                    value={form[key]} onChange={e => set(key, e.target.value)}
                    placeholder={ph} />
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button onClick={handleSubmit}
            style={{ width: "100%", background: required ? "linear-gradient(135deg,#5bbdd4,#2a4a7a)" : "#c8d0d8", color: "#fff", border: "none", borderRadius: "12px", padding: "1rem", fontSize: "1rem", fontWeight: 700, cursor: required ? "pointer" : "not-allowed", transition: "background 0.3s" }}>
            {ui.submit[lang]}
          </button>
        </div>

        {/* RIGHT — LIVE PREVIEW */}
        <div className="emerge-preview-sticky" style={{ position: "sticky", top: "80px" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8a96a3", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "6px", height: "6px", background: "#5bbdd4", borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }} />
            {ui.preview[lang]}
          </div>
          <p style={{ fontSize: "0.72rem", color: "#8a96a3", marginBottom: "0.75rem" }}>{ui.previewNote[lang]}</p>
          <LivePreview form={form} lang={lang} />
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        </div>
      </div>

      {/* CAMERA RECORDING MODAL */}
      {showCamera && (
        <CameraModal lang={lang} onClose={() => setShowCamera(false)}
          onSave={(filename, objectUrl) => { setForm(f => ({ ...f, filmFile: filename, filmDataUrl: objectUrl })); setShowCamera(false); }} />
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
