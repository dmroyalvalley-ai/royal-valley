"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowUpLeft,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Plus,
  Save,
  Sparkles,
} from "lucide-react";
import { Brand } from "@/components/brand";
import {
  getSupabase,
  programImage,
  priceText,
  type Program,
} from "@/lib/supabase";

const empty = {
  title: "",
  description: "",
  duration: "",
  price: "",
  departure_date: "",
  mecca_hotel: "",
  medina_hotel: "",
  published: false,
  sort_order: "0",
};
type Form = typeof empty;

export function AdminDashboard() {
  const [access, setAccess] = useState<
    "loading" | "setup" | "login" | "denied" | "admin"
  >("loading");
  const [programs, setPrograms] = useState<Program[]>([]);
  const [form, setForm] = useState<Form>(empty);
  const [editing, setEditing] = useState<Program | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const editor = useRef<HTMLFormElement>(null);
  const db = getSupabase();

  useEffect(() => {
    if (!db) {
      setAccess("setup");
      return;
    }
    let active = true;
    let generation = 0;
    const verify = async (id?: string) => {
      const ticket = ++generation;
      if (!id) {
        setAccess("login");
        setPrograms([]);
        return;
      }
      setAccess("loading");
      try {
        const { data, error } = await db
          .from("admin_users")
          .select("user_id")
          .eq("user_id", id)
          .maybeSingle();
        if (active && ticket === generation)
          setAccess(!error && data ? "admin" : "denied");
      } catch {
        if (active && ticket === generation) setAccess("denied");
      }
    };
    db.auth
      .getSession()
      .then(({ data }) => {
        if (active) void verify(data.session?.user.id);
      })
      .catch(() => {
        if (active) setAccess("login");
      });
    const {
      data: { subscription },
    } = db.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => {
        if (active) void verify(session?.user.id);
      }, 0);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [db]);

  async function refresh() {
    if (!db) return;
    setLoading(true);
    try {
      const result = await db
        .from("umrah_programs")
        .select("*")
        .order("sort_order")
        .order("created_at", { ascending: false });
      if (result.error) throw result.error;
      setPrograms(result.data ?? []);
    } catch {
      setError(
        "تعذّر تحميل البرامج. تأكد من الاتصال وتشغيل ملف SQL، ثم أعد المحاولة.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (access === "admin") void refresh();
  }, [access]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function reset() {
    setEditing(null);
    setForm({ ...empty });
    setFile(null);
    if (fileInput.current) fileInput.current.value = "";
  }
  function edit(program: Program) {
    setEditing(program);
    setFile(null);
    setError("");
    setMessage("");
    if (fileInput.current) fileInput.current.value = "";
    setForm({
      title: program.title,
      description: program.description,
      duration: program.duration,
      price: program.price?.toString() ?? "",
      departure_date: program.departure_date ?? "",
      mecca_hotel: program.mecca_hotel,
      medina_hotel: program.medina_hotel,
      published: program.published,
      sort_order: String(program.sort_order),
    });
    editor.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db) return;
    setBusy(true);
    setError("");
    try {
      const { error } = await db.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      setPassword("");
    } catch {
      setError("تعذّر تسجيل الدخول. راجع البريد وكلمة المرور واتصال الإنترنت.");
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    if (!db) return;
    setBusy(true);
    setError("");
    try {
      const { error } = await db.auth.signOut();
      if (error) throw error;
      reset();
      setPrograms([]);
      setMessage("");
    } catch {
      setError("تعذّر تسجيل الخروج. حاول مرة أخرى.");
    } finally {
      setBusy(false);
    }
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || access !== "admin" || busy) return;
    setError("");
    setMessage("");
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.duration.trim()
    ) {
      setError("اكتب اسم البرنامج والمدة والتفاصيل.");
      return;
    }
    if (!file && !editing?.image_path) {
      setError("اختار صورة للبرنامج أولًا.");
      return;
    }
    setBusy(true);
    let uploaded = "";
    try {
      let imagePath = editing?.image_path ?? "";
      if (file) {
        const extension = (
          {
            "image/jpeg": "jpg",
            "image/png": "png",
            "image/webp": "webp",
          } as Record<string, string>
        )[file.type];
        if (!extension || file.size > 5 * 1024 * 1024)
          throw new Error("اختار صورة JPG أو PNG أو WebP بحد أقصى 5 ميجابايت.");
        imagePath = `${crypto.randomUUID()}.${extension}`;
        const { error } = await db.storage
          .from("umrah-images")
          .upload(imagePath, file, { contentType: file.type, upsert: false });
        if (error)
          throw new Error("تعذّر رفع الصورة. راجع إعدادات التخزين والصلاحيات.");
        uploaded = imagePath;
      }
      const payload = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        duration: form.duration.trim(),
        price: form.price === "" ? null : Number(form.price),
        sort_order: Number(form.sort_order),
        departure_date: form.departure_date || null,
        image_path: imagePath,
      };
      const result = editing
        ? await db
            .from("umrah_programs")
            .update(payload)
            .eq("id", editing.id)
            .select("id")
            .single()
        : await db.from("umrah_programs").insert(payload).select("id").single();
      if (result.error)
        throw new Error(
          "لم يتم حفظ البرنامج. راجع الاتصال وصلاحيات الإدارة ثم حاول مرة أخرى.",
        );
      // Retain replaced images: deleting an old public asset could break cached pages.
      uploaded = "";
      reset();
      setMessage(
        form.published
          ? "تم حفظ ونشر البرنامج. هيظهر في الموقع عند فتح الصفحة أو تحديثها."
          : "تم حفظ البرنامج كمسودة، ولن يظهر للزوار.",
      );
      await refresh();
    } catch (cause) {
      if (uploaded)
        await db.storage
          .from("umrah-images")
          .remove([uploaded])
          .catch(() => {});
      setError(
        cause instanceof Error ? cause.message : "تعذّر الحفظ، حاول مرة أخرى.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function toggle(program: Program) {
    if (!db || busy) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const { error } = await db
        .from("umrah_programs")
        .update({ published: !program.published })
        .eq("id", program.id)
        .select("id")
        .single();
      if (error) throw error;
      if (editing?.id === program.id)
        setForm((current) => ({ ...current, published: !program.published }));
      setMessage(
        program.published ? "تم إخفاء البرنامج من الموقع." : "تم نشر البرنامج.",
      );
      await refresh();
    } catch {
      setError("تعذّر تغيير حالة البرنامج. حاول مرة أخرى.");
    } finally {
      setBusy(false);
    }
  }
  const visible = programs.filter(
    (p) =>
      (filter === "all" || p.published === (filter === "published")) &&
      p.title.includes(search),
  );
  const image = preview || (editing ? programImage(editing.image_path) : "");

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Brand href="/" light />
        <div className="admin-sidebar-label">مساحة الإدارة</div>
        <a className="admin-nav-active" href="/admin/">
          <LayoutDashboard size={20} /> برامج العمرة
        </a>
        <a href="/" target="_blank" rel="noopener noreferrer">
          عرض الموقع <ArrowUpLeft size={18} />
        </a>
        <div className="admin-sidebar-note">
          <Sparkles size={25} />
          <p>
            كل رحلة جميلة
            <br />
            تبدأ بتفاصيل مرتّبة.
          </p>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <span className="eyebrow">رويال فالي / لوحة التحكم</span>
            <h1>برامج العمرة</h1>
            <p>أضف رحلة جديدة، وخلّي تفاصيلها تحكي عنها.</p>
          </div>
          {access === "admin" && (
            <button
              className="admin-secondary"
              onClick={logout}
              disabled={busy}
            >
              <LogOut size={17} /> خروج
            </button>
          )}
        </header>
        {error && (
          <div className="admin-alert admin-error" role="alert">
            {error}
          </div>
        )}
        {message && (
          <div className="admin-alert" role="status">
            {message}
          </div>
        )}
        {access === "loading" ? (
          <p role="status">جاري التحقق من حسابك…</p>
        ) : access === "login" ? (
          <form className="admin-login admin-panel" onSubmit={login}>
            <span className="admin-login-icon">
              <LayoutDashboard />
            </span>
            <h2>أهلًا بيك من جديد</h2>
            <p>سجّل دخولك لإدارة برامج رويال فالي.</p>
            <label>
              البريد الإلكتروني
              <input
                type="email"
                dir="ltr"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              كلمة المرور
              <input
                type="password"
                dir="ltr"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button className="button button-red" disabled={busy}>
              {busy ? "جاري الدخول…" : "تسجيل الدخول"}
            </button>
          </form>
        ) : access === "denied" ? (
          <div className="admin-panel">
            <h2>الحساب غير مصرح له بالإدارة</h2>
            <p>
              تأكد من إضافة حسابك إلى قائمة المديرين وإكمال إعداد قاعدة
              البيانات.
            </p>
            <button
              className="admin-secondary"
              disabled={busy}
              onClick={logout}
            >
              تسجيل الخروج
            </button>
          </div>
        ) : (
          <>
            {access === "setup" && (
              <div className="admin-alert">
                معاينة لوحة الإدارة — الحفظ ورفع الصور هيتفعّلوا بعد ربط
                Supabase. اتبع ملف supabase/README.md في المشروع.
              </div>
            )}
            <div className="admin-stats">
              <div>
                <span>إجمالي البرامج</span>
                <strong>{programs.length}</strong>
              </div>
              <div>
                <span>منشور على الموقع</span>
                <strong>{programs.filter((p) => p.published).length}</strong>
              </div>
              <div>
                <span>مسودات</span>
                <strong>{programs.filter((p) => !p.published).length}</strong>
              </div>
            </div>
            <div className="admin-workspace">
              <section className="admin-library">
                <div className="admin-section-title">
                  <h2>مكتبة البرامج</h2>
                  <button
                    className="admin-secondary"
                    disabled={busy}
                    onClick={() => {
                      reset();
                      editor.current?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <Plus size={17} /> برنامج جديد
                  </button>
                </div>
                <div className="admin-filters">
                  <input
                    aria-label="ابحث عن برنامج"
                    placeholder="ابحث باسم البرنامج…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <select
                    aria-label="حالة النشر"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">كل البرامج</option>
                    <option value="published">المنشورة</option>
                    <option value="draft">المسودات</option>
                  </select>
                </div>
                {loading ? (
                  <p role="status">جاري تحميل البرامج…</p>
                ) : !visible.length ? (
                  <div className="admin-empty">
                    <ImagePlus size={38} />
                    <h3>
                      {programs.length
                        ? "مفيش برامج مطابقة"
                        : "أول رحلة تبدأ من هنا"}
                    </h3>
                    <p>
                      {programs.length
                        ? "جرّب اسم أو فلتر مختلف."
                        : "أضف صورة وتفاصيل برنامج العمرة، وراجعه قبل النشر."}
                    </p>
                  </div>
                ) : (
                  <div className="admin-program-grid">
                    {visible.map((p) => (
                      <article className="admin-program-card" key={p.id}>
                        <div className="admin-program-photo">
                          <img src={programImage(p.image_path)} alt={p.title} />
                          <span
                            className={
                              p.published
                                ? "admin-badge published"
                                : "admin-badge"
                            }
                          >
                            {p.published ? "منشور" : "مسودة"}
                          </span>
                        </div>
                        <div className="admin-program-body">
                          <span>{p.duration}</span>
                          <h3>{p.title}</h3>
                          <p>{p.description}</p>
                          <strong>{priceText(p.price)}</strong>
                          <div className="admin-card-actions">
                            <button disabled={busy} onClick={() => edit(p)}>
                              تعديل التفاصيل
                            </button>
                            <button disabled={busy} onClick={() => toggle(p)}>
                              {p.published ? "إخفاء" : "نشر"}
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
                {access === "admin" && (
                  <button
                    className="admin-secondary admin-refresh"
                    disabled={loading || busy}
                    onClick={() => {
                      setError("");
                      void refresh();
                    }}
                  >
                    تحديث القائمة
                  </button>
                )}
              </section>
              <form
                ref={editor}
                className="admin-panel admin-editor"
                onSubmit={save}
              >
                <div className="admin-section-title">
                  <h2>{editing ? "تعديل البرنامج" : "إضافة برنامج"}</h2>
                  <span>صورة + تفاصيل</span>
                </div>
                <fieldset disabled={busy}>
                  <label className="admin-upload">
                    {image ? (
                      <img src={image} alt="معاينة صورة البرنامج" />
                    ) : (
                      <span>
                        <ImagePlus size={32} /> اختار صورة للبرنامج
                      </span>
                    )}
                    <input
                      ref={fileInput}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const picked = e.target.files?.[0] ?? null;
                        if (
                          picked &&
                          (!["image/jpeg", "image/png", "image/webp"].includes(
                            picked.type,
                          ) ||
                            picked.size > 5242880)
                        ) {
                          setError(
                            "الصورة لازم تكون JPG أو PNG أو WebP وأقل من 5 ميجابايت.",
                          );
                          e.target.value = "";
                          setFile(null);
                          return;
                        }
                        setFile(picked);
                        setError("");
                      }}
                    />
                    <small>JPG / PNG / WebP · حتى 5 ميجابايت</small>
                  </label>
                  <label>
                    اسم البرنامج *
                    <input
                      required
                      maxLength={160}
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="مثال: عمرة رمضان — ١٤ يوم"
                    />
                  </label>
                  <label>
                    تفاصيل البرنامج *
                    <textarea
                      required
                      maxLength={6000}
                      rows={5}
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="اكتب تفاصيل الرحلة والخدمات المشمولة…"
                    />
                  </label>
                  <div className="admin-form-row">
                    <label>
                      المدة *
                      <input
                        required
                        maxLength={80}
                        value={form.duration}
                        onChange={(e) =>
                          setForm({ ...form, duration: e.target.value })
                        }
                        placeholder="١٤ يوم / ١٣ ليلة"
                      />
                    </label>
                    <label>
                      السعر يبدأ من (جنيه)
                      <input
                        type="number"
                        min="0"
                        max="99999999"
                        step="0.01"
                        value={form.price}
                        onChange={(e) =>
                          setForm({ ...form, price: e.target.value })
                        }
                        placeholder="اختياري"
                      />
                    </label>
                  </div>
                  <label>
                    موعد السفر
                    <input
                      type="date"
                      value={form.departure_date}
                      onChange={(e) =>
                        setForm({ ...form, departure_date: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    فندق مكة
                    <input
                      maxLength={200}
                      value={form.mecca_hotel}
                      onChange={(e) =>
                        setForm({ ...form, mecca_hotel: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    فندق المدينة
                    <input
                      maxLength={200}
                      value={form.medina_hotel}
                      onChange={(e) =>
                        setForm({ ...form, medina_hotel: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    ترتيب العرض
                    <input
                      type="number"
                      min="0"
                      max="99999"
                      step="1"
                      required
                      value={form.sort_order}
                      onChange={(e) =>
                        setForm({ ...form, sort_order: e.target.value })
                      }
                    />
                    <small>الأرقام الأصغر تظهر أولًا.</small>
                  </label>
                  <label className="admin-publish">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) =>
                        setForm({ ...form, published: e.target.checked })
                      }
                    />
                    <span>
                      نشر البرنامج على الموقع
                      <small>اتركه غير محدد لحفظ البرنامج كمسودة.</small>
                    </span>
                  </label>
                  <button
                    className="button button-red admin-save"
                    type="submit"
                    disabled={access !== "admin" || busy}
                  >
                    <Save size={18} />
                    {busy ? "جاري الحفظ…" : "حفظ البرنامج"}
                  </button>
                  {editing && (
                    <button
                      type="button"
                      className="admin-secondary"
                      onClick={reset}
                    >
                      إلغاء التعديل
                    </button>
                  )}
                </fieldset>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
