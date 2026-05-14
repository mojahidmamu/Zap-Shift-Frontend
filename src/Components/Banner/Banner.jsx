import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
import bannerImg1 from "../../assets/assets/banner/banner1.png";
import bannerImg2 from "../../assets/assets/banner/banner2.png";
import bannerImg3 from "../../assets/assets/banner/banner3.png";
import { Link } from "react-router";

const Banner = () => {
    return (
        <Carousel  autoPlay
        infiniteLoop
        interval={3000}
        transitionTime={800}
        showStatus={false}
        stopOnHover
        swipeable
        emulateTouch>
                <div>
                    <img src={bannerImg1} />
                    <div className="absolute inset-0    flex items-center justify-center">
                        <div className="text-center text-white space-y-4 px-4 animate-fadeIn">
                            <div className="absolute inset-0 flex items-end justify-center pb-10">
                                <Link to="/">
                                <button className="btn btn-success bg-green-500 hover:bg-green-600 transition px-6 py-3 shadow-lg">
                                    Track Your Parcel
                                </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <img src={bannerImg2} />
                  
                </div>
                <div>
                    <img src={bannerImg3} />
                   
                </div>
            </Carousel>
    );
};

export default Banner;