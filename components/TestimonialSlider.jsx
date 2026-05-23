import Image from "next/image";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const fallback = [{ image: "/t-avt-1.png", name: "Anne Smith", position: "Customer", message: "Sample message" }];

const TestimonialSlider = ({ items = fallback }) => (
  <Swiper navigation pagination={{ clickable: true }} modules={[Navigation, Pagination]} className="h-[400px]">
    {items.map((person, i) => <SwiperSlide key={i}><div className="flex flex-col items-center md:flex-row gap-x-8 h-full px-16"><Image src={person.image} width={100} height={100} alt={person.name}/><div><div className="text-lg">{person.name}</div><div>{person.position}</div><div>{person.message}</div></div></div></SwiperSlide>)}
  </Swiper>
);

export default TestimonialSlider;
