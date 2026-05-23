import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AdminPasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const changePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return setMsg("همه فیلدها را پر کنید");
    if (newPassword !== confirmPassword) return setMsg("رمز جدید و تکرار آن یکسان نیست");
    if (newPassword.length < 4) return setMsg("رمز عبور باید حداقل ۴ کاراکتر باشد");

    setLoading(true);
    const response = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (response.status === 401) return router.push("/admin/login");
    if (!response.ok) return setMsg(data.message || "خطا در تغییر رمز عبور");
    setMsg("رمز عبور با موفقیت تغییر کرد");
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
  };

  return <div dir="rtl" className="min-h-screen text-white bg-[#030b24] p-6 md:p-10">
    <div className="max-w-2xl mx-auto rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold">تغییر رمز عبور</h1><Link href="/admin" className="text-sm text-white/70">بازگشت</Link></div>
      <form onSubmit={changePassword} className="space-y-4">
        <input type="password" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" placeholder="رمز فعلی" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} />
        <input type="password" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" placeholder="رمز جدید" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
        <input type="password" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" placeholder="تکرار رمز جدید" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
        <button disabled={loading} className="w-full rounded-xl py-3 bg-gradient-to-r from-purple-600 to-pink-500">{loading ? "در حال ثبت..." : "ثبت رمز جدید"}</button>
      </form>
      {msg ? <p className="mt-4 text-sm text-white/80">{msg}</p> : null}
    </div>
  </div>;
}
