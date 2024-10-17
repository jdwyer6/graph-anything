// src/pages/Home.jsx
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

function Home() {
  const navigate = useNavigate();
  const pricingRef = useRef(null);

  const scrollToPricing = () => {
    if (pricingRef.current) {
      pricingRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen pb-4 md:pb-8 px-4 md:px-8 pt-20 md:pt-28 bg-gradient-to-r from-teal-100 to-blue-100 flex flex-col items-center justify-center">
        <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl p-6 md:p-12 mb-4 md:mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-dark mb-10 text-center">
            Welcome to Graph Anything
            </h1>
            <p className="text-lg text-gray-600 text-center mb-10">
            <strong className="text-brand-primary">Track your goals</strong> effortlessly. Create beautiful, <strong className="text-brand-secondary">simple charts</strong> with <strong className="text-brand-secondary">one click</strong> —whether it's fitness, health, finances, or <strong className="text-brand-primary">any goal.</strong> Clean, easy, and motivating. <strong className="text-brand-secondary">Start today!</strong>
            </p>
            <div className="flex justify-center mb-10">
            {isLoading && (
                <div className="border min-h-[395px] w-full bg-gray-300 rounded animate-pulse"></div>
            )}
            <img
                src="/images/demo.gif"
                alt="Demo"
                className={`max-w-full rounded-lg ${isLoading ? 'hidden' : 'block'}`}
                onLoad={handleImageLoad}
            />
            </div>
            <div className="flex justify-center gap-6 flex-col md:flex-row">
                <button
                    className="bg-brand-primary text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-brand-primary-dark transition focus:outline-none shadow-lg"
                    onClick={() => navigate('/signup?isSignUp=true')}
                >
                    Get Started
                </button>
                <button
                    className="bg-brand-secondary text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-brand-secondary-dark transition focus:outline-none shadow-lg"
                    onClick={scrollToPricing}
                >
                    Learn More
                </button>
            </div>
        </div>

      <div ref={pricingRef} className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl p-6 md:p-12">
        <h2 className="text-4xl font-extrabold text-gray-dark mb-8 text-center">Our Pricing Plans</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {/* Essential Plan */}
          <div className="flex-1 flex flex-col border rounded-lg shadow-lg p-8 bg-brand-gray-light">
            <h3 className="text-3xl font-bold text-gray-dark mb-4 text-start">Trial</h3>
            <p className="text-gray-600 mb-6 text-start">A simple plan to get you started with tracking and visualizing your goals.</p>
            <h4 className="text-3xl font-bold text-gray-dark mb-2 text-start">Free</h4>
            <div className="mt-auto">
                <h5 className="text-lg font-semibold text-gray-800 mb-4 text-start">Features Included:</h5>
                <ul className="space-y-3 mb-6">
                {["Track 1 goal", "Plot up to 10 points"].map((feature, index) => (
                    <li key={index} className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="ml-4 text-gray-700">{feature}</span>
                    </li>
                ))}
                    {["Connect with friends", "Priority customer support"].map((feature, index) => (
                    <li key={index} className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                        </svg>
                    <span className="ml-4 text-gray-700">{feature}</span>
                    </li>
                ))}
                </ul>
                <button className="w-full py-3 px-4 text-lg font-semibold text-white bg-brand-primary rounded-full hover:bg-brand-primary-dark transition focus:outline-none shadow-lg mb-6">
                Get Started
                </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="flex-1 flex flex-col border rounded-lg shadow-lg p-8 bg-brand-gray-light">
            <h3 className="text-3xl font-bold text-gray-dark mb-4 text-start">Premium</h3>
            <p className="text-gray-600 mb-6 text-start">Unlock all features for a lifetime with our Premium plan.</p>
            <h4 className="text-3xl font-bold text-gray-dark mb-2 text-start">$9.99 <span className="text-lg font-medium text-gray-600">/one-time</span></h4>
            <p className="text-gray-500 mb-6 text-start">Lifetime access</p>
            <div className="mt-auto">
                <h5 className="text-lg font-semibold text-gray-800 mb-4 text-start">Features Included:</h5>
                <ul className="space-y-3 mb-6">
                {["Unlimited goals", "Plot Unlimited Points", "Connect with friends", "Priority customer support"].map((feature, index) => (
                    <li key={index} className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="ml-4 text-gray-700">{feature}</span>
                    </li>
                ))}
                </ul>
                <button className="w-full py-3 px-4 text-lg font-semibold text-white bg-brand-primary rounded-full hover:bg-brand-primary-dark transition focus:outline-none shadow-lg mb-6">
                Get Started
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
