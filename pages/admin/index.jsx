import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const inputClass = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-violet-400";
const cardClass = "rounded-2xl border border-white/10 bg-white/[0.04] p-6";

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs text-white/70 mb-2 block">{label}</label>
      {children}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  const [aboutDataText, setAboutDataText] = useState("[]");
  const [testimonialItemsText, setTestimonialItemsText] = useState("[]");
  const [serviceItemsText, setServiceItemsText] = useState("[]");

  const loadContent = async () => {
    const response = await fetch("/api/admin/content");
    if (response.status === 401) return router.replace("/admin/login");
    const data = await response.json();
    setContent(data);
    setAboutDataText(JSON.stringify(data.aboutData || [], null, 2));
    setTestimonialItemsText(JSON.stringify(data.testimonials?.items || [], null, 2));
    setServiceItemsText(JSON.stringify(data.services?.items || [], null, 2));
  };

  useEffect(() => {
    loadContent();
  }, [router]);

  const update = (path, value) => {
    setContent((prev) => {
      const next = { ...prev };
      const [a, b] = path.split(".");
      if (b) next[a] = { ...next[a], [b]: value };
      else next[a] = value;
      return next;
    });
  };

  const tabItems = useMemo(() => ([
    { key: "home", label: "Home" },
    { key: "about", label: "About" },
    { key: "services", label: "Services" },
    { key: "work", label: "Work" },
    { key: "testimonials", label: "Testimonials" },
    { key: "header", label: "Header/Social" },
    { key: "advanced", label: "Advanced" },
  ]), []);

  const saveContent = async () => {
    try {
      const aboutData = JSON.parse(aboutDataText);
      const testimonialItems = JSON.parse(testimonialItemsText);
      const serviceItems = JSON.parse(serviceItemsText);

      const payload = {
        ...content,
        aboutData,
        testimonials: { ...(content.testimonials || {}), items: testimonialItems },
        services: { ...(content.services || {}), items: serviceItems },
      };

      setSaving(true);
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        setMsg(err.message || "خطا در ذخیره تغییرات");
        return;
      }

      await loadContent();
      setMsg("تغییرات با موفقیت ذخیره و در صفحه اصلی قابل مشاهده است.");
    } catch (e) {
      setMsg(`JSON نامعتبر است: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    document.cookie = "admin_token=; Max-Age=0; path=/";
    router.push("/admin/login");
  };

  if (!content) return <div className="min-h-screen grid place-items-center text-white bg-[#030b24]">در حال بارگذاری...</div>;

  return (
    <div dir="rtl" className="min-h-screen text-white bg-[#030b24] bg-[radial-gradient(circle_at_35%_25%,rgba(120,84,255,0.15),transparent_45%),radial-gradient(circle_at_60%_55%,rgba(255,89,170,0.12),transparent_40%)]">
      <div className="grid lg:grid-cols-[260px_1fr] min-h-screen">
        <aside className="border-l border-white/10 bg-[#020a21]/80 p-6 flex flex-col">
          <div className="space-y-2 text-sm">
            <p className="text-xs text-white/50">پنل مدیریت</p>
            <p className="font-semibold">admin</p>
            <Link href="/admin" className="block w-full text-right rounded-xl py-3 px-4 bg-gradient-to-r from-purple-600/40 to-pink-500/40 border border-purple-300/20 mt-6">اطلاعات سایت</Link>
            <Link href="/admin/password" className="block w-full text-right rounded-xl py-3 px-4 text-white/65 border border-white/10">تغییر رمز عبور</Link>
            <Link href="/admin/contacts" className="block w-full text-right rounded-xl py-3 px-4 text-white/65 border border-white/10">Contacts</Link>
          </div>
          <button onClick={logout} className="mt-auto text-red-300 border border-red-300/25 rounded-xl py-3">خروج از حساب</button>
        </aside>

        <main className="p-4 md:p-8 lg:p-10">
          <div className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-3xl font-black">اطلاعات سایت</h1>

            <div className="flex flex-wrap gap-2">
              {tabItems.map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 rounded-xl border text-sm ${activeTab === tab.key ? "bg-purple-600/30 border-purple-400/30" : "bg-white/5 border-white/10 text-white/70"}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "home" && (
              <section className={cardClass}>
                <h2 className="font-bold mb-4">Home</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="نام و نام خانوادگی"><input className={inputClass} value={content.profile?.fullName || ""} onChange={(e) => update("profile.fullName", e.target.value)} /></Field>
                  <Field label="آدرس آواتار"><input className={inputClass} value={content.profile?.avatarImage || ""} onChange={(e) => update("profile.avatarImage", e.target.value)} /></Field>
                  <Field label="شعار سایت - خط اول"><input className={inputClass} value={content.profile?.heroTitleLine1 || ""} onChange={(e) => update("profile.heroTitleLine1", e.target.value)} /></Field>
                  <Field label="شعار سایت - خط دوم"><input className={inputClass} value={content.profile?.heroTitleLine2 || ""} onChange={(e) => update("profile.heroTitleLine2", e.target.value)} /></Field>
                  <div className="md:col-span-2"><Field label="subheader"><textarea rows={4} className={inputClass} value={content.profile?.heroSubtitle || ""} onChange={(e) => update("profile.heroSubtitle", e.target.value)} /></Field></div>
                </div>
              </section>
            )}

            {activeTab === "about" && (
              <section className={cardClass}><h2 className="font-bold mb-4">About</h2><div className="grid md:grid-cols-2 gap-4">
                <Field label="about header - بخش اول"><input className={inputClass} value={content.profile?.aboutHeadingPrefix || ""} onChange={(e) => update("profile.aboutHeadingPrefix", e.target.value)} /></Field>
                <Field label="about header - بخش دوم"><input className={inputClass} value={content.profile?.aboutHeadingAccent || ""} onChange={(e) => update("profile.aboutHeadingAccent", e.target.value)} /></Field>
                <div className="md:col-span-2"><Field label="about header - بخش سوم"><input className={inputClass} value={content.profile?.aboutHeadingSuffix || ""} onChange={(e) => update("profile.aboutHeadingSuffix", e.target.value)} /></Field></div>
                <div className="md:col-span-2"><Field label="about text"><textarea rows={4} className={inputClass} value={content.profile?.aboutDescription || ""} onChange={(e) => update("profile.aboutDescription", e.target.value)} /></Field></div>
                <Field label="سابقه کار به سال"><input type="number" className={inputClass} value={content.counters?.yearsOfExperience || 0} onChange={(e) => update("counters.yearsOfExperience", Number(e.target.value))} /></Field>
                <Field label="مشتری"><input type="number" className={inputClass} value={content.counters?.satisfiedClients || 0} onChange={(e) => update("counters.satisfiedClients", Number(e.target.value))} /></Field>
                <Field label="تعداد پروژه ها"><input type="number" className={inputClass} value={content.counters?.finishedProjects || 0} onChange={(e) => update("counters.finishedProjects", Number(e.target.value))} /></Field>
                <Field label="جایزه های برده شده"><input type="number" className={inputClass} value={content.counters?.winningAwards || 0} onChange={(e) => update("counters.winningAwards", Number(e.target.value))} /></Field>
              </div></section>
            )}

            {activeTab === "services" && (
              <section className={cardClass}><h2 className="font-bold mb-4">Services</h2><div className="grid md:grid-cols-2 gap-4">
                <Field label="عنوان خدمات"><input className={inputClass} value={content.services?.heading || ""} onChange={(e) => update("services.heading", e.target.value)} /></Field>
                <div className="md:col-span-2"><Field label="متن خدمات"><textarea rows={4} className={inputClass} value={content.services?.description || ""} onChange={(e) => update("services.description", e.target.value)} /></Field></div>
                <div className="md:col-span-2"><Field label="service items (JSON)"><textarea rows={8} className={`${inputClass} font-mono`} value={serviceItemsText} onChange={(e) => setServiceItemsText(e.target.value)} /></Field></div>
              </div></section>
            )}

            {activeTab === "work" && (
              <section className={cardClass}><h2 className="font-bold mb-4">Work</h2><div className="grid md:grid-cols-2 gap-4">
                <Field label="عنوان نمونه کار"><input className={inputClass} value={content.work?.heading || ""} onChange={(e) => update("work.heading", e.target.value)} /></Field>
                <div className="md:col-span-2"><Field label="متن کارها"><textarea rows={4} className={inputClass} value={content.work?.description || ""} onChange={(e) => update("work.description", e.target.value)} /></Field></div>
              </div></section>
            )}

            {activeTab === "testimonials" && (
              <section className={cardClass}><h2 className="font-bold mb-4">Testimonials</h2><div className="grid md:grid-cols-2 gap-4">
                <Field label="عنوان نظرات"><input className={inputClass} value={content.testimonials?.heading || ""} onChange={(e) => update("testimonials.heading", e.target.value)} /></Field>
                <div className="md:col-span-2"><Field label="testimonial items (JSON)"><textarea rows={8} className={`${inputClass} font-mono`} value={testimonialItemsText} onChange={(e) => setTestimonialItemsText(e.target.value)} /></Field></div>
              </div></section>
            )}

            {activeTab === "header" && (
              <section className={cardClass}><h2 className="font-bold mb-4">Header/Social</h2><div className="grid md:grid-cols-2 gap-4">
                <Field label="لینک یوتیوب"><input className={inputClass} value={content.socials?.youtube || ""} onChange={(e) => update("socials.youtube", e.target.value)} /></Field>
                <Field label="لینک اینستاگرام"><input className={inputClass} value={content.socials?.instagram || ""} onChange={(e) => update("socials.instagram", e.target.value)} /></Field>
                <Field label="لینک فیسبوک"><input className={inputClass} value={content.socials?.facebook || ""} onChange={(e) => update("socials.facebook", e.target.value)} /></Field>
                <Field label="لینک دریبل"><input className={inputClass} value={content.socials?.dribbble || ""} onChange={(e) => update("socials.dribbble", e.target.value)} /></Field>
                <Field label="لینک پینترست"><input className={inputClass} value={content.socials?.pinterest || ""} onChange={(e) => update("socials.pinterest", e.target.value)} /></Field>
                <Field label="لینک گیتهاب"><input className={inputClass} value={content.socials?.github || ""} onChange={(e) => update("socials.github", e.target.value)} /></Field>
              </div></section>
            )}

            {activeTab === "advanced" && (
              <section className={cardClass}><h2 className="font-bold mb-4">Advanced JSON</h2>
                <Field label="aboutData (JSON)"><textarea rows={10} className={`${inputClass} font-mono`} value={aboutDataText} onChange={(e) => setAboutDataText(e.target.value)} /></Field>
              </section>
            )}

            <div className="sticky bottom-4">
              <button onClick={saveContent} disabled={saving} className="w-full rounded-xl py-3 bg-gradient-to-r from-purple-600 to-pink-500 font-semibold">{saving ? "در حال ذخیره..." : "ذخیره تغییرات"}</button>
              {msg ? <p className="text-center text-sm text-white/75 mt-2">{msg}</p> : null}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
