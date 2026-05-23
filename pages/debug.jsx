import { useState } from "react";

export default function DebugPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/db-check');
    const data = await res.json().catch(()=>({}));
    setResult({ status: res.status, ...data });
    setLoading(false);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">صفحه دیباگ اتصال دیتابیس</h1>
        <button onClick={check} className="rounded-xl px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-500">{loading ? 'در حال بررسی...' : 'بررسی اتصال'}</button>
        {result && (
          <pre className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 overflow-auto text-xs leading-6">{JSON.stringify(result, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}
