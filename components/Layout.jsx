import { Sora } from "next/font/google";
import Head from "next/head";

import Header from "../components/Header";
import Nav from "../components/Nav";
import TopLeftImg from "../components/TopLeftImg";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["100", "200", "300", "400", "500", "600", "700", "800"] });

const Layout = ({ children, siteContent }) => {
  return (
    <main className={`page bg-site text-white bg-cover bg-no-repeat ${sora.variable} font-sora relative`}>
      <Head>
        <title>{siteContent?.siteSettings?.title || "Portfolio"}</title>
        <link rel="icon" href={siteContent?.siteSettings?.favicon || "/favicon.ico"} />
      </Head>
      <TopLeftImg />
      <Nav />
      <Header siteContent={siteContent} />
      {children}
    </main>
  );
};

export default Layout;
