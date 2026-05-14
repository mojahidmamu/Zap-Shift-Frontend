import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import ReviewCard from "./ReviewCard";
import topImg from "../../assets/assets/customer-top.png";

const Reviews = ({ reviewsPromise }) => {
  const [reviews, setReviews] = useState([]);

  //  FIX: fetch promise safely
  useEffect(() => {
    if (reviewsPromise) {
      reviewsPromise.then((data) => setReviews(data));
    }
  }, [reviewsPromise]);

  if (!reviews.length) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 animate-pulse">
          Loading customer reviews...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-8 md:py-24">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <img src={topImg} className="mx-auto h-20 mb-6" />
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            What our customers say
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Real feedback from our users about their experience.
          </p>
        </div>

        {/* Swiper */}
        <div className="relative">
        <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            centeredSlides
            slidesPerView={1}
            loop
            speed={800}
            autoplay={{
                delay: 3500,
                disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            navigation
            className="pb-12"
        >
            {reviews.map((review) => (
                <SwiperSlide key={review.id}>
                    <ReviewCard review={review} />
                </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Reviews;