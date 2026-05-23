import Image from "next/image";

const Avatar = ({ src = "/avatar.png", opacity = 1 }) => (
  <div className="hidden xl:flex xl:max-w-none pointer-events-none select-none relative">
    <Image
      src={src}
      alt="avatar"
      width={737}
      height={678}
      className="translate-z-0 w-auto h-auto max-w-[737px] max-h-[678px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
      style={{ opacity }}
    />
  </div>
);

export default Avatar;
