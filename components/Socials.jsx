import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { RiYoutubeLine, RiInstagramLine, RiFacebookLine, RiPinterestLine, RiTelegramLine, RiWhatsappLine } from "react-icons/ri";

const iconMap = { youtube: RiYoutubeLine, instagram: RiInstagramLine, facebook: RiFacebookLine, pinterest: RiPinterestLine, telegram: RiTelegramLine, whatsapp: RiWhatsappLine };

const fallback = {
  youtube: "https://youtube.com",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  pinterest: "https://pinterest.com",
  telegram: "https://t.me/",
  whatsapp: "https://wa.me/",
};

const Socials = () => {
  const [links, setLinks] = useState(fallback);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/content");
      const data = await res.json().catch(() => null);
      if (data?.socials) setLinks((prev) => ({ ...prev, ...data.socials }));
    };
    load();
  }, []);

  const socialData = useMemo(() => Object.keys(iconMap).map((key) => ({ key, link: links[key], Icon: iconMap[key] })), [links]);

  return <div className="flex items-center gap-x-5 text-lg">{socialData.map((social) => (
    <Link key={social.key} title={social.key} href={social.link} target="_blank" rel="noreferrer noopener" className={`${social.key === "telegram" ? "bg-accent rounded-full p-[5px] hover:text-white" : "hover:text-accent"} transition-all duration-300`}>
      <social.Icon aria-hidden /><span className="sr-only">{social.key}</span>
    </Link>
  ))}</div>;
};

export default Socials;
