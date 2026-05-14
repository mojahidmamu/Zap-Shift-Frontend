import AdvantageOfThisPlatform from '../AdvantageOfThisPlatform/AdvantageOfThisPlatform';
import Banner from '../Banner/Banner';
import Brand from '../Brand/Brand';
import FAQ from '../FAQ/FAQ';
import HowItWork from '../HowItWork/HowItWork';
import Reviews from '../Reviews/Reviews';
import SatisfactionPage from '../SatisfactionPage/SatisfactionPage';
// import Services from '../Services/Services'; 

// Add error handling for fetch requests
const fetchWithErrorHandling = async (url, fallbackData = []) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return fallbackData;
  }
};

// Create promises that always resolve
const reviewsPromise = fetchWithErrorHandling("/reviews.json", []);
const servicesPromise = fetchWithErrorHandling("/services.json", []);

const Home = () => {
    return (
        <div className="overflow-x-hidden">
            <Banner></Banner>
            <HowItWork></HowItWork>
            {/* <Services servicesPromise={servicesPromise}></Services> */}
            <Brand></Brand>
            <div className="divider max-w-6xl mx-auto my-8"></div>
            <AdvantageOfThisPlatform></AdvantageOfThisPlatform>
            <div className="divider max-w-6xl mx-auto my-8"></div>
            <SatisfactionPage></SatisfactionPage>
            <Reviews reviewsPromise={reviewsPromise}></Reviews>
            <FAQ></FAQ>
        </div>
    );
};

export default Home;