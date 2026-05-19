import React, { useEffect, useState } from 'react';
import { 
  Rocket, 
  Shield, 
  Clock, 
  Users, 
  Truck, 
  MapPin, 
  Globe,
  HeartHandshake,
  TrendingUp
} from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router';

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Stats data
  const stats = [
    { icon: <Truck className="w-8 h-8" />, value: "50,000+", label: "Deliveries Completed" },
    { icon: <Users className="w-8 h-8" />, value: "200+", label: "Active Riders" },
    { icon: <Globe className="w-8 h-8" />, value: "60+", label: "Cities Covered" },
    { icon: <Clock className="w-8 h-8" />, value: "99.9%", label: "On-Time Delivery" },
  ];

  // Core values
  const coreValues = [
    { icon: <Shield className="w-8 h-8" />, title: "Reliability", description: "We deliver what we promise, every single time." },
    { icon: <Clock className="w-8 h-8" />, title: "Speed", description: "Fastest delivery network in the region." },
    { icon: <HeartHandshake className="w-8 h-8" />, title: "Customer First", description: "Your satisfaction is our top priority." },
    { icon: <TrendingUp className="w-8 h-8" />, title: "Innovation", description: "Constant improvement through technology." },
  ];

  // Team members
  const team = [
    { name: "Md. Rahim Uddin", role: "CEO & Founder", image: "https://randomuser.me/api/portraits/men/1.jpg" },
    { name: "Fatema Begum", role: "Operations Director", image: "https://randomuser.me/api/portraits/women/2.jpg" },
    { name: "Kazi Shahid", role: "Tech Lead", image: "https://randomuser.me/api/portraits/men/3.jpg" },
    { name: "Sumaiya Akter", role: "Customer Support Head", image: "https://randomuser.me/api/portraits/women/4.jpg" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className={`relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-24 text-center">
          <Rocket className="w-16 h-16 mx-auto mb-6 animate-bounce" />
          <h1 className="text-4xl md:text-6xl font-bold mb-4">About ZapShift</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90">
            Revolutionizing parcel delivery with speed, trust, and technology.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        
        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
            <div className="text-indigo-600 mb-4">
              <Rocket className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To provide seamless, reliable, and affordable parcel delivery services that connect businesses and individuals across Bangladesh, ensuring every package reaches its destination safely and on time.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
            <div className="text-purple-600 mb-4">
              <Globe className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become the most trusted and tech-driven logistics platform in South Asia, empowering local businesses and creating a sustainable delivery ecosystem.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-md p-6 text-center transform transition-all duration-500 hover:shadow-lg hover:-translate-y-1"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-indigo-600 flex justify-center mb-3">
                {stat.icon}
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Core Values */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-10">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, idx) => (
              <div 
                key={idx}
                className="group relative bg-white rounded-xl shadow-md p-6 text-center transition-all duration-300 hover:shadow-xl hover:bg-indigo-50 cursor-pointer"
              >
                <div className="text-indigo-600 flex justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
                <div className="absolute inset-0 border-2 border-transparent rounded-xl group-hover:border-indigo-300 transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: "Book a Parcel", desc: "Enter pickup & delivery details online", icon: <MapPin /> },
              { step: 2, title: "Rider Assigned", desc: "Nearest rider picks up your parcel", icon: <Users /> },
              { step: 3, title: "Fast Delivery", desc: "Track in real-time until delivered", icon: <Truck /> }
            ].map((item, i) => (
              <div key={i} className="relative bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">
                  {item.step}
                </div>
                <div className="mt-6 text-indigo-600 flex justify-center">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mt-4">{item.title}</h3>
                <p className="text-gray-500 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-10">Meet Our Leadership</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, idx) => (
              <div 
                key={idx}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-indigo-600 text-sm">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact / CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Ship?</h2>
          <p className="text-lg opacity-90 mb-6">Join thousands of happy customers using ZapShift for reliable deliveries.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/send-percel">
                <button className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition transform hover:scale-105">
                Get Started
                </button>
            </Link>
            <Link to='/contact'>
                <button className="border-2 border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition transform hover:scale-105">
              Contact Us
            </button>
            </Link>
          </div>
        </div>

        {/* Footer / Social Links */}
        <div className="text-center text-gray-500 text-sm py-8 border-t">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="hover:text-indigo-600 transition"><FaFacebook size={20} /></a>
            <a href="#" className="hover:text-indigo-600 transition"><FaTwitter size={20} /></a>
            <a href="#" className="hover:text-indigo-600 transition"><FaInstagram size={20} /></a>
            <a href="#" className="hover:text-indigo-600 transition"><FaLinkedin size={20} /></a>
          </div>
          <p>&copy; 2025 ZapShift. All rights reserved. Delivering smiles across Bangladesh.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;