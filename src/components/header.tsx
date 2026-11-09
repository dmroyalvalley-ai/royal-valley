"use client";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpLeft } from "lucide-react";
import { Brand } from "./brand";
import { navigation } from "@/lib/site";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 36);
    update();
    window.addEventListener("scroll", update, { passive: true });
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("keydown", close);
    };
  }, []);
  return (
    <header className={`site-header ${scrolled || open ? "header-solid" : ""}`}>
      <div className="container nav-inner">
        <Brand light={!scrolled && !open} />
        <nav aria-label="القائمة الرئيسية" className="desktop-nav">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="nav-contact">
          خلّينا نخطط رحلتك <ArrowUpLeft size={17} />
        </a>
        <button
          className="menu-toggle"
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="قائمة الموبايل"
        >
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
              <ArrowUpLeft size={17} />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
