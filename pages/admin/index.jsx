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
  const [serviceItemsText, setServiceItemsText] = useState("[]");
  const [aboutSkillsTitle, setAboutSkillsTitle] = useState("skills");
  const [aboutAwardsTitle, setAboutAwardsTitle] = useState("awards");
  const [aboutExperienceTitle, setAboutExperienceTitle] = useState("experience");
  const [aboutCredentialsTitle, setAboutCredentialsTitle] = useState("credentials");

  const loadContent = async () => {
    const response = await fetch("/api/admin/content");
    if (response.status === 401) return router.replace("/admin/login");
    const data = await response.json();
    setContent(data);
    setAboutDataText(JSON.stringify(data.aboutData || [], null, 2));
    setTestimonialItemsText(JSON.stringify(data.testimonials?.items || [], null, 2));
    setServiceItemsText(JSON.stringify(data.services?.items || [], null, 2));
    const tabs = data.aboutData || [];
    setAboutSkillsTitle(tabs[0]?.title || "skills");
    setAboutAwardsTitle(tabs[1]?.title || "awards");
    setAboutExperienceTitle(tabs[2]?.title || "experience");
    setAboutCredentialsTitle(tabs[3]?.title || "credentials");
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

  const saveContent = async () => {
    try {
      const aboutData = JSON.parse(aboutDataText);
      const testimonialItems = JSON.parse(testimonialItemsText);
      const serviceItems = JSON.parse(serviceItemsText);
      const patchedAboutData = [
        { ...(aboutData[0] || {}), title: aboutSkillsTitle },
        { ...(aboutData[1] || {}), title: aboutAwardsTitle },
        { ...(aboutData[2] || {}), title: aboutExperienceTitle },
        { ...(aboutData[3] || {}), title: aboutCredentialsTitle },
        ...aboutData.slice(4),
      ];

      const normalizedServiceItems = [...(serviceItems || [])];
      while (normalizedServiceItems.length < 3) normalizedServiceItems.push({ title: "", description: "", icon: "RxCrop" });

      const payload = {
        ...content,
        aboutData: patchedAboutData,
        testimonials: { ...(content.testimonials || {}), items: testimonialItems },
        services: { ...(content.services || {}), items: normalizedServiceItems },
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
      setMsg("تغییرات با موفقیت ذخیره و بازخوانی شد.");
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
                      </div>
          <button onClick={logout} className="mt-auto text-red-300 border border-red-300/25 rounded-xl py-3">خروج از حساب</button>
        </aside>

        <main className="p-4 md:p-8 lg:p-10">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-black">اطلاعات سایت</h1>
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><h2 className="font-bold mb-4">پروفایل</h2><div className="grid md:grid-cols-2 gap-4">
              <input className={baseInput} value={content.profile?.fullName || ""} onChange={(e) => update("profile.fullName", e.target.value)} placeholder="نام و نام خانوادگی" />
              <input className={baseInput} value={content.profile?.avatarImage || ""} onChange={(e) => update("profile.avatarImage", e.target.value)} placeholder="آدرس آواتار" />
              <input className={baseInput} value={content.profile?.heroTitleLine1 || ""} onChange={(e) => update("profile.heroTitleLine1", e.target.value)} placeholder="شعار سایت - خط اول" />
              <input className={baseInput} value={content.profile?.heroTitleLine2 || ""} onChange={(e) => update("profile.heroTitleLine2", e.target.value)} placeholder="شعار سایت - خط دوم" />
              <textarea rows={3} className={`${baseInput} md:col-span-2`} value={content.profile?.heroSubtitle || ""} onChange={(e) => update("profile.heroSubtitle", e.target.value)} placeholder="subheader" />
              <input className={baseInput} value={content.profile?.aboutHeadingPrefix || ""} onChange={(e) => update("profile.aboutHeadingPrefix", e.target.value)} placeholder="about header - بخش اول" />
              <input className={baseInput} value={content.profile?.aboutHeadingAccent || ""} onChange={(e) => update("profile.aboutHeadingAccent", e.target.value)} placeholder="about header - بخش دوم" />
              <input className={`${baseInput} md:col-span-2`} value={content.profile?.aboutHeadingSuffix || ""} onChange={(e) => update("profile.aboutHeadingSuffix", e.target.value)} placeholder="about header - بخش سوم" />
              <textarea rows={4} className={`${baseInput} md:col-span-2`} value={content.profile?.aboutDescription || ""} onChange={(e) => update("profile.aboutDescription", e.target.value)} placeholder="about text" />
            </div></section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><h2 className="font-bold mb-4">شمارنده‌ها</h2><div className="grid md:grid-cols-2 gap-4">
              <input type="number" className={baseInput} value={content.counters?.yearsOfExperience || 0} onChange={(e) => update("counters.yearsOfExperience", Number(e.target.value))} placeholder="سابقه کار به سال" />
              <input type="number" className={baseInput} value={content.counters?.satisfiedClients || 0} onChange={(e) => update("counters.satisfiedClients", Number(e.target.value))} placeholder="مشتری" />
              <input type="number" className={baseInput} value={content.counters?.finishedProjects || 0} onChange={(e) => update("counters.finishedProjects", Number(e.target.value))} placeholder="تعداد پروژه ها" />
              <input type="number" className={baseInput} value={content.counters?.winningAwards || 0} onChange={(e) => update("counters.winningAwards", Number(e.target.value))} placeholder="جایزه های برده شده" />
            </div></section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><h2 className="font-bold mb-4">بخش‌های دیگر</h2><div className="grid md:grid-cols-2 gap-4">
              <input className={baseInput} value={content.work?.heading || ""} onChange={(e) => update("work.heading", e.target.value)} placeholder="عنوان نمونه کار" />
              <input className={baseInput} value={content.services?.heading || ""} onChange={(e) => update("services.heading", e.target.value)} placeholder="عنوان خدمات" />
              <textarea rows={3} className={baseInput} value={content.work?.description || ""} onChange={(e) => update("work.description", e.target.value)} placeholder="توضیح نمونه کار" />
              <textarea rows={3} className={baseInput} value={content.services?.description || ""} onChange={(e) => update("services.description", e.target.value)} placeholder="متن خدمات" />
              <input className={`${baseInput} md:col-span-2`} value={content.testimonials?.heading || ""} onChange={(e) => update("testimonials.heading", e.target.value)} placeholder="عنوان نظرات" />
            </div></section>

            
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><h2 className="font-bold mb-4">سوشال مدیا هدر</h2><div className="grid md:grid-cols-2 gap-4">
              <input className={baseInput} value={content.socials?.youtube || ""} onChange={(e) => update("socials.youtube", e.target.value)} placeholder="لینک یوتیوب" />
              <input className={baseInput} value={content.socials?.instagram || ""} onChange={(e) => update("socials.instagram", e.target.value)} placeholder="لینک اینستاگرام" />
              <input className={baseInput} value={content.socials?.facebook || ""} onChange={(e) => update("socials.facebook", e.target.value)} placeholder="لینک فیسبوک" />
              <input className={baseInput} value={content.socials?.dribbble || ""} onChange={(e) => update("socials.dribbble", e.target.value)} placeholder="لینک دریبل" />
              <input className={baseInput} value={content.socials?.pinterest || ""} onChange={(e) => update("socials.pinterest", e.target.value)} placeholder="لینک پینترست" />
              <input className={baseInput} value={content.socials?.github || ""} onChange={(e) => update("socials.github", e.target.value)} placeholder="لینک گیتهاب" />
            </div></section>

            
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><h2 className="font-bold mb-4">تب‌های About</h2><div className="grid md:grid-cols-2 gap-4">
              <input className={baseInput} value={aboutSkillsTitle} onChange={(e) => setAboutSkillsTitle(e.target.value)} placeholder="skills" />
              <input className={baseInput} value={aboutAwardsTitle} onChange={(e) => setAboutAwardsTitle(e.target.value)} placeholder="awards" />
              <input className={baseInput} value={aboutExperienceTitle} onChange={(e) => setAboutExperienceTitle(e.target.value)} placeholder="experience" />
              <input className={baseInput} value={aboutCredentialsTitle} onChange={(e) => setAboutCredentialsTitle(e.target.value)} placeholder="credentials" />
            </div><p className="text-xs text-white/60 mt-3">جزئیات متن/آیکون هر تب از JSON فیلد aboutData پایین صفحه قابل ویرایش است.</p></section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><h2 className="font-bold mb-4">آیتم‌های Services</h2><div className="grid md:grid-cols-2 gap-4">
              <input className={baseInput} value={(() => { try { return (JSON.parse(serviceItemsText)[0]||{}).title || ""; } catch { return ""; } })()} onChange={(e) => { try { const arr = JSON.parse(serviceItemsText); while(arr.length<1) arr.push({title:'',description:'',icon:'RxCrop'}); arr[0] = { ...(arr[0]||{}), title: e.target.value }; setServiceItemsText(JSON.stringify(arr, null, 2)); } catch {} }} placeholder="Branding" />
              <input className={baseInput} value={(() => { try { return (JSON.parse(serviceItemsText)[1]||{}).title || ""; } catch { return ""; } })()} onChange={(e) => { try { const arr = JSON.parse(serviceItemsText); while(arr.length<2) arr.push({title:'',description:'',icon:'RxPencil2'}); arr[1] = { ...(arr[1]||{}), title: e.target.value }; setServiceItemsText(JSON.stringify(arr, null, 2)); } catch {} }} placeholder="Design" />
              <input className={baseInput} value={(() => { try { return (JSON.parse(serviceItemsText)[2]||{}).title || ""; } catch { return ""; } })()} onChange={(e) => { try { const arr = JSON.parse(serviceItemsText); while(arr.length<3) arr.push({title:'',description:'',icon:'RxDesktop'}); arr[2] = { ...(arr[2]||{}), title: e.target.value }; setServiceItemsText(JSON.stringify(arr, null, 2)); } catch {} }} placeholder="Development" />
              <textarea rows={3} className={baseInput} value={(() => { try { return (JSON.parse(serviceItemsText)[0]||{}).description || ""; } catch { return ""; } })()} onChange={(e) => { try { const arr = JSON.parse(serviceItemsText); while(arr.length<1) arr.push({title:'',description:'',icon:'RxCrop'}); arr[0] = { ...(arr[0]||{}), description: e.target.value }; setServiceItemsText(JSON.stringify(arr, null, 2)); } catch {} }} placeholder="متن Branding" />
            </div></section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><h2 className="font-bold mb-4">آرایه‌های قابل شخصی‌سازی</h2>
              <label className="text-sm text-white/70">aboutData (JSON)</label>
              <textarea rows={8} className={`${baseInput} mt-2 font-mono`} value={aboutDataText} onChange={(e) => setAboutDataText(e.target.value)} />
              <label className="text-sm text-white/70 mt-4 block">testimonial items (JSON)</label>
              <textarea rows={8} className={`${baseInput} mt-2 font-mono`} value={testimonialItemsText} onChange={(e) => setTestimonialItemsText(e.target.value)} />
                          <label className="text-sm text-white/70 mt-4 block">service items (JSON)</label>
              <textarea rows={8} className={`${baseInput} mt-2 font-mono`} value={serviceItemsText} onChange={(e) => setServiceItemsText(e.target.value)} />
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
