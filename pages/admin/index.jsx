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
  const [cropX, setCropX] = useState(50);
  const [cropY, setCropY] = useState(50);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropTargetPath, setCropTargetPath] = useState("profile.homeAvatarImage");
  const [cropSquare, setCropSquare] = useState(false);
  const [cropSource, setCropSource] = useState("");
  const [previewData, setPreviewData] = useState("");
  const [alpha, setAlpha] = useState(1);


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
    { key: "site", label: "مشخصات سایت" },
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

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (!content) return <div className="min-h-screen grid place-items-center text-white bg-[#030b24]">در حال بارگذاری...</div>;

  return (
    <div dir="rtl" className="min-h-screen text-white bg-[#030b24] bg-[radial-gradient(circle_at_35%_25%,rgba(120,84,255,0.15),transparent_45%),radial-gradient(circle_at_60%_55%,rgba(255,89,170,0.12),transparent_40%)]">
      <div className="grid lg:grid-cols-[260px_1fr] min-h-screen">
        <aside className="border-l border-white/10 bg-[#020a21]/80 p-6 flex flex-col">
          <div className="space-y-2 text-sm">
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
                  <Field label="تصویر Home (آپلود)"><input type="file" accept="image/*" className={inputClass} onChange={(e) => openCropper(e, "profile.homeAvatarImage", false, content.profile?.homeAvatarOpacity ?? 1)} /><p className="text-xs text-white/50 mt-2">برای بهترین نتیجه، عکس PNG شفاف (بدون بک‌گراند) آپلود کنید؛ سپس X/Y را برای جای‌گذاری تنظیم کنید.</p></Field>
                  <div className="md:col-span-2"><Field label="شعار سایت"><input className={inputClass} value={[content.profile?.heroTitleLine1 || "", content.profile?.heroTitleLine2 || ""].filter(Boolean).join(" ")} onChange={(e) => { const val = e.target.value; const mid = Math.ceil(val.length / 2); update("profile.heroTitleLine1", val.slice(0, mid).trim()); update("profile.heroTitleLine2", val.slice(mid).trim()); }} /></Field></div>
                  <div className="md:col-span-2"><Field label="subheader"><textarea rows={4} className={inputClass} value={content.profile?.heroSubtitle || ""} onChange={(e) => update("profile.heroSubtitle", e.target.value)} /></Field></div>
                </div>
              </section>
            )}

            {activeTab === "about" && (
              <section className={cardClass}><h2 className="font-bold mb-4">About</h2><div className="grid md:grid-cols-2 gap-4">
                <Field label="تصویر سمت چپ About (آپلود)"><input type="file" accept="image/*" className={inputClass} onChange={(e) => openCropper(e, "profile.aboutAvatarImage", false, content.profile?.aboutAvatarOpacity ?? 1)} /></Field>
                <div className="md:col-span-2"><Field label="about header"><input className={inputClass} value={[content.profile?.aboutHeadingPrefix || "", content.profile?.aboutHeadingAccent || "", content.profile?.aboutHeadingSuffix || ""].filter(Boolean).join(" ")} onChange={(e) => { const parts = e.target.value.trim().split(/\s+/); const one = Math.ceil(parts.length/3); const two = Math.ceil((parts.length-one)/2); update("profile.aboutHeadingPrefix", parts.slice(0, one).join(" ")); update("profile.aboutHeadingAccent", parts.slice(one, one+two).join(" ")); update("profile.aboutHeadingSuffix", parts.slice(one+two).join(" ")); }} /></Field></div>
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
                              </div></section>
            )}

            {activeTab === "header" && (
              <section className={cardClass}><h2 className="font-bold mb-4">Header/Social</h2><div className="grid md:grid-cols-2 gap-4">
                <Field label="لینک یوتیوب"><input className={inputClass} value={content.socials?.youtube || ""} onChange={(e) => update("socials.youtube", e.target.value)} /></Field>
                <Field label="لینک اینستاگرام"><input className={inputClass} value={content.socials?.instagram || ""} onChange={(e) => update("socials.instagram", e.target.value)} /></Field>
                <Field label="لینک فیسبوک"><input className={inputClass} value={content.socials?.facebook || ""} onChange={(e) => update("socials.facebook", e.target.value)} /></Field>
                                <Field label="لینک پینترست"><input className={inputClass} value={content.socials?.pinterest || ""} onChange={(e) => update("socials.pinterest", e.target.value)} /></Field>
                <Field label="لینک تلگرام"><input className={inputClass} value={content.socials?.telegram || ""} onChange={(e) => update("socials.telegram", e.target.value)} /></Field>
                <Field label="لینک واتساپ"><input className={inputClass} value={content.socials?.whatsapp || ""} onChange={(e) => update("socials.whatsapp", e.target.value)} /></Field>
              </div></section>
            )}

            {activeTab === "site" && (
              <section className={cardClass}><h2 className="font-bold mb-4">مشخصات سایت</h2><div className="grid md:grid-cols-2 gap-4">
                <Field label="Title سایت (تگ title)"><input className={inputClass} value={content.siteSettings?.title || ""} onChange={(e) => update("siteSettings.title", e.target.value)} /></Field>
                <Field label="Favicon (آپلود)"><input type="file" accept="image/*" className={inputClass} onChange={(e) => openCropper(e, "siteSettings.favicon", true, 1)} /></Field>
                <div className="md:col-span-2 rounded-xl border border-white/10 p-4">
                  <p className="text-sm mb-2">نوار تنظیم کراپ قبل از آپلود</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <label className="text-xs">Crop X: {cropX}<input type="range" min="0" max="100" value={cropX} onChange={(e)=>setCropX(Number(e.target.value))} className="w-full"/></label>
                    <label className="text-xs">Crop Y: {cropY}<input type="range" min="0" max="100" value={cropY} onChange={(e)=>setCropY(Number(e.target.value))} className="w-full"/></label>
                  </div>
                </div>
              </div></section>
            )}


            {cropOpen && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0b122f] p-5 space-y-4">
                  <h3 className="font-bold">کراپ و تنظیم شفافیت تصویر</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-white/60 mb-2">پیش‌نمایش</p>
                      {previewData ? <img src={previewData} alt="preview" className="rounded-xl border border-white/10 max-h-[420px]" /> : null}
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs">Crop X: {cropX}<input type="range" min="0" max="100" value={cropX} onChange={(e)=>{ const v=Number(e.target.value); setCropX(v); renderCropPreview(cropSource, cropSquare, v, cropY, alpha); }} className="w-full"/></label>
                      <label className="text-xs">Crop Y: {cropY}<input type="range" min="0" max="100" value={cropY} onChange={(e)=>{ const v=Number(e.target.value); setCropY(v); renderCropPreview(cropSource, cropSquare, cropX, v, alpha); }} className="w-full"/></label>
                      <label className="text-xs">Transparency: {alpha.toFixed(2)}<input type="range" min="0.2" max="1" step="0.01" value={alpha} onChange={(e)=>{ const v=Number(e.target.value); setAlpha(v); renderCropPreview(cropSource, cropSquare, cropX, cropY, v); }} className="w-full"/></label>
                      <div className="flex gap-2">
                        <button onClick={applyCrop} className="px-4 py-2 rounded-xl bg-purple-600">اعمال</button>
                        <button onClick={()=>setCropOpen(false)} className="px-4 py-2 rounded-xl border border-white/20">بستن</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
