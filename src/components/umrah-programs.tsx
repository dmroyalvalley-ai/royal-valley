"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpLeft } from "lucide-react";
import {
  getSupabase,
  programImage,
  priceText,
  type Program,
} from "@/lib/supabase";
import { inquiry } from "@/lib/site";

export function UmrahPrograms({ fallback }: { fallback: React.ReactNode }) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [status, setStatus] = useState("loading");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    const db = getSupabase();
    if (!db) {
      setStatus("ready");
      return;
    }
    setStatus("loading");
    Promise.resolve(
      db
        .from("umrah_programs")
        .select("*")
        .eq("published", true)
        .order("sort_order")
        .order("created_at", { ascending: false }),
    )
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setStatus("error");
          return;
        }
        setPrograms(data ?? []);
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [retry]);
  if (status === "loading")
    return (
      <p className="program-feedback" role="status">
        جاري تحميل برامج العمرة…
      </p>
    );
  if (status === "error")
    return (
      <div className="program-feedback" role="status">
        تعذّر تحميل البرامج حاليًا.{" "}
        <button onClick={() => setRetry(retry + 1)}>حاول مرة أخرى</button> أو{" "}
        <a href={inquiry("برامج العمرة")}>استفسر معنا</a>.
      </div>
    );
  if (!programs.length) return fallback;
  return (
    <div className="umrah-program-grid">
      {programs.map((program) => (
        <article className="umrah-program-card" key={program.id}>
          <div className="umrah-program-image">
            <Image
              src={programImage(program.image_path)}
              alt={program.title}
              fill
              sizes="(max-width: 760px) 100vw, 33vw"
            />
          </div>
          <div className="umrah-program-copy">
            <span className="eyebrow">{program.duration}</span>
            <h3>{program.title}</h3>
            <p className="program-description">{program.description}</p>
            <dl className="program-details">
              {program.departure_date && (
                <>
                  <dt>موعد السفر</dt>
                  <dd>
                    {new Date(
                      `${program.departure_date}T12:00:00`,
                    ).toLocaleDateString("ar-EG")}
                  </dd>
                </>
              )}
              {program.mecca_hotel && (
                <>
                  <dt>فندق مكة</dt>
                  <dd>{program.mecca_hotel}</dd>
                </>
              )}
              {program.medina_hotel && (
                <>
                  <dt>فندق المدينة</dt>
                  <dd>{program.medina_hotel}</dd>
                </>
              )}
            </dl>
            <strong>{priceText(program.price)}</strong>
            <a
              className="text-link"
              href={inquiry(program.title)}
              target="_blank"
              rel="noopener noreferrer"
            >
              استفسر عن البرنامج <ArrowUpLeft size={18} />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
