import React from "react";
import img1 from "../../assets/assets/brands/amazon_vector.png";
import img2 from "../../assets/assets/brands/amazon.png";
import img3 from "../../assets/assets/brands/casio.png";
import img4 from "../../assets/assets/brands/moonstar.png";
import img5 from "../../assets/assets/brands/randstad.png";
import img6 from "../../assets/assets/brands/start.png";
import img7 from "../../assets/assets/brands/start-people 1.png";

const brandImage = [img1, img2, img3, img4, img5, img6, img7];

const Brand = () => {
  return (
    <div className="w-full py-16 px-4 md:px-10 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl text-gray-800 mb-3">
          We've helped thousands of sales teams
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        <p className="text-gray-500 mt-4 text-sm md:text-base">
          Trusted by leading brands worldwide
        </p>
      </div>

      {/* Continuous Marquee Animation */}
      <div className="relative overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-12 md:gap-16">
          {/* First set of logos */}
          {brandImage.map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 h-24 min-w-[120px] md:min-w-[150px] flex items-center justify-center px-4 transition-all duration-300 hover:scale-110 cursor-pointer group"
            >
              <img
                src={logo}
                alt={`brand-${index}`}
                className="max-h-12 md:max-h-14 w-auto object-contain opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {brandImage.map((logo, index) => (
            <div
              key={`dup-${index}`}
              className="flex-shrink-0 h-24 min-w-[120px] md:min-w-[150px] flex items-center justify-center px-4 transition-all duration-300 hover:scale-110 cursor-pointer group"
            >
              <img
                src={logo}
                alt={`brand-dup-${index}`}
                className="max-h-12 md:max-h-14 w-auto object-contain opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
          width: fit-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Brand;