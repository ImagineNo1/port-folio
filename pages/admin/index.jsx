import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const sections = [
  {
    title: "اطلاعات پروفایل",
    fields: [
      ["fullName", "نام کامل"],
      ["email", "ایمیل"],
      ["phone", "تلفن"],
      ["address", "آدرس"],
      ["avatarImage", "آدرس تصویر آواتار", true],
    ],
  },
  {
    title: "بخش هیرو",
    fields: [
      ["heroTitleLine1", "عنوان خط اول"],
      ["heroTitleLine2", "عنوان خط دوم"],
      ["heroSubtitle", "توضیحات هیرو", true],
    ],
  },
  {
    title: "بخش درباره من",
    fields: [
      ["aboutHeadingPrefix", "پیشوند عنوان"],
      ["aboutHeadingAccent", "بخش برجسته عنوان"],
      ["aboutHeadingSuffix", "پسوند عنوان", true],
      ["aboutDescription", "توضیحات درباره من", true],
    ],
  },
];

export default function AdminPage() {
  const router = useRouter();
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/admin/content");
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = await response.json();
      setContent(data);
    };
    load();
  }, [router]);

  const updateField = (key, value) => setContent((prev) => ({ ...prev, [key]: value }));

  const saveContent = async () => {
    setSaving(true);
    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setMsg(response.ok ? "تغییرات ذخیره شد." : "خطا در ذخیره تغییرات");
    setSaving(false);
  };

  const logout = () => {
    document.cookie = "admin_token=; Max-Age=0; path=/";
    router.push("/admin/login");
  };

  if (!content) return <div className="min-h-screen grid place-items-center text-white bg-[#030b24]">در حال بارگذاری...</div>;

  return (
    <div dir="rtl" className="min-h-screen text-white bg-[#030b24] bg-[radial-gradient(circle_at_35%_25%,rgba(120,84,255,0.15),transparent_45%),radial-gradient(circle_at_60%_55%,rgba(255,89,170,0.12),transparent_40%)]">
      <div className="grid lg:grid-cols-[260px_1fr] min-h-screen">
        <aside className="order-2 lg:order-1 border-l border-white/10 bg-[#020a21]/80 p-6 flex flex-col">
          <div>
            <p className="text-xs text-white/50">پنل مدیریت</p>
            <p className="font-semibold">admin</p>
            <div className="mt-8 space-y-2 text-sm">
              <button className="w-full text-right rounded-xl py-3 px-4 bg-gradient-to-r from-purple-600/40 to-pink-500/40 border border-purple-300/20">اطلاعات سایت</button>
              <button className="w-full text-right rounded-xl py-3 px-4 text-white/65 border border-white/10">تغییر رمز عبور</button>
            </div>
          </div>
          <button onClick={logout} className="mt-auto text-red-300 border border-red-300/25 rounded-xl py-3">خروج از حساب</button>
        </aside>

        <main className="order-1 lg:order-2 p-4 md:p-8 lg:p-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-black">اطلاعات سایت</h1>
            <p className="text-white/50 mt-2 mb-6">محتوای سایت خود را ویرایش کنید</p>

            <div className="space-y-6">
              {sections.map((section) => (
                <section key={section.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6 backdrop-blur-sm">
                  <h2 className="font-bold mb-4">{section.title}</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {section.fields.map(([key, label, full]) => (
                      <div key={key} className={full ? "md:col-span-2" : ""}>
                        <label className="text-xs text-white/60 mb-2 block">{label}</label>
                        {key.toLowerCase().includes("description") || key === "heroSubtitle" ? (
                          <textarea value={content[key] || ""} onChange={(e) => updateField(key, e.target.value)} rows={4} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-violet-400" />
                        ) : (
                          <input value={content[key] || ""} onChange={(e) => updateField(key, e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-violet-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="sticky bottom-4 mt-6">
              <button onClick={saveContent} disabled={saving} className="w-full rounded-xl py-3 bg-gradient-to-r from-purple-600 to-pink-500 font-semibold">
                {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
              {msg ? <p className="text-center text-sm text-white/75 mt-2">{msg}</p> : null}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
