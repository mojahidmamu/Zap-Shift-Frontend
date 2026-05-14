import React from "react";
import locationMarcentImg from "../../assets/assets/location-merchant.png";
import locationMarcentBGImg from "../../assets/assets/be-a-merchant-bg.png";

const SatisfactionPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      
      <div
        className="rounded-3xl overflow-hidden relative flex flex-col lg:flex-row items-center justify-between p-8 lg:p-12 text-white"
        style={{
          backgroundImage: `url(${locationMarcentBGImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay (for dark effect) */}
        <div className="absolute inset-0 bg-[#0b3c3c]/90"></div>

        {/* Left Side */}
        <div className="relative z-10 max-w-xl space-y-5 text-center lg:text-left">
          
          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">
            Merchant and Customer Satisfaction <br />
            is Our First Priority
          </h1>

          {/* Description */}
          <p className="text-sm md:text-base text-gray-200">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            
            <button className="btn bg-lime-400 text-black hover:bg-lime-500 border-none rounded-full px-6">
              Become a Merchant
            </button>

            <button className="btn  border-lime-400 text-lime-300 hover:bg-lime-400 hover:text-black rounded-full px-6">
              Earn with ZapShift Courier
            </button>

          </div>
        </div>

        {/* Right Side Image */}
        <div className="relative z-10 mt-8 lg:mt-0">
          <img
            src={locationMarcentImg}
            alt="Location Merchant"
            className="w-[250px] md:w-[320px] lg:w-[380px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default SatisfactionPage;