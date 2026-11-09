import Image from "next/image";
import {
  ArrowDown,
  ArrowUpLeft,
  BadgeCheck,
  Check,
  Compass,
  Headphones,
  MapPin,
  MessageCircle,
  Phone,
  Plane,
  ShieldCheck,
  Mail,
  UserRound,
} from "lucide-react";
import { Services } from "@/components/services";
import { Header } from "@/components/header";
import { Brand } from "@/components/brand";
import { Reveal } from "@/components/reveal";
import { SocialLinks } from "@/components/social-links";
import { inquiry, navigation, site } from "@/lib/site";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="eyebrow">
      <span />
      {children}
    </span>
  );
}
const benefits = [
  {
    icon: <Compass />,
    title: "رحلة على ذوقك",
    text: "اختيارات تناسب احتياجاتك وميزانيتك",
  },
  {
    icon: <ShieldCheck />,
    title: "راحة بالك أولويتنا",
    text: "تفاصيل واضحة من أول خطوة",
  },
  {
    icon: <Headphones />,
    title: "دايمًا على تواصل",
    text: "فريق يسمعك ويساعدك تخطط",
  },
];

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: site.name,
    url: site.url,
    email: site.email,
    telephone: "+201002131321",
    image: `${site.url}/images/medina.jpg`,
    availableLanguage: "Arabic",
    contactPoint: site.phones.map((phone) => ({
      "@type": "ContactPoint",
      telephone: `+2${phone}`,
      contactType: "customer service",
      availableLanguage: "Arabic",
    })),
  };
  return (
    <>
      <a className="skip-link" href="#main">
        تخطَّ إلى المحتوى
      </a>
      <Header />
      <main id="main">
        <section id="home" className="hero" aria-labelledby="hero-title">
          <Image
            className="hero-image"
            src="/images/medina.jpg"
            alt="المسجد النبوي في المدينة المنورة وقت الغروب"
            fill
            priority
            sizes="100vw"
          />
          <div className="hero-overlay" />
          <div className="container hero-content">
            <div className="hero-kicker">
              <span /> رحلتك تبدأ بنيّة… وتكمل معانا
            </div>
            <h1 id="hero-title">
              رويال فالي <span>للسياحة</span>
            </h1>
            <p className="hero-tagline">
              اختر <em>شغفك.</em>
            </p>
            <p className="hero-description">
              من رحلة تسكن الروح، لوجهة نفسك تكتشفها.
              <br />
              معاك في كل خطوة… عشان تستمتع بكل لحظة.
            </p>
            <div className="hero-actions">
              <a href="#contact" className="button button-red">
                تواصل معنا <ArrowUpLeft size={20} />
              </a>
              <a href="#services" className="button button-glass">
                بنقدم إيه؟ <ArrowDown size={18} />
              </a>
            </div>
          </div>
          <div className="container hero-bottom">
            <span>
              <MapPin size={15} /> المسجد النبوي الشريف، المدينة المنورة
            </span>
            <a href="#services">
              اكتشف رحلتك{" "}
              <span className="scroll-circle">
                <ArrowDown size={15} />
              </span>
            </a>
            <span className="hero-english" dir="ltr">
              PICK YOUR PASSION.
            </span>
          </div>
        </section>

        <div className="benefits-strip">
          <div className="container benefits-grid">
            {benefits.map((benefit) => (
              <div className="benefit" key={benefit.title}>
                <span className="benefit-icon">{benefit.icon}</span>
                <div>
                  <h2>{benefit.title}</h2>
                  <p>{benefit.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Services />

        <section id="about" className="section about-section">
          <div className="container about-grid">
            <div className="about-visual" data-reveal>
              <div className="about-photo">
                <Image
                  src="/images/medina.jpg"
                  alt="معمار المسجد النبوي الشريف"
                  fill
                  sizes="(max-width: 760px) 100vw, 45vw"
                />
              </div>
              <div className="about-seal">
                <Compass size={32} />
                <span>شغفك وجهتنا</span>
                <small dir="ltr">ROYAL VALLEY</small>
              </div>
              <div className="about-photo-caption">
                <MapPin size={16} /> أماكن تزورها… وتفضل جواك.
              </div>
            </div>
            <div className="about-copy" data-reveal>
              <Eyebrow>من نحن</Eyebrow>
              <h2>
                مش بس رحلة.
                <br />
                <span>بداية حكاية حلوة.</span>
              </h2>
              <p>
                في رويال فالي للسياحة، بنؤمن إن كل رحلة بتبدأ بشغف. ممكن يكون
                شوق لزيارة بيت الله، أو فضول لمكان جديد، أو لحظة راحة بعيد عن
                الزحمة.
              </p>
              <p>
                عشان كده، بنجمع لك خدمات الحج والعمرة والتأشيرات والطيران
                والفنادق، وبنساعدك تختار اللي يناسبك بتفاصيل واضحة وتواصل مباشر.
              </p>
              <ul className="about-values">
                <li>
                  <Check size={17} /> نهتم بالتفاصيل الصغيرة قبل الكبيرة
                </li>
                <li>
                  <Check size={17} /> نسمعك ونفهم احتياجات رحلتك
                </li>
                <li>
                  <Check size={17} /> اختيارات تناسبك، وخطوات واضحة
                </li>
              </ul>
              <div className="team">
                <div className="team-avatars" aria-hidden="true">
                  <span>
                    <UserRound />
                  </span>
                  <span>
                    <UserRound />
                  </span>
                </div>
                <div>
                  <strong>ناس تهتم برحلتك</strong>
                  <span>فريق رويال فالي للسياحة</span>
                </div>
                <a href="#contact" aria-label="تواصل مع فريق رويال فالي">
                  <ArrowUpLeft size={22} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="container contact-panel" data-reveal>
            <div className="contact-intro">
              <Eyebrow>تواصل معنا</Eyebrow>
              <h2>
                رحلتك الجاية
                <br />
                تبدأ <span>بكلامنا.</span>
              </h2>
              <p>
                عندك وجهة في بالك أو محتاج مساعدة تختار؟
                <br />
                كلّمنا، وخلّي أول خطوة علينا.
              </p>
              <a
                className="button button-red"
                href={inquiry("تفاصيل رحلة جديدة")}
                target="_blank"
                rel="noopener noreferrer"
              >
                كلّمنا على واتساب <MessageCircle size={20} />
              </a>
              <div className="social-row">
                <span>خلّينا على تواصل</span>
                <SocialLinks />
              </div>
            </div>
            <div className="contact-details">
              <div className="contact-detail">
                <span className="contact-icon">
                  <Phone size={22} />
                </span>
                <div>
                  <span className="contact-label">اسمع صوتنا</span>
                  {site.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:+2${phone}`}
                      dir="ltr"
                      className="phone-number"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
                <ArrowUpLeft className="detail-arrow" size={20} />
              </div>
              <div className="contact-detail">
                <span className="contact-icon">
                  <Mail size={22} />
                </span>
                <div>
                  <span className="contact-label">ابعتلنا رسالة</span>
                  <a
                    className="email-address"
                    href={`mailto:${site.email}`}
                    dir="ltr"
                  >
                    {site.email}
                  </a>
                </div>
                <ArrowUpLeft className="detail-arrow" size={20} />
              </div>
              <div className="contact-footnote">
                <BadgeCheck size={21} />
                <p>
                  احكيلنا عن رحلتك، وهنساعدك تعرف
                  <br />
                  الاختيارات والخطوات اللي تناسبك.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container footer-top">
          <Brand />
          <nav aria-label="روابط أسفل الصفحة">
            {navigation.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <span className="footer-tagline">اختر شغفك… وسيب الباقي علينا.</span>
        </div>
        <div className="container footer-bottom">
          <p>
            © {new Date().getFullYear()} رويال فالي للسياحة. جميع الحقوق محفوظة.
          </p>
          <span dir="ltr">
            MADE FOR YOUR NEXT JOURNEY <Plane size={13} />
          </span>
        </div>
      </footer>
      <a
        className="floating-whatsapp"
        href={inquiry("خدمات رويال فالي")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل مع رويال فالي على واتساب"
      >
        <MessageCircle size={26} />
      </a>
      <Reveal />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
