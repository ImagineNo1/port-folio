import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const baseInput = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-violet-400";

export default function AdminPage() {
  const router = useRouter();
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [aboutDataText, setAboutDataText] = useState("[]");
  const [testimonialItemsText, setTestimonialItemsText] = useState("[]");

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/admin/content");
      if (response.status === 401) return router.replace("/admin/login");
      const data = await response.json();
      setContent(data);
      setAboutDataText(JSON.stringify(data.aboutData || [], null, 2));
      setTestimonialItemsText(JSON.stringify(data.testimonials?.items || [], null, 2));
    };
    load();
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

  const saveContent = async () => {
    try {
      const aboutData = JSON.parse(aboutDataText);
      const testimonialItems = JSON.parse(testimonialItemsText);
      const payload = {
        ...content,
        aboutData,
        testimonials: { ...(content.testimonials || {}), items: testimonialItems },
      };
      setSaving(true);
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setMsg(response.ok ? "تغییرات ذخیره شد." : "خطا در ذخیره تغییرات");
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
            <Link href="/debug" className="block w-full text-right rounded-xl py-3 px-4 text-white/65 border border-white/10">دیباگ دیتابیس</Link>
          </div>
          <button onClick={logout} className="mt-auto text-red-300 border border-red-300/25 rounded-xl py-3">خروج از حساب</button>
        </aside>

        <main className="p-4 md:p-8 lg:p-10">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-black">اطلاعات سایت</h1>
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><h2 className="font-bold mb-4">پروفایل</h2><div className="grid md:grid-cols-2 gap-4">
              <input className={baseInput} value={content.profile?.fullName || ""} onChange={(e) => update("profile.fullName", e.target.value)} placeholder="نام کامل" />
              <input className={baseInput} value={content.profile?.avatarImage || ""} onChange={(e) => update("profile.avatarImage", e.target.value)} placeholder="آدرس آواتار" />
              <input className={baseInput} value={content.profile?.heroTitleLine1 || ""} onChange={(e) => update("profile.heroTitleLine1", e.target.value)} placeholder="عنوان هیرو ۱" />
              <input className={baseInput} value={content.profile?.heroTitleLine2 || ""} onChange={(e) => update("profile.heroTitleLine2", e.target.value)} placeholder="عنوان هیرو ۲" />
              <textarea rows={3} className={`${baseInput} md:col-span-2`} value={content.profile?.heroSubtitle || ""} onChange={(e) => update("profile.heroSubtitle", e.target.value)} placeholder="متن هیرو" />
              <input className={baseInput} value={content.profile?.aboutHeadingPrefix || ""} onChange={(e) => update("profile.aboutHeadingPrefix", e.target.value)} placeholder="پیشوند about" />
              <input className={baseInput} value={content.profile?.aboutHeadingAccent || ""} onChange={(e) => update("profile.aboutHeadingAccent", e.target.value)} placeholder="بخش رنگی about" />
              <input className={`${baseInput} md:col-span-2`} value={content.profile?.aboutHeadingSuffix || ""} onChange={(e) => update("profile.aboutHeadingSuffix", e.target.value)} placeholder="پسوند about" />
              <textarea rows={4} className={`${baseInput} md:col-span-2`} value={content.profile?.aboutDescription || ""} onChange={(e) => update("profile.aboutDescription", e.target.value)} placeholder="توضیحات درباره من" />
            </div></section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><h2 className="font-bold mb-4">شمارنده‌ها</h2><div className="grid md:grid-cols-2 gap-4">
              <input type="number" className={baseInput} value={content.counters?.yearsOfExperience || 0} onChange={(e) => update("counters.yearsOfExperience", Number(e.target.value))} placeholder="سال تجربه" />
              <input type="number" className={baseInput} value={content.counters?.satisfiedClients || 0} onChange={(e) => update("counters.satisfiedClients", Number(e.target.value))} placeholder="مشتری" />
              <input type="number" className={baseInput} value={content.counters?.finishedProjects || 0} onChange={(e) => update("counters.finishedProjects", Number(e.target.value))} placeholder="پروژه" />
              <input type="number" className={baseInput} value={content.counters?.winningAwards || 0} onChange={(e) => update("counters.winningAwards", Number(e.target.value))} placeholder="جایزه" />
            </div></section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><h2 className="font-bold mb-4">بخش‌های دیگر</h2><div className="grid md:grid-cols-2 gap-4">
              <input className={baseInput} value={content.work?.heading || ""} onChange={(e) => update("work.heading", e.target.value)} placeholder="عنوان نمونه کار" />
              <input className={baseInput} value={content.services?.heading || ""} onChange={(e) => update("services.heading", e.target.value)} placeholder="عنوان خدمات" />
              <textarea rows={3} className={baseInput} value={content.work?.description || ""} onChange={(e) => update("work.description", e.target.value)} placeholder="توضیح نمونه کار" />
              <textarea rows={3} className={baseInput} value={content.services?.description || ""} onChange={(e) => update("services.description", e.target.value)} placeholder="توضیح خدمات" />
              <input className={`${baseInput} md:col-span-2`} value={content.testimonials?.heading || ""} onChange={(e) => update("testimonials.heading", e.target.value)} placeholder="عنوان نظرات" />
            </div></section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><h2 className="font-bold mb-4">آرایه‌های قابل شخصی‌سازی</h2>
              <label className="text-sm text-white/70">aboutData (JSON)</label>
              <textarea rows={8} className={`${baseInput} mt-2 font-mono`} value={aboutDataText} onChange={(e) => setAboutDataText(e.target.value)} />
              <label className="text-sm text-white/70 mt-4 block">testimonial items (JSON)</label>
              <textarea rows={8} className={`${baseInput} mt-2 font-mono`} value={testimonialItemsText} onChange={(e) => setTestimonialItemsText(e.target.value)} />
            </section>

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
