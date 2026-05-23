import Image from "next/image";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

const fallback = [{ images: [{ title: "title", path: "/thumb1.jpg", link: "http://example.com" }] }];

const WorkSlider = ({ slides = fallback }) => (
  <Swiper spaceBetween={10} pagination={{ clickable: true }} modules={[Pagination]} className="h-[280px] sm:h-[480px]">
    {slides.map((slide, i) => <SwiperSlide key={i}><div className="grid grid-cols-2 grid-rows-2 gap-4">{slide.images.map((image, ii)=><div className="relative rounded-lg overflow-hidden flex items-center justify-center group" key={ii}><Image src={image.path} alt={image.title} width={500} height={300}/><Link href={image.link} target="_blank" className="absolute bottom-2 left-2 flex items-center gap-1 text-xs">LIVE PROJECT <BsArrowRight/></Link></div>)}</div></SwiperSlide>)}
  </Swiper>
);

export default WorkSlider;
