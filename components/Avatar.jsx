import Image from "next/image";

const Avatar = ({ src = "/avatar.png" }) => (
  <div className="hidden xl:flex xl:max-w-none pointer-events-none select-none relative">
    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent z-10" />
    <Image
      src={src}
      alt="avatar"
      width={737}
      height={678}
      className="translate-z-0 w-auto h-auto max-w-[737px] max-h-[678px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
      style={{ mixBlendMode: "screen" }}
    />
  </div>
);

export default Avatar;
