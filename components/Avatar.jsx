import Image from "next/image";

const Avatar = ({ src = "/avatar.png" }) => (
  <div className="hidden xl:flex xl:max-w-none pointer-events-none select-none">
    <Image src={src} alt="avatar" width={737} height={678} className="translate-z-0 w-full h-full" />
  </div>
);

export default Avatar;
