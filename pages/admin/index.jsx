import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminPage() {
  const router = useRouter();
  const [content, setContent] = useState(null);
  const [editor, setEditor] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
      setEditor(JSON.stringify(data, null, 2));
    };

    load();
  }, [router]);

  const saveContent = async () => {
    try {
      const parsed = JSON.parse(editor);
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      setMsg(response.ok ? "تغییرات با موفقیت ذخیره شد." : "خطا در ذخیره تغییرات");
    } catch {
      setMsg("ساختار JSON معتبر نیست.");
    }
  };

  const changePassword = async () => {
    const response = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await response.json().catch(() => ({}));
    setMsg(response.ok ? "رمز عبور با موفقیت تغییر کرد." : data.message || "خطا در تغییر رمز عبور");
    if (response.ok) {
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  if (!content) {
    return <div className="min-h-screen grid place-items-center text-white bg-slate-950">در حال بارگذاری...</div>;
  }

  return (
    <div dir="rtl" className="min-h-screen w-full text-white bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950/30 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">پنل مدیریت</h1>
          <p className="text-white/60 mt-2">مدیریت اطلاعات سایت و امنیت حساب</p>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
          <h2 className="font-bold mb-4">تغییر رمز عبور</h2>
          <div className="grid md:grid-cols-[1fr_1fr_auto] gap-3">
            <input type="password" placeholder="رمز فعلی" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-violet-400" />
            <input type="password" placeholder="رمز جدید" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-violet-400" />
            <button onClick={changePassword} className="rounded-xl px-5 py-3 bg-gradient-to-r from-violet-600 to-pink-600">ثبت</button>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
          <h2 className="font-bold mb-2">ویرایش محتوای JSON</h2>
          <textarea className="w-full h-[420px] rounded-xl bg-[#0a122f] border border-white/10 p-4 font-mono text-sm leading-7 outline-none focus:border-violet-400" value={editor} onChange={(e) => setEditor(e.target.value)} />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button className="rounded-xl px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600" onClick={saveContent}>ذخیره تغییرات</button>
            <span className="text-sm text-white/80">{msg}</span>
          </div>
        </section>
      </div>
    </div>
  );
}
