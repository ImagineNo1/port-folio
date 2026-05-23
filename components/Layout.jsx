import { Sora } from "next/font/google";
import Head from "next/head";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import Nav from "../components/Nav";
import TopLeftImg from "../components/TopLeftImg";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["100","200","300","400","500","600","700","800"] });

const Layout = ({ children }) => {
  const [siteTitle, setSiteTitle] = useState("Ethan Smith | Portfolio");
  const [favicon, setFavicon] = useState("/favicon.ico");

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/content');
      const data = await res.json().catch(() => null);
      if (data?.siteSettings?.title) setSiteTitle(data.siteSettings.title);
      if (data?.siteSettings?.favicon) setFavicon(data.siteSettings.favicon);
    };
    load();
  }, []);

  return (<main className={`page bg-site text-white bg-cover bg-no-repeat ${sora.variable} font-sora relative`}>
    <Head>
      <title>{siteTitle}</title>
      <link rel="icon" href={favicon} />
      <meta name="description" content="Portfolio website" />
      <meta name="keywords" content="react, next, nextjs, portfolio" />
      <meta name="author" content="Admin" />
      <meta name="theme-color" content="#f13024" />
    </Head>
    <TopLeftImg />
    <Nav />
    <Header />
    {children}
  </main>);
};

export default Layout;
