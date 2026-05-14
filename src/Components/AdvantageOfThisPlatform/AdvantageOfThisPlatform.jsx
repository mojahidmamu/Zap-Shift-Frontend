import React from 'react';
import Img1 from "../../assets/assets/live-tracking.png";
import Img2 from "../../assets/assets/safe-delivery.png";
import Img3 from "../../assets/assets/tiny-deliveryman.png";


const CardData = [
    {
        title: "Live Parcel Tracking",
        description:"Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
        image: Img1,
    },
    {
        title: "100% Safe Delivery",
        description:"We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
        image: Img2,
    },
    {
        title: "24/7 Call Center Support",
        description:"Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
        image: Img3,
    },
]


const AdvantageOfThisPlatform = () => {
    return (
       <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
  {CardData.map((item, index) => (
    <div
      key={index}
      className="group flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl 
      bg-gradient-to-r from-white to-lime-50 
      shadow-md hover:shadow-2xl 
      transition-all duration-500 border border-gray-100 hover:-translate-y-1"
    >
      {/* Image */}
      <div
        className="flex items-center justify-center 
        bg-white p-5 rounded-2xl 
        shadow-inner group-hover:shadow-lg 
        transition duration-500"
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-28 h-28 md:w-32 md:h-32 object-contain 
          transition duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="text-center md:text-left space-y-2">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 group-hover:text-lime-600 transition duration-300">
          {item.title}
        </h3>

        <p className="text-gray-500 text-sm md:text-base leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  ))}
</div>
    );
};

export default AdvantageOfThisPlatform;