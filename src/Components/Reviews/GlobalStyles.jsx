// Add global styles for Swiper blur effect (works in any React app)
export const GlobalStyles = () => {
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      .testimonial-swiper .swiper-slide {
        filter: blur(4px);
        transition: filter 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.5s ease, opacity 0.4s ease;
        opacity: 0.5;
        transform: scale(0.85);
      }
      .testimonial-swiper .swiper-slide-active {
        filter: blur(0);
        opacity: 1;
        transform: scale(1);
      }
      .testimonial-swiper .swiper-slide-prev,
      .testimonial-swiper .swiper-slide-next {
        filter: blur(3px);
        opacity: 0.6;
        transform: scale(0.88);
      }
      .swiper-button-prev-custom, .swiper-button-next-custom {
        cursor: pointer;
      }
      @media (max-width: 768px) {
        .testimonial-swiper .swiper-slide {
          transform: scale(0.9);
        }
        .testimonial-swiper .swiper-slide-active {
          transform: scale(1);
        }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);
  
  return null;
};
