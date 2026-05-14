import React, { useState, useEffect } from "react";
import Icon from "../../assets/assets/service.png";

const Services = ({ servicesPromise }) => {
  const [allServices, setAllServices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use useEffect instead of use() for better error handling
  useEffect(() => {
    if (!servicesPromise) {
      setError(new Error("No services promise provided"));
      setLoading(false);
      return;
    }

    setLoading(true);
    servicesPromise
      .then((data) => {
        setAllServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading services:", err);
        setError(err);
        setLoading(false);
      });
  }, [servicesPromise]);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gray-100 rounded-3xl px-6 py-12 text-center animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading services...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-red-50 rounded-3xl px-6 py-12 text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Unable to Load Services</h2>
          <p className="text-gray-600">Please refresh the page or try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!allServices || allServices.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gray-100 rounded-3xl px-6 py-12 text-center">
          <p className="text-gray-500">No services available at the moment.</p>
        </div>
      </div>
    );
  }

  const openModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Section Container */}
        <div className="bg-[#0b3c3c] rounded-3xl px-6 py-12 md:px-12">
          {/* Title */}
          <div className="text-center text-white mb-10">
            <h1 className="text-3xl md:text-4xl font-bold">
              Our Services
            </h1>
            <p className="text-gray-300 mt-3 max-w-xl mx-auto text-sm md:text-base">
              Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle.
              From personal packages to business shipments — we deliver on time, every time.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allServices.map((service, index) => {
              const isHighlighted = index === 1 || index === 4;
              
              return (
                <div
                  key={index}
                  className={`group p-6 rounded-2xl text-center transition-all duration-300 cursor-pointer
                  ${
                    isHighlighted
                      ? "bg-lime-400 text-black shadow-xl hover:bg-lime-500 hover:scale-105"
                      : "bg-white text-gray-800 shadow-md hover:bg-indigo-50 hover:shadow-xl hover:-translate-y-2"
                  }`}
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full transition-all duration-300 group-hover:scale-110 ${
                      isHighlighted 
                        ? "bg-white/30 group-hover:bg-white/40" 
                        : "bg-gray-100 group-hover:bg-indigo-100"
                    }`}>
                      <img 
                        src={Icon} 
                        alt={service.title} 
                        className="w-10 h-10 object-contain" 
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className={`font-semibold text-lg mb-2 ${
                    isHighlighted ? "text-black" : "text-gray-800"
                  }`}>
                    {service.title}
                  </h2>

                  {/* Short Description */}
                  <p className={`text-sm leading-relaxed line-clamp-2 ${
                    isHighlighted ? "text-black/70" : "text-gray-500"
                  }`}>
                    {service.description.length > 100 
                      ? `${service.description.substring(0, 100)}...`
                      : service.description}
                  </p>

                  {/* See More Button */}
                  <button
                    onClick={() => openModal(service)}
                    className={`mt-4 text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1 mx-auto ${
                      isHighlighted 
                        ? "text-black/70 hover:text-black" 
                        : "text-indigo-600 hover:text-indigo-800"
                    }`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Read More
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal/Popup for Full Description */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all duration-300 scale-100" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <img src={Icon} alt={selectedService.title} className="w-8 h-8 object-contain" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedService.title}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body - Full Description */}
            <div className="mb-6">
              <p className="text-gray-600 leading-relaxed">
                {selectedService.description}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        .fixed {
          animation: fadeIn 0.2s ease-out;
        }
        .bg-white {
          animation: scaleUp 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Services;