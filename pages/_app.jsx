import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Layout from "../components/Layout";
import Transition from "../components/Transition";

import "../styles/globals.css";
import { LanguageProvider } from "../lib/language";

function PublicLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-white">
      <div className="text-center">
        <div className="w-14 h-14 border-4 border-purple-500/20 border-t-purple-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/70">در حال بارگذاری اطلاعات سایت...</p>
      </div>
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const plainPage = router.pathname.startsWith("/admin") || router.pathname.startsWith("/debug");
  const [siteContent, setSiteContent] = useState(pageProps?.siteContent || pageProps?.content || null);
  const [loading, setLoading] = useState(!plainPage && !(pageProps?.siteContent || pageProps?.content));

  useEffect(() => {
    if (plainPage || siteContent) return;
    const load = async () => {
      setLoading(true);
      const res = await fetch("/api/content");
      const data = await res.json().catch(() => null);
      setSiteContent(data);
      setLoading(false);
    };
    load();
  }, [plainPage, siteContent]);

  useEffect(() => {
    const nextContent = pageProps?.siteContent || pageProps?.content || null;
    if (nextContent) setSiteContent(nextContent);
  }, [pageProps?.siteContent, pageProps?.content]);

  const page = (
    <AnimatePresence mode="wait">
      <motion.div key={router.route} className="h-full">
        {!plainPage && <Transition />}
        <Component {...pageProps} />
      </motion.div>
    </AnimatePresence>
  );

  if (plainPage) return page;
  if (loading || !siteContent) return <PublicLoading />;
  return <LanguageProvider><Layout siteContent={siteContent}>{page}</Layout></LanguageProvider>;
}

export default MyApp;
