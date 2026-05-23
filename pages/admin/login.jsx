import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [dbStatus, setDbStatus] = useState("");
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  useEffect(() => {
    const check = async () => {
      const res = await fetch("/api/admin/content");
      if (res.ok) router.replace("/admin");
    };
    check();
  }, [router]);

  const runDbCheck = async () => {
    setDbStatus("در حال بررسی اتصال...");
    const response = await fetch("/api/admin/db-check");
    const data = await response.json().catch(() => ({}));
    setDbStatus(data.message || (response.ok ? "اتصال موفق" : "بررسی ناموفق"));
  };


  const createDefaultAdmin = async () => {
    setCreatingAdmin(true);
    const response = await fetch("/api/admin/bootstrap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin" }),
    });
    const data = await response.json().catch(() => ({}));
    setMessage(response.ok ? "ادمین پیش‌فرض ساخته شد. حالا با admin / admin وارد شوید." : data.message || "ساخت ادمین ناموفق بود");
    setCreatingAdmin(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      router.push("/admin");
      return;
    }

    const data = await response.json().catch(() => ({}));
    if (response.status === 404 && data.code === "NO_ADMIN") {
      setMessage("هیچ ادمینی ساخته نشده. با دکمه زیر ادمین پیش‌فرض بسازید.");
    } else {
      setMessage(data.message || "نام کاربری یا رمز عبور اشتباه است");
    }
    setLoading(false);
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 relative overflow-hidden px-4">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-rose-500 rounded-2xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">پنل مدیریت</h1>
          <p className="text-white/50 text-sm mt-2">برای ورود اطلاعات خود را وارد کنید</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-white/70 text-sm mb-2">نام کاربری</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/25 px-4 h-12 rounded-xl outline-none focus:border-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/25 px-4 h-12 rounded-xl outline-none focus:border-purple-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-500 hover:to-rose-400 disabled:opacity-60 text-white rounded-xl font-semibold"
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>

          {message ? <p className="text-red-300 text-sm text-center">{message}</p> : null}

          <button
            type="button"
            onClick={runDbCheck}
            className="w-full h-11 border border-white/20 text-white/80 rounded-xl text-sm hover:bg-white/5"
          >
            باگ‌یابی اتصال دیتابیس
          </button>
          {dbStatus ? <p className="text-white/70 text-xs text-center">{dbStatus}</p> : null}

          <button
            type="button"
            onClick={createDefaultAdmin}
            disabled={creatingAdmin}
            className="w-full h-11 border border-purple-400/40 text-purple-200 rounded-xl text-sm hover:bg-purple-500/10"
          >
            {creatingAdmin ? "در حال ساخت ادمین..." : "ساخت ادمین پیش‌فرض (admin/admin)"}
          </button>
        </form>
      </div>
    </div>
  );
}
