import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AdminContactsPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin/contacts");
      if (res.status === 401) return router.push("/admin/login");
      const data = await res.json();
      setItems(data || []);
      setLoading(false);
    };
    load();
  }, [router]);

  const logout = () => { document.cookie = "admin_token=; Max-Age=0; path=/"; router.push("/admin/login"); };

  return <div dir="rtl" className="min-h-screen text-white bg-[#030b24] bg-[radial-gradient(circle_at_35%_25%,rgba(120,84,255,0.15),transparent_45%)]">
    <div className="grid lg:grid-cols-[260px_1fr] min-h-screen">
      <aside className="border-l border-white/10 bg-[#020a21]/80 p-6 flex flex-col">
        <div className="space-y-2 text-sm">
          <p className="text-xs text-white/50">پنل مدیریت</p><p className="font-semibold">admin</p>
          <Link href="/admin" className="block w-full text-right rounded-xl py-3 px-4 text-white/65 border border-white/10 mt-6">اطلاعات سایت</Link>
          <Link href="/admin/password" className="block w-full text-right rounded-xl py-3 px-4 text-white/65 border border-white/10">تغییر رمز عبور</Link>
          <Link href="/admin/contacts" className="block w-full text-right rounded-xl py-3 px-4 bg-gradient-to-r from-purple-600/40 to-pink-500/40 border border-purple-300/20">Contacts</Link>
        </div>
        <button onClick={logout} className="mt-auto text-red-300 border border-red-300/25 rounded-xl py-3">خروج از حساب</button>
      </aside>
      <main className="p-6 md:p-10">
        <h1 className="text-3xl font-black mb-6">Contacts</h1>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 overflow-auto">
          {loading ? <p>در حال بارگذاری...</p> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/60 border-b border-white/10">
                  <th className="text-right p-3">نام</th>
                  <th className="text-right p-3">ایمیل</th>
                  <th className="text-right p-3">موضوع</th>
                  <th className="text-right p-3">پیام</th>
                  <th className="text-right p-3">زمان</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-b border-white/5 align-top">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.email}</td>
                    <td className="p-3">{item.subject}</td>
                    <td className="p-3 max-w-[360px] whitespace-pre-wrap">{item.message}</td>
                    <td className="p-3">{item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  </div>;
}
