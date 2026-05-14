import React from 'react';
import icon from "../../assets/assets/bookingIcon.png";


const howItWorksData = [
    {
        title: "Booking Pick & Drop",
        description:"From personal packages to business shipments — we deliver on time, every time.",
    },
    {
        title: "Cash On Delivery",
        description:"From personal packages to business shipments — we deliver on time, every time.",
    },
    {
        title: "Delivery Hub",
        description:"From personal packages to business shipments — we deliver on time, every time.",
    },
    {
        title: "Booking SME & Corporate",
        description:"From personal packages to business shipments — we deliver on time, every time.",
    },
]

const HowItWork = () => {
    return (
        <section className="py-8 px-4 bg-gray-100">
            <div className="max-w-6xl mx-auto">
                 {/* Heading */}
                <h2 className="text-2xl font-bold text-gray-800 mb-8">
                    How it Works
                </h2>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {howItWorksData.map((item, index) => (
                    <div
                    key={index}
                    className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition"
                    >

                         {/* Icon placeholder */}
                        <div className="mb-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                                <img src={icon} alt="Icon" />
                            </div>
                        </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-800 mb-2">
                        {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-500">
                        {item.description}
                    </p>
                    </div>
                ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWork;