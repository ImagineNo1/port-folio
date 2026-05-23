import Link from "next/link";
import { RiYoutubeLine, RiInstagramLine, RiFacebookLine, RiPinterestLine, RiTelegramLine, RiWhatsappLine } from "react-icons/ri";

const iconMap = { youtube: RiYoutubeLine, instagram: RiInstagramLine, facebook: RiFacebookLine, pinterest: RiPinterestLine, telegram: RiTelegramLine, whatsapp: RiWhatsappLine };

const Socials = ({ socials = {} }) => {
  const socialData = Object.keys(iconMap)
    .filter((key) => socials?.[key])
    .map((key) => ({ key, link: socials[key], Icon: iconMap[key] }));

  return <div className="flex items-center gap-x-5 text-lg">{socialData.map((social) => (
    <Link key={social.key} title={social.key} href={social.link} target="_blank" rel="noreferrer noopener" className={`${social.key === "telegram" ? "bg-accent rounded-full p-[5px] hover:text-white" : "hover:text-accent"} transition-all duration-300`}>
      <social.Icon aria-hidden /><span className="sr-only">{social.key}</span>
    </Link>
  ))}</div>;
};

export default Socials;
