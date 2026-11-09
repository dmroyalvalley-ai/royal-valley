"use client";
import { useState } from "react";
import { Facebook, Instagram } from "lucide-react";
import { site } from "@/lib/site";
function TikTok() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.6 2c.3 2.5 1.8 4 4.4 4.2v3a9 9 0 0 1-4.4-1.3v7.2a6.3 6.3 0 1 1-5.4-6.2v3.2a3.1 3.1 0 1 0 2.2 3V2z" />
    </svg>
  );
}
export function SocialLinks() {
  const [message, setMessage] = useState("");
  const items = [
    { key: "facebook", name: "فيسبوك", icon: <Facebook size={20} /> },
    { key: "instagram", name: "إنستجرام", icon: <Instagram size={20} /> },
    { key: "tiktok", name: "تيك توك", icon: <TikTok /> },
  ] as const;
  return (
    <div>
      <div className="social-links">
        {items.map((item) =>
          site.social[item.key] ? (
            <a
              key={item.key}
              href={site.social[item.key]}
              aria-label={item.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.icon}
            </a>
          ) : (
            <button
              key={item.key}
              aria-label={`${item.name} — الرابط قريبًا`}
              onClick={() =>
                setMessage(
                  `رابط ${item.name} هيتضاف قريبًا. تقدر تتواصل معانا بالتليفون أو واتساب.`,
                )
              }
            >
              {item.icon}
            </button>
          ),
        )}
      </div>
      <p className="social-notice" role="status">
        {message}
      </p>
    </div>
  );
}
