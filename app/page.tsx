"use client";

import { useState, useEffect, useRef, FormEvent, ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════
   ①  الإعدادات
   ═══════════════════════════════════════════════════════════ */
const PHONE_DISPLAY = "01000000000";
const PHONE_INTL = "+201000000000";
const WA_NUMBER = "201000000000";
const WEB3_KEY = "PUT-YOUR-WEB3FORMS-KEY-HERE";

const AGENT_AR = "جراندير سبيسز";
const AGENT_EN = "Grandeur Spaces";
const AGENT_EMAIL = "info@example.com";

const wa = (m: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(m)}`;
const WA_MAIN = wa("مرحباً، أريد الاستفسار عن أسعار ماونتن فيو 1.1 اكستنشن بالتجمع الخامس");

const PRICE_NOTE =
  "جميع الأسعار والمساحات وأنظمة السداد المذكورة استرشادية وقابلة للتغيير وفقاً لتحديثات الشركة المطوّرة وتوافر الوحدات وقت الحجز، ولا تُعد عرضاً ملزماً.";

/* ═══════════════════════════════════════════════════════════
   ②  الوحدات — كل وحدة كاملة بسعرها وسدادها وجدية حجزها
   ═══════════════════════════════════════════════════════════ */
interface Unit {
  id: string; name: string; en: string; img: string;
  area: string; layout: string; price: string; plan: string;
  delivery: string; eoi: string; blurb: string; points: string[];
  ready: boolean;
}

const UNITS: Unit[] = [
  {
    id: "apt", name: "شقق ميلينيال", en: "Millennial Apartments",
    img: "/images/unit-apartments.webp",
    area: "140 م²", layout: "3 غرف", price: "14,500,000", plan: "تقسيط حتى 8 سنوات",
    delivery: "استلام خلال 6 أشهر", eoi: "100,000", ready: false,
    blurb: "أصغر وحدات المشروع وأسرعها في السوق — شقة عائلية كاملة داخل كمبوند مسوَّر مسلّم، بمقدم وتقسيط يخلّيها الأقرب للمشتري الأول في التجمع الخامس.",
    points: ["3 غرف نوم بمساحة 140 م²", "داخل مباني الطراز الأمريكي", "أقصر مدة استلام في المرحلة", "أقل جدية حجز معلنة"],
  },
  {
    id: "ivilla", name: "آي فيلا", en: "i-Villa Garden & Roof",
    img: "/images/gallery-6.webp",
    area: "215 : 265 م²", layout: "جاردن أو روف", price: "23,500,000", plan: "تقسيط حتى 8 سنوات",
    delivery: "استلام خلال 6 أشهر", eoi: "200,000", ready: false,
    blurb: "خصوصية الفيلا بسعر الشقة — الآي فيلا جاردن ليها حديقة خاصة على الأرض، والروف ليها سطح خاص بإطلالة مفتوحة على الفالي.",
    points: ["حديقة خاصة (جاردن) أو سطح خاص (روف)", "مساحات من 215 إلى 265 م²", "مدخل مستقل", "نفس نظام سداد الشقق"],
  },
  {
    id: "town", name: "تاون هاوس", en: "Town House",
    img: "/images/unit-villas.webp",
    area: "210 م²", layout: "3 أدوار", price: "38,000,000", plan: "تقسيط حتى 7 سنوات",
    delivery: "استلام فوري", eoi: "300,000", ready: true,
    blurb: "أول وحدة أرضية في المرحلة بالاستلام الفوري — تقدر تدخلها وتشوفها على الطبيعة النهاردة قبل ما تدفع جنيه.",
    points: ["استلام فوري Ready to Move", "حديقة أمامية وخلفية", "جاهزة للمعاينة على الطبيعة", "على شوارع الكمبوند الداخلية"],
  },
  {
    id: "villa", name: "فيلا مستقلة", en: "Luxury Villa",
    img: "/images/unit-palace.webp",
    area: "255 : 350 م²", layout: "حديقة خاصة", price: "55,000,000", plan: "تقسيط حتى 7 سنوات",
    delivery: "استلام فوري", eoi: "300,000", ready: true,
    blurb: "فيلا قائمة بذاتها بحديقة محيطة من كل الجهات، داخل كمبوند مسلّم ومسكون بالفعل — مش مرحلة على الورق ولا انتظار سنين.",
    points: ["استلام فوري Ready to Move", "حديقة محيطة من كل الجهات", "مساحات من 255 إلى 350 م²", "خصوصية كاملة"],
  },
  {
    id: "palace", name: "كراون بالاس", en: "Crown Palace",
    img: "/images/gallery-4.webp",
    area: "670 م²", layout: "نسخة محدودة", price: "200,000,000", plan: "نظام سداد خاص",
    delivery: "استلام فوري", eoi: "300,000", ready: true,
    blurb: "أكبر وأندر وحدات ماونتن فيو 1.1 — عدد محدود جداً بمواقع مختارة على الماستر بلان ونظام سداد بيتفصّل على الوحدة نفسها.",
    points: ["670 م² — أكبر وحدات المشروع", "نسخة محدودة العدد", "استلام فوري", "نظام سداد خاص بكل وحدة"],
  },
];

/* ═══════════════════════════════════════════════════════════
   ③  المحتوى
   ═══════════════════════════════════════════════════════════ */
const NAV = [
  { t: "المشروع", h: "#project" },
  { t: "الوحدات والأسعار", h: "#units" },
  { t: "الموقع", h: "#location" },
  { t: "الخدمات", h: "#amenities" },
  { t: "الصور", h: "#gallery" },
  { t: "أسئلة شائعة", h: "#faq" },
];

const BAND = [
  { v: "65", l: "فدان — كمبوند بوتيك" },
  { v: "5", l: "أنواع وحدات" },
  { v: "8", l: "سنوات تقسيط" },
  { v: "3", l: "أنواع استلام فوري" },
];

const LOC_NEAR = [
  { t: "طريق النصر", d: "مدخل المشروع على الطريق مباشرة" },
  { t: "ماونتن فيو 1", d: "ملاصق للكمبوند المسلّم" },
  { t: "التسعين الشمالي والجنوبي", d: "دقائق بالسيارة" },
  { t: "نادي الأهلي والفاميلي بارك", d: "على مسافة قريبة" },
  { t: "الجامعة الأمريكية ومدينة الرحاب", d: "على مسافة قريبة" },
  { t: "الطريق الدائري الشرقي", d: "وصول مباشر" },
];

const ZONES = [
  { t: "Grand Valley", d: "الفالي الكبير — قلب الكمبوند وأوسع مساحة خضراء" },
  { t: "Royal Garden", d: "حدائق مشجّرة وأماكن جلوس عائلية" },
  { t: "Corniche", d: "ممشى ممتد على طول المسطحات المائية" },
  { t: "Palace Island", d: "جزيرة القصور — أكبر الوحدات وأكثرها خصوصية" },
  { t: "The Park", d: "مرحلة مستقلة داخل المشروع" },
];

const AMENITIES = [
  { t: "كلوب هاوس خاص", d: "المركز الاجتماعي للكمبوند بأنشطة ولاونجات" },
  { t: "حمامات سباحة", d: "أحواض متعددة لكل الفئات العمرية" },
  { t: "مسارات مشي ودراجات", d: "ممشى وحارات دراجات آمنة وسط الخضرة" },
  { t: "مناطق ألعاب أطفال", d: "بلاي جراوند مؤمّنة داخل كل منطقة" },
  { t: "Event Lawn", d: "مساحة مفتوحة للمناسبات والتجمعات" },
  { t: "أكتيفيتي سنتر", d: "مركز أنشطة في كل فالي داخل المشروع" },
  { t: "ملاعب ومسجد", d: "ملاعب رياضية متعددة ومسجد داخل الكمبوند" },
  { t: "أمن 24/7", d: "بوابات مؤمّنة وحراسة على مدار الساعة" },
];

const WHY = [
  { t: "مجتمع قائم ومسكون — مش على الورق", d: "ماونتن فيو 1 اتسلّم من سنين وفيه آلاف العائلات ساكنة بالفعل. اكستنشن 1.1 امتداد مباشر ليه بنفس إدارة الكمبوند ونفس معايير التشطيب — تقدر تدخل تعاين على الطبيعة قبل ما تحجز." },
  { t: "استلام فوري فعلاً مش وعد", d: "التاون هاوس والفيلات المستقلة وكراون بالاس Ready to Move دلوقتي. ده بيلغي مخاطرة التأخير اللي بتقابل أي مشتري في مشروع تحت الإنشاء." },
  { t: "كمبوند بوتيك 65 فدان على الفالي", d: "المشروع مش كتلة أبراج — 65 فدان مقسّمة لخمس مناطق، وكل وحدة بتطل على الوادي أو المسطحات الخضراء والمائية، وده اللي بيحافظ على قيمة إعادة البيع." },
  { t: "موقع على طريق النصر مباشرة", d: "مدخل المشروع على الطريق نفسه، ودقايق من التسعين الشمالي والجنوبي ونادي الأهلي والجامعة الأمريكية، ووصول مباشر للدائري الشرقي." },
];

const GALLERY = [
  { src: "/images/gallery-1.webp", cap: "حمامات السباحة والمساحات الخضراء داخل الكمبوند" },
  { src: "/images/gallery-2.webp", cap: "إطلالة على الحديقة وحمام السباحة من إحدى الوحدات" },
  { src: "/images/gallery-3.webp", cap: "المساحات المفتوحة ومناطق الأنشطة العائلية" },
  { src: "/images/gallery-4.webp", cap: "الفيلات المطلة على المسطحات المائية" },
  { src: "/images/gallery-5.webp", cap: "شوارع الكمبوند والمراحل المسلّمة" },
  { src: "/images/gallery-6.webp", cap: "واجهات مباني الشقق على الطراز الأمريكي" },
];

const FAQ = [
  { q: "ما هي أسعار ماونتن فيو 1.1 اكستنشن بالتجمع الخامس؟", a: "تبدأ الأسعار الاسترشادية للمرحلة الثانية من حوالي 14.5 مليون جنيه لشقق ميلينيال (140 م² – 3 غرف)، والآي فيلا (215 : 265 م²) من 23.5 مليون، والتاون هاوس (210 م²) من 38 مليون، والفيلات المستقلة (255 : 350 م²) من 55 مليون، وكراون بالاس (670 م²) من 200 مليون كنسخة محدودة. الأسعار في تحديث مستمر — سجّل بياناتك لتصلك القائمة المحدثة." },
  { q: "ما هو نظام تقسيط ماونتن فيو 1.1؟", a: "الشقق والآي فيلا تقسيط حتى 8 سنوات باستلام خلال 6 أشهر، والتاون هاوس والفيلات المستقلة تقسيط حتى 7 سنوات باستلام فوري، وكراون بالاس بنظام سداد خاص. جدية الحجز المعلنة 100 ألف جنيه للشقق و200 ألف للآي فيلا و300 ألف للفيلات. قيمة المقدم وشروط التعاقد النهائية تتحدد من الشركة المطوّرة عند الحجز." },
  { q: "أين يقع ماونتن فيو 1.1 اكستنشن بالظبط؟", a: "في التجمع الخامس بالقاهرة الجديدة، على طريق النصر مباشرة وملاصق لكمبوند ماونتن فيو 1، وعلى بُعد دقائق من شارعي التسعين الشمالي والجنوبي ونادي الأهلي والفاميلي بارك والجامعة الأمريكية، مع وصول مباشر للطريق الدائري الشرقي." },
  { q: "كم مساحة المشروع وما هي مناطقه؟", a: "المشروع كمبوند بوتيك على مساحة 65 فداناً يطل على الرويال فالي، ومقسّم إلى خمس مناطق: Grand Valley و Royal Garden و Corniche و Palace Island و The Park." },
  { q: "هل توجد وحدات جاهزة للاستلام الفوري؟", a: "نعم. التاون هاوس والفيلات المستقلة وكراون بالاس متاحة بالاستلام الفوري (Ready to Move)، ويمكنك معاينتها على الطبيعة قبل الحجز. أما الشقق والآي فيلا فاستلامها خلال 6 أشهر." },
  { q: "ما هي الخدمات داخل الكمبوند؟", a: "كلوب هاوس خاص وحمامات سباحة لكل الأعمار ومسارات مشي وحارات دراجات ومناطق ألعاب أطفال و Event Lawn وأكتيفيتي سنتر في كل فالي وملاعب رياضية ومسجد ومحلات، مع أمن وحراسة على مدار الساعة وخدمات صيانة ونظافة." },
  { q: "من هي شركة ماونتن فيو للتطوير العقاري؟", a: "شركة تطوير عقاري مصرية تأسست عام 2005 وتتبع مجموعة دار المعمار (DMG)، ولها أكثر من 20 مشروعاً في شرق وغرب القاهرة والساحل الشمالي والبحر الأحمر. من أبرز مشروعاتها: ماونتن فيو iCity والتجمع الخامس وأكتوبر، وأليفا مستقبل سيتي، وماونتن فيو رأس الحكمة، وكينجزواي." },
];

const DIAL = ["EG +20", "SA +966", "AE +971", "KW +965", "QA +974", "OM +968", "BH +973"];

/* ═══════════════════════════════════════════════════════════ */
function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const el = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const n = el.current;
    if (!n) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    io.observe(n);
    return () => io.disconnect();
  }, []);
  return <div ref={el} className={`reveal ${on ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const N = ({ children }: { children: ReactNode }) => <span className="num">{children}</span>;

const WaIcon = ({ s = 17 }: { s?: number }) => (
  <svg viewBox="0 0 24 24" style={{ width: s, height: s }} className="fill-current shrink-0" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
);

/* ═══════════════════════════════════════════════════════════ */
export default function Home() {
  const [solid, setSolid] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [sel, setSel] = useState(0);
  const [faq, setFaq] = useState<number | null>(0);
  const [legal, setLegal] = useState(false);
  const [cookie, setCookie] = useState(false);
  const [pop, setPop] = useState(false);

  const [mSt, setMSt] = useState<"idle" | "sending" | "sent">("idle");
  const [pSt, setPSt] = useState<"idle" | "sending" | "sent">("idle");
  const [sSt, setSSt] = useState<"idle" | "sending" | "sent">("idle");
  const [mErr, setMErr] = useState("");
  const [pErr, setPErr] = useState("");
  const [sErr, setSErr] = useState("");
  const mForm = useRef<HTMLFormElement>(null);
  const pForm = useRef<HTMLFormElement>(null);
  const sForm = useRef<HTMLFormElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const f = () => setSolid(window.scrollY > 90);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => { try { if (!localStorage.getItem("mv_cookie_ok")) setCookie(true); } catch { setCookie(true); } }, []);

  useEffect(() => {
    try { if (sessionStorage.getItem("mv_pop_seen")) return; } catch { }
    const open = () => {
      if (fired.current) return;
      fired.current = true;
      try { sessionStorage.setItem("mv_pop_seen", "1"); } catch { }
      setPop(true);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0 && window.scrollY / h >= 0.55) open();
    };
    const t = setTimeout(open, 18000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); clearTimeout(t); };
  }, []);

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") { setLegal(false); setPop(false); setDrawer(false); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  function acceptCookies() {
    setCookie(false);
    try { localStorage.setItem("mv_cookie_ok", "1"); } catch { }
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (g) g("consent", "update", {
      ad_storage: "granted", ad_user_data: "granted",
      ad_personalization: "granted", analytics_storage: "granted",
    });
  }

  const hit = (n: string) => {
    const f = (window as unknown as Record<string, (() => void) | undefined>)[n];
    if (f) f();
  };
  const onWA = () => hit("trackWhatsapp");
  const onCall = () => hit("trackCall");

  async function send(
    ref: React.RefObject<HTMLFormElement | null>,
    setSt: (s: "idle" | "sending" | "sent") => void, setErr: (s: string) => void,
  ) {
    if (!ref.current) return false;
    const fd = new FormData(ref.current);
    if ((fd.get("company") as string)?.length) return false;
    setErr(""); setSt("sending");
    const body: Record<string, string> = { access_key: WEB3_KEY, from_name: AGENT_EN };
    fd.forEach((v, k) => { if (k !== "company") body[k] = v.toString(); });
    try {
      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!d.success) throw new Error();
      setSt("sent"); ref.current.reset(); hit("trackFormLead");
      return true;
    } catch {
      setSt("idle"); setErr("حصل خطأ في الإرسال. جرّب مرة تانية أو كلّمنا على واتساب.");
      return false;
    }
  }

  const u = UNITS[sel];

  return (
    <>
      {/* ═══ UTILITY BAR ═══ */}
      <div className="bg-coal text-white/70 text-[12px] py-2">
        <div className="mx-auto max-w-[1220px] px-5 flex items-center justify-between gap-4">
          <span className="hidden sm:inline">وكيل مبيعات معتمد — ماونتن فيو للتطوير العقاري</span>
          <span className="flex items-center gap-4 mx-auto sm:mx-0">
            <a href={`tel:${PHONE_INTL}`} onClick={onCall} className="no-underline hover:text-white num">{PHONE_DISPLAY}</a>
            <span className="text-white/25">|</span>
            <a href={WA_MAIN} target="_blank" rel="noopener" onClick={onWA} className="no-underline hover:text-white flex items-center gap-1.5"><WaIcon s={13} />واتساب</a>
          </span>
        </div>
      </div>

      {/* ═══ HEADER — light, goes solid on scroll ═══ */}
      <header className={`sticky top-0 z-90 transition-colors duration-200 ${solid ? "bg-white/97 backdrop-blur-md border-b border-line" : "bg-white border-b border-line"}`}>
        <div className="mx-auto max-w-[1220px] px-5 h-[68px] flex items-center gap-5">
          <a href="#top" className="flex items-center gap-3 shrink-0 no-underline">
            <span className="w-[3px] h-9 bg-cobalt block" />
            <span>
              <span className="block font-[family-name:var(--font-display)] text-[16px] font-extrabold text-coal leading-tight">
                ماونتن فيو <N>1.1</N>
              </span>
              <span className="block text-[10.5px] text-muted leading-tight tracking-wide">EXTENSION — NEW CAIRO</span>
            </span>
          </a>
          <nav className="hidden lg:flex gap-6 ms-auto">
            {NAV.map((n) => (
              <a key={n.h} href={n.h} className="text-[13.5px] text-muted hover:text-cobalt no-underline transition-colors whitespace-nowrap">{n.t}</a>
            ))}
          </nav>
          <a href="#lead" className="hidden md:inline-flex btn btn-cobalt !py-2.5 !px-5 !text-[13.5px] ms-auto lg:ms-0 shrink-0">اطلب قائمة الأسعار</a>
          <button onClick={() => setDrawer(!drawer)} aria-label="القائمة" aria-expanded={drawer} className="lg:hidden text-coal p-1.5 shrink-0 ms-auto md:ms-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
        {drawer && (
          <div className="lg:hidden bg-white border-t border-line px-5 pb-4">
            {NAV.map((n) => (
              <a key={n.h} href={n.h} onClick={() => setDrawer(false)} className="block py-3 text-[14.5px] text-coal no-underline border-b border-line">{n.t}</a>
            ))}
            <a href="#lead" onClick={() => setDrawer(false)} className="btn btn-cobalt w-full mt-4">اطلب قائمة الأسعار</a>
          </div>
        )}
      </header>

      {/* ═══ HERO — split, image at full brightness ═══ */}
      <section id="top" className="bg-white">
        <div className="mx-auto max-w-[1220px] px-5 grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-center py-12 lg:py-16">
          <div>
            <span className="label">المرحلة الثانية · استلام فوري</span>
            <h1 className="text-[clamp(30px,4.6vw,50px)] mb-5">
              ماونتن فيو <N>1.1</N> اكستنشن
              <span className="block text-cobalt text-[0.56em] font-bold mt-2">التجمع الخامس — طريق النصر</span>
            </h1>
            <p className="text-muted text-[15.5px] leading-[2] max-w-[56ch] mb-8">
              كمبوند بوتيك على <N>65</N> فداناً امتداداً لماونتن فيو <N>1</N> المسلّم والمأهول بالفعل.
              خمسة أنواع وحدات من الشقق للقصور، منها ثلاثة بالاستلام الفوري تقدر تعاينها على الطبيعة قبل الحجز.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <a href="#units" className="btn btn-cobalt">شوف الوحدات والأسعار</a>
              <a href={WA_MAIN} target="_blank" rel="noopener" onClick={onWA} className="btn btn-wa"><WaIcon />واتساب مباشر</a>
            </div>
            <div className="flex items-baseline gap-3 border-t border-line pt-6">
              <span className="text-muted text-[13px]">الأسعار تبدأ من</span>
              <span className="font-[family-name:var(--font-display)] font-extrabold text-[30px] text-cobalt leading-none"><N>14,500,000</N></span>
              <span className="text-muted text-[13px]">جنيه</span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[4px] bg-wash aspect-4/3 lg:aspect-3/2">
              <img src="/images/hero.webp" alt="ماونتن فيو 1.1 اكستنشن — التجمع الخامس" className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }} />
            </div>
            <div className="absolute -bottom-5 start-5 bg-cobalt text-white px-6 py-4 rounded-[4px] shadow-lg hidden sm:block">
              <div className="text-[11.5px] text-white/70 leading-none mb-1.5">وحدات جاهزة</div>
              <div className="font-[family-name:var(--font-display)] font-extrabold text-[19px] leading-none">استلام فوري</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STAT BAND ═══ */}
      <section className="bg-cobalt text-white">
        <div className="mx-auto max-w-[1220px] px-5 grid grid-cols-2 lg:grid-cols-4 divide-x divide-x-reverse divide-white/15">
          {BAND.map((b, i) => (
            <div key={i} className="py-7 px-5 text-center">
              <div className="font-[family-name:var(--font-display)] font-extrabold text-[30px] leading-none"><N>{b.v}</N></div>
              <div className="text-white/65 text-[12.5px] mt-2">{b.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ INLINE LEAD STRIP ═══ */}
      <section id="lead" className="bg-soft border-b border-line">
        <div className="mx-auto max-w-[1220px] px-5 py-8">
          {sSt === "sent" ? (
            <p className="text-center text-cobalt font-bold text-[16px] py-3">تم استلام طلبك — سيتواصل معك مستشار عقاري خلال <N>24</N> ساعة عمل.</p>
          ) : (
            <form ref={sForm} onSubmit={(e: FormEvent) => { e.preventDefault(); send(sForm, setSSt, setSErr); }}
              className="grid lg:grid-cols-[auto_1fr_1fr_1fr_auto] gap-3 items-center">
              <input type="text" name="company" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <input type="hidden" name="subject" value="Lead (strip) — ماونتن فيو 1.1 اكستنشن" />
              <p className="font-[family-name:var(--font-display)] font-bold text-[15px] whitespace-nowrap">
                اطلب قائمة الوحدات والأسعار
              </p>
              <input name="name" className="fld" placeholder="الاسم بالكامل *" required aria-label="الاسم" />
              <input name="phone" type="tel" dir="ltr" className="fld num" placeholder="01012345678 *" required aria-label="رقم الموبايل" />
              <select name="unit_type" className="fld" defaultValue="" aria-label="نوع الوحدة">
                <option value="">نوع الوحدة</option>
                {UNITS.map((x) => <option key={x.id} value={`${x.name} (${x.area})`}>{x.name} — {x.area}</option>)}
              </select>
              <button type="submit" disabled={sSt === "sending"} className="btn btn-cobalt whitespace-nowrap">
                {sSt === "sending" ? "جاري الإرسال…" : "ابعتلي القائمة"}
              </button>
              {sErr && <p className="lg:col-span-5 text-[13px] text-[#c0392b]">{sErr}</p>}
              <p className="lg:col-span-5 text-[11.5px] text-muted leading-[1.7]">
                بالضغط على إرسال أنت توافق على{" "}
                <button type="button" onClick={() => setLegal(true)} className="text-cobalt underline bg-transparent border-0 p-0 cursor-pointer font-[inherit] text-[inherit]">سياسة الخصوصية</button>.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ═══ PROJECT + DEVELOPER ═══ */}
      <section id="project" className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-[1220px] px-5 grid lg:grid-cols-[1.1fr_0.9fr] gap-12">
          <Reveal>
            <span className="label">عن المشروع والمطوّر</span>
            <h2 className="text-[clamp(22px,3.2vw,32px)] mb-5">امتداد لكمبوند مسلّم ومسكون — مش مرحلة على الورق</h2>
            <div className="text-muted text-[15px] leading-[2] space-y-4 max-w-[70ch]">
              <p>
                ماونتن فيو <N>1.1</N> اكستنشن هو المرحلة الثانية داخل كمبوند ماونتن فيو <N>1</N> بالتجمع الخامس،
                على مساحة <N>65</N> فداناً بإطلالة على الرويال فالي. الكمبوند الأصلي اتسلّم من سنين وفيه عائلات
                ساكنة بالفعل، يعني بتشتري داخل مجتمع شغّال بإدارة ومعايير تشطيب معروفة.
              </p>
              <p>
                <strong className="text-ink">ماونتن فيو للتطوير العقاري</strong> شركة مصرية تأسست عام <N>2005</N> وتتبع
                مجموعة دار المعمار (DMG)، ولها أكثر من <N>20</N> مشروعاً في شرق وغرب القاهرة والساحل الشمالي
                والبحر الأحمر — من أبرزها iCity التجمع وأكتوبر، وأليفا مستقبل سيتي، وماونتن فيو رأس الحكمة.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 mt-7">
              {["تأسست 2005", "أكثر من 20 مشروعاً", "مجموعة دار المعمار DMG", "طراز أمريكي"].map((b, i) => (
                <span key={i} className="text-[12.5px] font-semibold px-4 py-2 rounded-full bg-wash text-cobalt-d">{b}</span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="border-t-2 border-cobalt pt-6">
              <h3 className="text-[17px] mb-5">مناطق الماستر بلان</h3>
              {ZONES.map((z, i) => (
                <div key={i} className="py-3.5 border-b border-line last:border-0">
                  <div className="font-bold text-[14.5px] text-cobalt-d num">{z.t}</div>
                  <div className="text-muted text-[13px] leading-[1.8]">{z.d}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ UNITS — selector rail + full detail panel (units + payment merged) ═══ */}
      <section id="units" className="py-16 lg:py-20 bg-soft">
        <div className="mx-auto max-w-[1220px] px-5">
          <Reveal>
            <span className="label">الوحدات · الأسعار · السداد</span>
            <h2 className="text-[clamp(22px,3.2vw,32px)] mb-3">اختار نوع الوحدة وشوف تفاصيلها كاملة</h2>
            <p className="text-muted text-[15px] leading-[2] max-w-[76ch] mb-9">
              كل وحدة هنا بسعرها ونظام سدادها وجدية حجزها وموعد استلامها في مكان واحد — من غير ما تلف
              بين أقسام الصفحة عشان تجمّع الصورة.
            </p>
          </Reveal>

          {/* mobile chips */}
          <div className="lg:hidden flex gap-2 mb-6 scroll-x pb-1">
            {UNITS.map((x, i) => (
              <button key={x.id} onClick={() => setSel(i)} className={`chip ${sel === i ? "on" : ""}`}>{x.name}</button>
            ))}
          </div>

          <div className="grid lg:grid-cols-[300px_1fr] gap-8">
            {/* rail */}
            <div className="hidden lg:block self-start bg-white rounded-[4px] overflow-hidden border border-line">
              {UNITS.map((x, i) => (
                <button key={x.id} onClick={() => setSel(i)} aria-pressed={sel === i} className={`rail-item ${sel === i ? "on" : ""}`}>
                  <span className="flex items-center gap-2">
                    <span className="rail-name">{x.name}</span>
                    {x.ready && <span className="text-[10px] font-bold text-white bg-cobalt px-2 py-0.5 rounded-full">فوري</span>}
                  </span>
                  <span className="rail-meta block"><N>{x.area}</N> · من <N>{x.price}</N> ج</span>
                </button>
              ))}
            </div>

            {/* panel */}
            <div className="bg-white rounded-[4px] border border-line overflow-hidden">
              <div className="relative aspect-16/9 bg-wash">
                <img key={u.id} src={u.img} alt={`${u.name} — ماونتن فيو 1.1 اكستنشن`} className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }} />
                <span className="absolute top-4 start-4 bg-white/95 text-cobalt-d text-[12px] font-bold px-3.5 py-1.5 rounded-full">{u.en}</span>
                <span className={`absolute top-4 end-4 text-[12px] font-bold px-3.5 py-1.5 rounded-full ${u.ready ? "bg-cobalt text-white" : "bg-coal text-white"}`}>{u.delivery}</span>
              </div>

              <div className="p-6 md:p-8">
                <h3 className="text-[24px] mb-2">{u.name}</h3>
                <p className="text-muted text-[14.5px] leading-[2] mb-7 max-w-[70ch]">{u.blurb}</p>

                <dl className="grid sm:grid-cols-2 gap-x-10 mb-7">
                  <div className="spec"><dt>المساحة</dt><dd><N>{u.area}</N></dd></div>
                  <div className="spec"><dt>التوزيع</dt><dd>{u.layout}</dd></div>
                  <div className="spec"><dt>السعر يبدأ من</dt><dd className="text-cobalt"><N>{u.price}</N> ج</dd></div>
                  <div className="spec"><dt>نظام السداد</dt><dd>{u.plan}</dd></div>
                  <div className="spec"><dt>الاستلام</dt><dd>{u.delivery}</dd></div>
                  <div className="spec"><dt>جدية الحجز المعلنة</dt><dd><N>{u.eoi}</N> ج</dd></div>
                </dl>

                <ul className="list-none grid sm:grid-cols-2 gap-x-8 gap-y-1 mb-8">
                  {u.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[14px] py-1.5">
                      <span className="w-1.5 h-1.5 bg-cobalt rotate-45 mt-2.5 shrink-0" />{p}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={wa(`مرحباً، مهتم بـ${u.name} في ماونتن فيو 1.1 اكستنشن — ${u.area} — سعر معلن من ${u.price} ج. ممكن أعرف المتاح دلوقتي؟`)}
                    target="_blank" rel="noopener" onClick={onWA} className="btn btn-wa flex-1 sm:flex-none">
                    <WaIcon />اسأل عن {u.name}
                  </a>
                  <a href="#full-form" className="btn btn-line flex-1 sm:flex-none">اطلب المتاح والأسعار</a>
                </div>
              </div>
            </div>
          </div>

          <p className="text-muted text-[12.5px] leading-[1.95] mt-7 max-w-[92ch]">* {PRICE_NOTE}</p>
        </div>
      </section>

      {/* ═══ WHY ═══ */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-[1220px] px-5">
          <Reveal>
            <span className="label">مميزات الاستثمار</span>
            <h2 className="text-[clamp(22px,3.2vw,32px)] mb-10">ليه تشتري في ماونتن فيو <N>1.1</N> اكستنشن؟</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-x-14 gap-y-2">
            {WHY.map((w, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="flex gap-5 py-6 border-b border-line">
                  <span className="font-[family-name:var(--font-display)] font-extrabold text-[34px] text-line-2 leading-none shrink-0 num">{i + 1}</span>
                  <div>
                    <h3 className="text-[17px] mb-2">{w.t}</h3>
                    <p className="text-muted text-[14.5px] leading-[1.95]">{w.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LOCATION ═══ */}
      <section id="location" className="py-16 lg:py-20 bg-coal text-white">
        <div className="mx-auto max-w-[1220px] px-5 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <span className="label label-light">الموقع</span>
            <h2 className="text-[clamp(22px,3.2vw,32px)] text-white mb-5">على طريق النصر مباشرة بقلب التجمع الخامس</h2>
            <p className="text-white/55 text-[15px] leading-[2] mb-8 max-w-[60ch]">
              مدخل المشروع على الطريق نفسه أمام مكتب النائب العام، وملاصق لكمبوند ماونتن فيو <N>1</N>.
            </p>
            <ul className="list-none">
              {LOC_NEAR.map((l, i) => (
                <li key={i} className="flex justify-between gap-5 py-3.5 border-b border-white/12 last:border-0 text-[14.5px]">
                  <b className="font-bold text-white">{l.t}</b>
                  <span className="text-white/50 text-end shrink-0">{l.d}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80}>
            <div className="overflow-hidden rounded-[4px] aspect-4/3 bg-white/10">
              <img src="/images/masterplan.webp" alt="شوارع كمبوند ماونتن فيو 1 اكستنشن — التجمع الخامس" className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ AMENITIES ═══ */}
      <section id="amenities" className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-[1220px] px-5">
          <Reveal>
            <span className="label">الخدمات والمرافق</span>
            <h2 className="text-[clamp(22px,3.2vw,32px)] mb-10">إيه اللي جوه الكمبوند</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10">
            {AMENITIES.map((a, i) => (
              <Reveal key={i} delay={i * 40}>
                <div className="py-5 border-b border-line">
                  <h3 className="text-[15.5px] mb-1">{a.t}</h3>
                  <p className="text-muted text-[13.5px] leading-[1.85]">{a.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GALLERY — mosaic ═══ */}
      <section id="gallery" className="py-16 lg:py-20 bg-soft">
        <div className="mx-auto max-w-[1220px] px-5">
          <Reveal>
            <span className="label">معرض الصور</span>
            <h2 className="text-[clamp(22px,3.2vw,32px)] mb-3">صور ماونتن فيو <N>1.1</N> اكستنشن</h2>
            <p className="text-muted text-[15px] leading-[2] max-w-[70ch] mb-9">
              صور ومخططات من المواد التسويقية للشركة المطوّرة، وذات طبيعة تعبيرية.
            </p>
          </Reveal>
          <Reveal>
            <div className="mosaic">
              {GALLERY.map((g, i) => (
                <figure key={i}>
                  <img src={g.src} alt={g.cap} loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  <figcaption>{g.cap}</figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FAQ — two columns ═══ */}
      <section id="faq" className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-[1220px] px-5">
          <Reveal>
            <span className="label">أسئلة شائعة</span>
            <h2 className="text-[clamp(22px,3.2vw,32px)] mb-9">أسئلة شائعة عن ماونتن فيو <N>1.1</N></h2>
          </Reveal>
          <div className="grid lg:grid-cols-2 gap-x-12">
            {FAQ.map((f, i) => (
              <div key={i} className="border-b border-line self-start">
                <button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i}
                  className="w-full text-start py-5 flex justify-between items-center gap-4 bg-transparent border-0 cursor-pointer font-[family-name:var(--font-display)] font-bold text-[15px] text-coal">
                  <span>{f.q}</span>
                  <span className={`shrink-0 text-cobalt text-[20px] leading-none transition-transform duration-200 ${faq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                <div className={`acc ${faq === i ? "open" : ""}`}>
                  <p className="pb-5 text-muted text-[14px] leading-[2]">{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FULL FORM ═══ */}
      <section id="full-form" className="py-16 lg:py-20 bg-wash">
        <div className="mx-auto max-w-[820px] px-5">
          <div className="bg-white rounded-[4px] border border-line p-7 md:p-10">
            {mSt === "sent" ? (
              <div className="text-center py-8">
                <h2 className="text-cobalt text-[24px] mb-2">تم استلام طلبك</h2>
                <p className="text-muted text-[15px]">سيتواصل معك مستشار عقاري خلال <N>24</N> ساعة عمل بقائمة الوحدات المتاحة والأسعار المحدثة.</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <span className="label justify-center">سجّل اهتمامك</span>
                  <h2 className="text-[clamp(21px,3vw,28px)] mb-2">استلم قائمة الوحدات والأسعار المحدثة</h2>
                  <p className="text-muted text-[14.5px] max-w-[54ch] mx-auto">
                    آخر وحدات متاحة بالمساحة والدور والفيو والأسعار المعلنة من المطوّر
                  </p>
                </div>
                <form ref={mForm} onSubmit={(e: FormEvent) => { e.preventDefault(); send(mForm, setMSt, setMErr); }}>
                  <input type="text" name="company" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                  <input type="hidden" name="subject" value="Lead — ماونتن فيو 1.1 اكستنشن" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input name="name" className="fld" placeholder="الاسم بالكامل *" required aria-label="الاسم" />
                    <div className="flex gap-2">
                      <select name="dial" className="fld num !w-[104px] !px-2 shrink-0" defaultValue="EG +20" aria-label="كود الدولة">
                        {DIAL.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <input name="phone" type="tel" dir="ltr" className="fld num" placeholder="01012345678 *" required aria-label="رقم الموبايل" />
                    </div>
                  </div>
                  <select name="unit_type" className="fld mt-4" defaultValue="" aria-label="نوع الوحدة">
                    <option value="">نوع الوحدة المطلوبة</option>
                    {UNITS.map((x) => <option key={x.id} value={`${x.name} (${x.area})`}>{x.name} — {x.area} — من {x.price} ج</option>)}
                    <option value="استفسار عام / استثمار">استفسار عام / استثمار</option>
                  </select>
                  <button type="submit" disabled={mSt === "sending"} className="btn btn-cobalt w-full mt-5">
                    {mSt === "sending" ? "جاري الإرسال…" : "احجز وحدتك الآن"}
                  </button>
                  {mErr && <p className="text-[13px] text-[#c0392b] mt-3 text-center">{mErr}</p>}
                  <p className="text-[12px] text-muted leading-[1.8] mt-4 text-center">
                    بالضغط على إرسال أنت توافق على{" "}
                    <button type="button" onClick={() => setLegal(true)} className="text-cobalt underline bg-transparent border-0 p-0 cursor-pointer font-[inherit] text-[inherit]">سياسة الخصوصية</button>
                    {" "}— بياناتك تُستخدم فقط للتواصل بخصوص استفسارك العقاري.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-coal-2 text-white/55 pt-14 pb-28 md:pb-14 text-[13px]">
        <div className="mx-auto max-w-[1220px] px-5">
          <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-10 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-[3px] h-8 bg-sky block" />
                <span className="font-[family-name:var(--font-display)] text-[17px] font-extrabold text-white">ماونتن فيو <N>1.1</N> اكستنشن</span>
              </div>
              <p className="leading-[2] max-w-[46ch]">
                منصة معلومات واستفسارات عقارية مستقلة يديرها فريق مبيعات معتمد لدى كبرى شركات التطوير العقاري في مصر.
              </p>
            </div>
            <div>
              <h4 className="text-white text-[14px] mb-3">الصفحة</h4>
              <ul className="list-none">
                {NAV.map((n) => <li key={n.h} className="py-1"><a href={n.h} className="no-underline hover:text-white">{n.t}</a></li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-white text-[14px] mb-3">تواصل</h4>
              <ul className="list-none">
                <li className="py-1"><a href={`tel:${PHONE_INTL}`} onClick={onCall} className="no-underline hover:text-white num">{PHONE_DISPLAY}</a></li>
                <li className="py-1"><a href={WA_MAIN} target="_blank" rel="noopener" onClick={onWA} className="no-underline hover:text-white">واتساب</a></li>
                <li className="py-1"><a href={`mailto:${AGENT_EMAIL}`} className="no-underline hover:text-white" dir="ltr">{AGENT_EMAIL}</a></li>
                <li className="py-1"><button onClick={() => setLegal(true)} className="bg-transparent border-0 p-0 cursor-pointer text-white/55 hover:text-white underline font-[inherit] text-[inherit]">سياسة الخصوصية وإخلاء المسئولية</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-7 text-[12px] leading-[2] text-white/38">
            <p className="max-w-[96ch] mb-3">
              هذه الصفحة ليست الموقع الرسمي لشركة ماونتن فيو للتطوير العقاري (Mountain View Developments) ولا تتبعها إدارياً،
              وجميع الأسماء والعلامات التجارية مملوكة لأصحابها. الأسعار والمساحات الواردة استرشادية وقابلة للتغيير وفق أحدث
              تحديثات المطوّر، والتعاقد والسداد يتمّان مع الشركة المطوّرة مباشرة وبعقودها الرسمية.
            </p>
            <p>© <N>2026</N> {AGENT_EN} — جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>

      {/* ═══ LEAD POPUP ═══ */}
      {pop && (
        <>
          <div className="fixed inset-0 z-200 bg-coal/70 backdrop-blur-[3px]" onClick={() => setPop(false)} />
          <div role="dialog" aria-modal="true" aria-label="اطلب قائمة الأسعار"
            className="fixed z-201 top-1/2 start-1/2 translate-x-1/2 -translate-y-1/2 w-[min(460px,93vw)] max-h-[88vh] overflow-y-auto bg-white rounded-[4px]">
            <div className="bg-cobalt text-white p-7 relative">
              <button onClick={() => setPop(false)} aria-label="إغلاق"
                className="absolute top-3 start-3 w-8 h-8 rounded-full bg-white/20 text-white border-0 cursor-pointer text-[15px]">✕</button>
              <span className="label label-light !text-white/70 before:!bg-white/70">استلام فوري — المرحلة الثانية</span>
              <h2 className="text-[21px] text-white leading-snug">عايز آخر قائمة وحدات وأسعار؟</h2>
              <p className="text-white/70 text-[13.5px] mt-2 leading-[1.85]">
                سيب رقمك ويوصلك آخر متاح بالمساحة والدور والفيو والسعر المعلن من المطوّر.
              </p>
            </div>
            <div className="p-6">
              {pSt === "sent" ? (
                <div className="text-center py-6">
                  <h3 className="text-cobalt text-[19px] mb-1.5">تم استلام طلبك</h3>
                  <p className="text-muted text-[14px]">هنكلّمك في أقرب وقت.</p>
                </div>
              ) : (
                <form ref={pForm} onSubmit={(e: FormEvent) => { e.preventDefault(); send(pForm, setPSt, setPErr).then((ok) => { if (ok) setTimeout(() => setPop(false), 2600); }); }}>
                  <input type="text" name="company" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                  <input type="hidden" name="subject" value="Popup Lead — ماونتن فيو 1.1 اكستنشن" />
                  <input name="name" className="fld mb-3.5" placeholder="الاسم بالكامل *" required aria-label="الاسم" />
                  <div className="flex gap-2 mb-3.5">
                    <select name="dial" className="fld num !w-[104px] !px-2 shrink-0" defaultValue="EG +20" aria-label="كود الدولة">
                      {DIAL.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <input name="phone" type="tel" dir="ltr" className="fld num" placeholder="01012345678 *" required aria-label="رقم الموبايل" />
                  </div>
                  <select name="unit_type" className="fld" defaultValue="" aria-label="نوع الوحدة">
                    <option value="">نوع الوحدة المطلوبة</option>
                    {UNITS.map((x) => <option key={x.id} value={`${x.name} (${x.area})`}>{x.name} — {x.area}</option>)}
                  </select>
                  <button type="submit" disabled={pSt === "sending"} className="btn btn-cobalt w-full mt-4">
                    {pSt === "sending" ? "جاري الإرسال…" : "ابعتلي القائمة"}
                  </button>
                  {pErr && <p className="text-[13px] text-[#c0392b] mt-3 text-center">{pErr}</p>}
                  <a href={WA_MAIN} target="_blank" rel="noopener" onClick={onWA} className="btn btn-wa w-full mt-2.5"><WaIcon />أو تواصل واتساب</a>
                  <p className="text-[11.5px] text-muted leading-[1.8] mt-4 text-center">
                    بالضغط على إرسال أنت توافق على{" "}
                    <button type="button" onClick={() => { setPop(false); setLegal(true); }} className="text-cobalt underline bg-transparent border-0 p-0 cursor-pointer font-[inherit] text-[inherit]">سياسة الخصوصية</button>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </>
      )}

      {/* ═══ LEGAL MODAL ═══ */}
      {legal && (
        <>
          <div className="fixed inset-0 z-200 bg-coal/70 backdrop-blur-[3px]" onClick={() => setLegal(false)} />
          <div role="dialog" aria-modal="true" aria-label="سياسة الخصوصية وإخلاء المسئولية"
            className="fixed z-201 top-1/2 start-1/2 translate-x-1/2 -translate-y-1/2 w-[min(680px,93vw)] max-h-[86vh] overflow-y-auto bg-white rounded-[4px] p-8 md:p-10">
            <button onClick={() => setLegal(false)} aria-label="إغلاق"
              className="absolute top-4 start-4 w-9 h-9 rounded-full bg-soft text-coal border-0 cursor-pointer text-[16px]">✕</button>
            <span className="label">Privacy &amp; Disclaimer</span>
            <h2 className="text-[23px] mb-5">سياسة الخصوصية وإخلاء المسئولية</h2>
            <div className="text-muted text-[14px] leading-[2]">
              {[
                ["البيانات التي نجمعها", "الاسم ورقم الهاتف ونوع الوحدة، وذلك فقط عند ملء النموذج بنفسك. كما نجمع بيانات فنية تلقائية (نوع المتصفح ومصدر الزيارة) عبر أدوات القياس."],
                ["الاستخدام", "نستخدم بياناتك للتواصل معك بخصوص استفسارك عن وحدات ماونتن فيو 1.1 وإرسال قوائم الوحدات والأسعار، ولقياس أداء الحملات الإعلانية. لا نبيع بياناتك لأي طرف ثالث لأغراض تسويقية."],
                ["المشاركة", "نشارك بياناتك مع الشركة المطوّرة بالقدر اللازم لإتمام إجراءات الحجز أو التعاقد، ومع مزوّدي الخدمات التقنية الذين يشغّلون الموقع ونظام إدارة العملاء."],
                ["ملفات تعريف الارتباط", "نستخدمها لقياس تحويلات الإعلانات. لا تُفعّل ملفات الارتباط الإعلانية إلا بعد موافقتك الصريحة من الشريط الذي يظهر عند أول زيارة، ويمكنك حذفها من إعدادات المتصفح في أي وقت."],
                ["مدة الاحتفاظ وحقوقك", `نحتفظ ببيانات التواصل مدة أقصاها 24 شهراً من آخر تفاعل. لك حق طلب نسخة من بياناتك أو تصحيحها أو حذفها أو سحب موافقتك في أي وقت — راسلنا على ${AGENT_EMAIL}.`],
                ["صفة مشغّل الموقع", "هذه الصفحة منصة معلومات واستفسارات عقارية مستقلة يديرها فريق مبيعات معتمد. ليست الموقع الرسمي لشركة ماونتن فيو للتطوير العقاري ولا تتبعها إدارياً."],
                ["الأسعار والعروض", `${PRICE_NOTE} التعاقد النهائي وشروطه تتحدد من الشركة المطوّرة مباشرة، وننصح دائماً بمراجعة العقد والمستندات القانونية للمشروع قبل السداد.`],
                ["العلامات التجارية والصور", "«ماونتن فيو» و«Mountain View» وما يتصل بها من شعارات علامات تجارية مملوكة لأصحابها وتُستخدم هنا لغرض وصفي بحت لتعريف المشروع. الصور والمخططات مواد تسويقية صادرة عن المطوّر وذات طبيعة تعبيرية وقد تختلف عن الشكل النهائي."],
                ["حدود المسئولية والقانون", "لا نتحمل مسئولية أي قرار شرائي يُتخذ بناءً على المعلومات المعروضة هنا وحدها. تخضع هذه الشروط لقوانين جمهورية مصر العربية."],
              ].map(([h, b], i) => (
                <div key={i}>
                  <h3 className="text-[15px] text-coal mt-5 mb-1">{h}</h3>
                  <p>{b}</p>
                </div>
              ))}
              <p className="text-[12px] text-muted/70 pt-5">آخر تحديث: سبتمبر <N>2026</N></p>
            </div>
          </div>
        </>
      )}

      {/* ═══ COOKIE ═══ */}
      {cookie && (
        <div className="fixed inset-x-0 bottom-0 z-190 bg-coal text-white/75 px-5 py-3.5 flex flex-wrap gap-3 items-center justify-center text-[13px] border-t-3 border-cobalt mb-[64px] md:mb-0">
          <span className="max-w-[600px] leading-[1.8] text-center">
            نستخدم ملفات تعريف الارتباط لقياس أداء الإعلانات.{" "}
            <button onClick={() => setLegal(true)} className="text-sky underline bg-transparent border-0 p-0 cursor-pointer font-[inherit] text-[inherit]">اعرف أكثر</button>
          </span>
          <span className="flex gap-2">
            <button onClick={acceptCookies} className="btn btn-cobalt !py-2 !px-5 !text-[13px]">موافق</button>
            <button onClick={() => setCookie(false)} className="btn btn-ghost !py-2 !px-5 !text-[13px]">رفض</button>
          </span>
        </div>
      )}

      {/* ═══ FLOATING SIDE ACTIONS (desktop) ═══ */}
      <div className="fab-stack">
        <a href={WA_MAIN} target="_blank" rel="noopener" onClick={onWA} className="fab fab-wa" aria-label="تواصل واتساب">
          <span className="fab-tip">تواصل واتساب</span>
          <WaIcon s={26} />
        </a>
        <a href={`tel:${PHONE_INTL}`} onClick={onCall} className="fab fab-call" aria-label="اتصل بنا">
          <span className="fab-tip">اتصل بنا — {PHONE_DISPLAY}</span>
          <svg viewBox="0 0 24 24" className="w-[24px] h-[24px] fill-current" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
        </a>
        {solid && (
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fab fab-top border-0 cursor-pointer" aria-label="أعلى الصفحة">
            <span className="fab-tip">أعلى الصفحة</span>
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
          </button>
        )}
      </div>

      {/* ═══ MOBILE BAR ═══ */}
      <nav className="md:hidden fixed inset-x-0 bottom-0 z-95 bg-white border-t border-line p-2 flex gap-2">
        <a href={`tel:${PHONE_INTL}`} onClick={onCall} className="btn btn-coal flex-1 !py-3 !px-2 !text-[13.5px]">اتصال</a>
        <a href={WA_MAIN} target="_blank" rel="noopener" onClick={onWA} className="btn btn-wa flex-1 !py-3 !px-2 !text-[13.5px]">واتساب</a>
        <a href="#full-form" className="btn btn-cobalt flex-1 !py-3 !px-2 !text-[13.5px]">احجز الآن</a>
      </nav>
    </>
  );
}
