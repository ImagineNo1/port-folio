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
    setMsg(r.ok ? "Done" : d.message || "Error");
  };

  const saveContent = async () => {
    try {
      const parsed = JSON.parse(editor);
      const r = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      setMsg(r.ok ? "Saved" : "Save error");
      if (r.ok) setContent(parsed);
    } catch {
      setMsg("JSON is invalid");
    }
  };

  if (!content) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <h1 className="text-3xl mb-4">Admin Panel</h1>

      <div className="grid md:grid-cols-3 gap-3 mb-6">
        <input placeholder="username" className="text-black p-2" onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input placeholder="password" type="password" className="text-black p-2" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <div className="flex gap-2">
          <button className="bg-accent px-3" onClick={() => post("/api/admin/bootstrap", { username: form.username, password: form.password })}>Create Admin</button>
          <button className="bg-accent px-3" onClick={() => post("/api/admin/login", { username: form.username, password: form.password })}>Login</button>
        </div>
      </div>

      <h2 className="text-xl">Change Password</h2>
      <div className="grid md:grid-cols-3 gap-3 mb-6">
        <input placeholder="current" type="password" className="text-black p-2" onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
        <input placeholder="new" type="password" className="text-black p-2" onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
        <button className="bg-accent px-3" onClick={() => post("/api/admin/change-password", { currentPassword: form.currentPassword, newPassword: form.newPassword })}>Change</button>
      </div>

      <h2 className="text-xl mb-2">Personalize Full Content JSON</h2>
      <textarea className="w-full h-[400px] text-black p-2" value={editor} onChange={(e) => setEditor(e.target.value)} />
      <button className="bg-accent px-4 py-2 mt-3" onClick={saveContent}>Save Content</button>
      <p className="mt-3">{msg}</p>
    </div>
  );
}
