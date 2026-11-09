export function Brand({
  light = false,
  href = "#home",
}: {
  light?: boolean;
  href?: string;
}) {
  return (
    <a
      href={href}
      aria-label="رويال فالي للسياحة — الرئيسية"
      className={`brand ${light ? "brand-light" : ""}`}
    >
      <svg
        width="43"
        height="34"
        viewBox="0 0 80 60"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M2 8 34 31 20 44H2ZM40 7 53 20 40 30 27 20ZM78 8 46 31 60 44H78V37H62L78 33V28H66L78 24V18H70L78 15ZM40 37 49 44H31Z" />
      </svg>
      <span>
        <strong dir="ltr">ROYAL VALLEY</strong>
        <small dir="ltr">T O U R S</small>
      </span>
    </a>
  );
}
