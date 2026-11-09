export const site = {
  name: "رويال فالي للسياحة",
  url: "https://royal-valley-damietta.purplechub1024.chatgpt.site",
  description:
    "اختر شغفك مع رويال فالي للسياحة. برامج الحج والعمرة، خدمات التأشيرات، وحجز الطيران والفنادق. تواصل معنا لتخطيط رحلتك القادمة.",
  email: "info@royalvalleydamietta.com",
  phones: ["01002131321", "01002030323"],
  whatsapp: "https://wa.me/201002131321",
  // Add the official profile URLs when supplied. Do not link to unrelated accounts.
  social: { facebook: "", instagram: "", tiktok: "" },
};
export const navigation = [
  { href: "#home", label: "الرئيسية" },
  { href: "#services", label: "خدماتنا" },
  { href: "#about", label: "من نحن" },
  { href: "#contact", label: "تواصل معنا" },
];
export const visaDestinations = [
  { name: "السعودية", flag: "🇸🇦", english: "SAUDI ARABIA" },
  { name: "تركيا", flag: "🇹🇷", english: "TÜRKIYE" },
  { name: "الصين", flag: "🇨🇳", english: "CHINA" },
  { name: "شنغن", flag: "🇪🇺", english: "SCHENGEN" },
  { name: "الإمارات", flag: "🇦🇪", english: "UNITED ARAB EMIRATES" },
];
export function inquiry(topic: string) {
  return `${site.whatsapp}?text=${encodeURIComponent(`مرحبًا رويال فالي، أريد الاستفسار عن ${topic}.`)}`;
}
