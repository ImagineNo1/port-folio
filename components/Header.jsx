import { useLanguage } from "../lib/language";
import Link from "next/link";
import { useMemo } from "react";

import Socials from "../components/Socials";

const Header = ({ siteContent }) => {
  const { locale, setLocale } = useLanguage();
  const name = siteContent?.profile?.fullName || "";

  const [firstName, lastName] = useMemo(() => {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (parts.length <= 1) return [parts[0] || "", ""];
    return [parts[0], parts.slice(1).join(" ")];
  }, [name]);

  return (
    <header className="absolute z-30 w-full items-center px-16 xl-px-0 xl:h-[90px]">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-y-6 py-8">
          <Link href="/" className="text-center leading-tight select-none">
            <div className="text-4xl font-extrabold tracking-wide">
              <span className="text-white">{firstName}</span>{" "}
              <span className="font-light text-white/90">{lastName}</span>
              <span className="text-accent">.</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <button onClick={() => setLocale(locale === "en" ? "fa" : "en")} className="text-xs px-3 py-1 rounded-full border border-white/30 hover:border-accent transition">{locale === "en" ? "فا" : "EN"}</button>
            <Socials socials={siteContent?.socials} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
