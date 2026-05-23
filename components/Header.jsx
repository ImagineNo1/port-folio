import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import Socials from "../components/Socials";

const Header = () => {
  const [name, setName] = useState("Ethan Smith");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/content");
      const data = await res.json().catch(() => null);
      if (data?.profile?.fullName) setName(data.profile.fullName);
    };
    load();
  }, []);

  const [firstName, lastName] = useMemo(() => {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (parts.length <= 1) return [parts[0] || "Ethan", "Smith"];
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
            <div className="text-sm text-white/70 mt-1">{name}</div>
          </Link>
          <Socials />
        </div>
      </div>
    </header>
  );
};

export default Header;
