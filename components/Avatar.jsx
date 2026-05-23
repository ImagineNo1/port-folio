import Image from "next/image";

const Avatar = ({ src = "/avatar.png", opacity = 1 }) => (
  <div className="hidden xl:flex xl:max-w-none pointer-events-none select-none relative items-end justify-end w-full h-full">
    <div className="relative w-[690px] h-[678px]">
      <Image
        src={src}
        alt="avatar"
        fill
        sizes="(min-width: 1280px) 690px, 0px"
        className="translate-z-0 object-contain object-bottom drop-shadow-[0_28px_64px_rgba(0,0,0,0.55)]"
        style={{ opacity }}
      />
    </div>
  </div>
);

export default Avatar;
