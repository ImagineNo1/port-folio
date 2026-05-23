import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

  return (
    <header className="absolute z-30 w-full items-center px-16 xl-px-0 xl:h-[90px]">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-y-6 py-8">
          <Link href="/" className="text-center">
            <Image src="/logo.svg" alt="logo" width={220} height={48} priority />
            <div className="text-xs text-white/70 mt-2">{name}</div>
          </Link>
          <Socials />
        </div>
      </div>
    </header>
  );
};

export default Header;
