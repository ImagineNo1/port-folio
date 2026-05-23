import { useEffect, useState } from "react";

const empty = { username: "", password: "", currentPassword: "", newPassword: "" };

export default function AdminPage() {
  const [form, setForm] = useState(empty);
  const [content, setContent] = useState(null);
  const [editor, setEditor] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    const data = await (await fetch("/api/admin/content")).json();
    setContent(data);
    setEditor(JSON.stringify(data, null, 2));
  };

  useEffect(() => {
    load();
  }, []);

  const post = async (url, body) => {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const d = await r.json().catch(() => ({}));
    setMsg(r.ok ? "عملیات با موفقیت انجام شد." : d.message || "خطا در انجام عملیات");
  };

  const saveContent = async () => {
    try {
      const parsed = JSON.parse(editor);
      const r = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      setMsg(r.ok ? "تغییرات با موفقیت ذخیره شد." : "خطا در ذخیره تغییرات");
      if (r.ok) setContent(parsed);
    } catch {
      setMsg("ساختار JSON معتبر نیست.");
    }
  };

  if (!content) {
    return (
      <div className="min-h-screen grid place-items-center text-white bg-[#0a0e24]">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen w-full text-white bg-[radial-gradient(circle_at_30%_15%,#48207a_0%,#1a1a4a_35%,#080f2d_100%)] p-4 md:p-8">
      <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-[#070d29]/70 backdrop-blur-xl shadow-[0_0_80px_rgba(111,58,185,0.25)] overflow-hidden">
        <div className="grid lg:grid-cols-[300px_1fr] min-h-[85vh]">
          <aside className="border-l border-white/10 bg-[#050b22]/90 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm text-white/60">ادمین</p>
                  <h2 className="font-bold text-lg">مدیریت سایت</h2>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500" />
              </div>
              <div className="space-y-3 text-sm">
                <button className="w-full rounded-xl border border-violet-400/40 bg-violet-500/20 py-3 px-4 text-right">اطلاعات سایت</button>
                <button className="w-full rounded-xl border border-white/10 py-3 px-4 text-right text-white/80">تغییر رمز عبور</button>
              </div>
            </div>
            <button className="text-red-300 border border-red-400/20 rounded-xl py-3">خروج از حساب</button>
          </aside>

          <main className="p-6 md:p-10 overflow-auto">
            <h1 className="text-3xl font-black mb-2">پنل مدیریت</h1>
            <p className="text-white/60 mb-8">مدیریت اطلاعات وب‌سایت و امنیت حساب کاربری</p>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6 mb-6">
              <h3 className="font-bold mb-4">ورود / ساخت ادمین</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input placeholder="نام کاربری" className="rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-violet-400" onChange={(e) => setForm({ ...form, username: e.target.value })} />
                <input placeholder="رمز عبور" type="password" className="rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-violet-400" onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-xl px-5 py-3 bg-gradient-to-r from-violet-600 to-pink-600" onClick={() => post("/api/admin/bootstrap", { username: form.username, password: form.password })}>ایجاد ادمین</button>
                <button className="rounded-xl px-5 py-3 border border-white/20" onClick={() => post("/api/admin/login", { username: form.username, password: form.password })}>ورود</button>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6 mb-6">
              <h3 className="font-bold mb-4">تغییر رمز عبور</h3>
              <div className="grid md:grid-cols-[1fr_1fr_auto] gap-4">
                <input placeholder="رمز فعلی" type="password" className="rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-violet-400" onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
                <input placeholder="رمز جدید" type="password" className="rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-violet-400" onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
                <button className="rounded-xl px-5 py-3 bg-gradient-to-r from-violet-600 to-pink-600" onClick={() => post("/api/admin/change-password", { currentPassword: form.currentPassword, newPassword: form.newPassword })}>ثبت</button>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
              <h3 className="font-bold mb-2">ویرایش کامل JSON محتوا</h3>
              <p className="text-sm text-white/60 mb-4">برای شخصی‌سازی کامل محتوای سایت از این بخش استفاده کنید.</p>
              <textarea className="w-full h-[360px] rounded-xl bg-[#0a122f] border border-white/10 p-4 font-mono text-sm leading-7 outline-none focus:border-violet-400" value={editor} onChange={(e) => setEditor(e.target.value)} />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button className="rounded-xl px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600" onClick={saveContent}>ذخیره تغییرات</button>
                <span className="text-sm text-white/80">{msg}</span>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
