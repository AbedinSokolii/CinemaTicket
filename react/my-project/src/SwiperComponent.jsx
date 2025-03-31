import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import movies from './assets/1206x500_MICKEY17_KOS_1.jpg';
import { ChevronLeft, ChevronRight } from "lucide-react";
import videoplay from './assets/bbm4.mp4';
import moviePoster from "./assets/1206x504_minecraft.jpg";

const SwiperComponent = () => {
  const swiperRef = useRef(null);
  const videoRef = useRef(null); // Ref for the video

  return (
    <div className="bg-Bg_color relative">
      <div className=" relative mx-auto w-full max-w-[600px] h-[250px] sm:max-w-[800px] sm:h-[350px] lg:max-w-[1200px] lg:h-[500px]">
      <Swiper
        modules={[Navigation]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        slidesPerView={1}
        spaceBetween={20}
        loop={true}
        className="rounded-lg overflow-hidden w-full h-full"
        onSlideChange={(swiper) => {
          if (videoRef.current) {
            if (swiper.activeIndex === 2) {
              videoRef.current.play(); // Play video only when active
            } else {
              videoRef.current.pause(); // Pause video when not active
            }
          }
        }}
      >
        <SwiperSlide className="bg-blue-500 flex items-center justify-center text-white text-center rounded-lg">
        <img src={moviePoster} alt="" />
        </SwiperSlide>

        <SwiperSlide className="flex items-center justify-center text-white text-center rounded-lg">
          <img src={movies} alt="" className="w-full h-full object-cover" />
        </SwiperSlide>

        {/* Video Slide */}
        <SwiperSlide className="p-10 text-white text-center rounded-lg">
          <video
            ref={videoRef}
            src={videoplay}
            autoPlay
            loop
            muted
            controls
            className="w-full h-full object-cover rounded-lg"
          />
        </SwiperSlide>
      </Swiper>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 z-10">
        <button 
          onClick={() => swiperRef.current?.slidePrev()} 
          className="bg-gray-800 text-white px-4 py-2 rounded-lg"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={() => swiperRef.current?.slideNext()} 
          className="bg-gray-800 text-white px-4 py-2 rounded-lg"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      </div>
    </div>
  );
};

export default SwiperComponent;
