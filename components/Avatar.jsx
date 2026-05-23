import Image from "next/image";

const Avatar = ({ src = "/avatar.png", opacity = 1 }) => (
  <div className="hidden xl:flex xl:max-w-none pointer-events-none select-none relative items-end justify-end w-full h-full">
    <div className="relative w-[690px] h-[678px] [mask-image:radial-gradient(circle_at_52%_52%,rgba(0,0,0,1)_56%,rgba(0,0,0,0.82)_70%,rgba(0,0,0,0)_100%)]">
      <Image
        src={src}
        alt="avatar"
        fill
        sizes="(min-width: 1280px) 690px, 0px"
        className="translate-z-0 object-cover object-[52%_42%] drop-shadow-[0_30px_70px_rgba(0,0,0,0.55)] saturate-[1.05] contrast-[1.06]"
        style={{ opacity }}
      />
    </div>
  </div>
);

export default Avatar;
