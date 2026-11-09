import Image from "next/image";
import {
  ArrowUpLeft,
  CarFront,
  Compass,
  Hotel,
  MapPin,
  TicketCheck,
  Sparkles,
} from "lucide-react";
import { UmrahPrograms } from "@/components/umrah-programs";
import { inquiry } from "@/lib/site";

const saudiServices = [
  {
    icon: TicketCheck,
    title: "تأشيرات متنوعة للمملكة",
    text: "نساعدك تختار التأشيرة المناسبة لزيارتك، ونتابع معاك خطوات التقديم.",
    action: "استفسر عن التأشيرات",
    tone: "rose",
    image: "saudi-visa",
    alt: "أفق الرياض وطرقها بين الأبراج الحديثة",
  },
  {
    icon: Hotel,
    title: "فنادق في المملكة بأفضل الأسعار",
    text: "إقامة مريحة في مكة والمدينة وباقي مدن المملكة، باختيارات تناسب ميزانيتك.",
    action: "اختار إقامتك",
    tone: "sand",
    image: "saudi-hotel",
    alt: "غرفة فندقية مريحة بسرير واسع",
  },
  {
    icon: CarFront,
    title: "انتقالات",
    text: "من المطار للفندق وبين مدن المملكة، رتّب تنقلاتك وخلي رحلتك أسهل.",
    action: "رتّب انتقالاتك",
    tone: "blue",
    image: "saudi-transfer",
    alt: "سيارة تسير على طريق بين الجبال",
  },
  {
    icon: Compass,
    title: "اعمل برنامجك على كيفك",
    text: "اختار المواعيد والإقامة والتنقلات، وإحنا نساعدك تجمعهم في رحلة على ذوقك.",
    action: "صمّم رحلتك معانا",
    tone: "navy",
    image: "saudi-custom",
    alt: "مسافر يستكشف التكوينات الصخرية في العلا بالسعودية",
  },
];

const travelServices = [
  {
    title: "حجز طيران بأفضل سعر",
    text: "قولّنا وجهتك وميعاد سفرك، وهنساعدك تختار الرحلة الأنسب ليك.",
    action: "اسأل على رحلتك",
    image: "flight",
    alt: "جناح طائرة فوق السحاب",
    category: "طيران",
    featured: true,
  },
  {
    title: "حجز فنادق داخل وخارج مصر",
    text: "من إجازة قريبة لرحلة بعيدة، اختار إقامة تناسب ذوقك وميزانيتك.",
    action: "اسأل عن إقامتك",
    image: "hotels",
    alt: "فندق يحيط بحمام سباحة واسع",
    category: "إقامة",
    featured: true,
  },
  {
    title: "تأشيرة الإمارات",
    text: "خطط لزيارتك للإمارات، واعرف معانا المتطلبات وخطوات التقديم.",
    action: "استفسر عن التأشيرة",
    image: "uae",
    alt: "أفق دبي وبرج خليفة على الواجهة المائية",
    category: "الإمارات",
  },
  {
    title: "فيزا الصين",
    text: "نساعدك تعرف الأوراق المطلوبة وتجهّز طلب تأشيرة الصين.",
    action: "استفسر عن الفيزا",
    image: "china",
    alt: "سور الصين العظيم وسط التلال الخضراء",
    category: "الصين",
  },
  {
    title: "فيزا شنجن",
    text: "رحلتك لأوروبا تبدأ بخطوة، اسألنا عن تجهيز طلب فيزا شنجن.",
    action: "استفسر عن الفيزا",
    image: "schengen",
    alt: "برج إيفل في باريس تحت سماء زرقاء",
    category: "أوروبا",
  },
  {
    title: "فيزا أمريكا",
    text: "اعرف متطلبات التقديم وخطوات تجهيز طلب تأشيرة أمريكا.",
    action: "استفسر عن الفيزا",
    image: "usa",
    alt: "تمثال الحرية في نيويورك",
    category: "أمريكا",
  },
  {
    title: "دولة أخرى",
    text: "في بالك وجهة تانية؟ قولّنا نفسك تسافر فين، وخلّي التخطيط علينا.",
    action: "قولّنا وجهتك",
    image: "world",
    alt: "جواز سفر وكاميرا فوق خريطة للعالم",
    category: "وجهتك الجاية",
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="section services-section"
      aria-label="خدماتنا"
    >
      <div className="container">
        <section aria-labelledby="umrah-heading">
          <div className="section-heading" data-reveal>
            <div>
              <span className="eyebrow">
                <span /> رحلتك تبدأ من هنا
              </span>
              <h2 id="umrah-heading">
                برامج العمرة
                <span className="umrah-heading-note">
                  للروح وجهة، وللقلب سكينة.
                </span>
              </h2>
            </div>
            <p>
              رحلة لبيت الله، نهتم فيها بكل التفاصيل.
              <br />
              اختار برنامجك، وسيب الباقي علينا.
            </p>
          </div>
          <UmrahPrograms
            fallback={
              <div className="umrah-coming" data-reveal>
                <div className="umrah-coming-photo">
                  <Image
                    src="/images/medina.jpg"
                    alt="المسجد النبوي الشريف وقت الغروب"
                    fill
                    sizes="(max-width: 760px) 100vw, 45vw"
                  />
                  <span>
                    <MapPin size={16} /> المدينة المنورة
                  </span>
                </div>
                <div className="umrah-coming-copy">
                  <span className="coming-badge">
                    <Sparkles size={16} /> قريبًا مع رويال فالي
                  </span>
                  <h3>
                    شوقك للزيارة…
                    <br />
                    <span>بداية رحلتك.</span>
                  </h3>
                  <p>
                    برامج العمرة الجديدة قريبًا.
                    <br />
                    كلّمنا وهنساعدك تخطط لرحلتك وتعرف التفاصيل.
                  </p>
                  <a
                    className="button button-red"
                    href={inquiry("برامج العمرة القادمة")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    استفسر عن برامج العمرة <ArrowUpLeft size={19} />
                  </a>
                </div>
              </div>
            }
          />
        </section>
        <section className="saudi-services" aria-labelledby="saudi-heading">
          <div className="section-heading" data-reveal>
            <div>
              <span className="eyebrow">
                <span /> وجهة واحدة، اختيارات كتير
              </span>
              <h2 id="saudi-heading">المملكة السعودية</h2>
            </div>
            <p>
              كل اللي تحتاجه لزيارتك، في مكان واحد.
              <br />
              من أول التأشيرة لآخر مشوار.
            </p>
          </div>
          <div className="saudi-services-grid">
            {saudiServices.map(
              (
                { icon: Icon, title, text, action, tone, image, alt },
                index,
              ) => (
                <a
                  className={`saudi-service-card saudi-${tone}`}
                  href={inquiry(title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={title}
                  data-reveal
                >
                  <div className="saudi-card-image">
                    <Image
                      src={`/images/${image}.jpg`}
                      alt={alt}
                      fill
                      sizes="(max-width: 540px) 100vw, (max-width: 1100px) 50vw, 25vw"
                    />
                  </div>
                  <div className="saudi-card-content">
                    <div className="saudi-card-top">
                      <span className="saudi-service-icon">
                        <Icon size={28} strokeWidth={1.5} />
                      </span>
                      <span className="saudi-service-index" aria-hidden="true">
                        0{index + 1}
                      </span>
                    </div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                    <span className="saudi-card-link">
                      {action}
                      <span>
                        <ArrowUpLeft size={19} />
                      </span>
                    </span>
                  </div>
                </a>
              ),
            )}
          </div>
        </section>
        <section className="travel-services" aria-labelledby="travel-heading">
          <div className="section-heading" data-reveal>
            <div>
              <span className="eyebrow">
                <span /> كمّل حكايتك حول العالم
              </span>
              <h2 id="travel-heading">
                وجهتك في بالك؟
                <br />
                <span>نساعدك توصلها.</span>
              </h2>
            </div>
            <p>
              طيران، فنادق وتأشيرات لرحلتك الجاية.
              <br />
              اختار اللي تحتاجه، وإحنا معاك في كل خطوة.
            </p>
          </div>
          <div className="travel-services-grid">
            {travelServices.map((service) => (
              <a
                className={`travel-service-card${service.featured ? " travel-featured" : ""}`}
                href={inquiry(service.title)}
                key={service.image}
                target="_blank"
                rel="noopener noreferrer"
                data-reveal
              >
                <div className="travel-card-image">
                  <Image
                    src={`/images/${service.image}.jpg`}
                    alt={service.alt}
                    fill
                    sizes={
                      service.featured
                        ? "(max-width: 760px) 100vw, 50vw"
                        : "(max-width: 760px) 100vw, 33vw"
                    }
                  />
                  <span className="travel-category">{service.category}</span>
                </div>
                <div className="travel-card-copy">
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <span className="saudi-card-link">
                    {service.action}
                    <span>
                      <ArrowUpLeft size={19} />
                    </span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
