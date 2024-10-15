// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-blue-100 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-12">
        <h1 className="text-5xl font-extrabold text-[#388087] mb-10 text-center">
          Welcome to Graph Anything
        </h1>
        <p className="text-lg text-gray-600 text-center mb-10">
            Track your goals effortlessly. Create beautiful, simple charts with one click—whether it's fitness, health, finances, or any goal. Clean, easy, and motivating. Start today.
        </p>
        <div className="flex justify-center mb-10">
          <Picker data={data} style={{ width: '100%' }} />
        </div>
        <div className="flex justify-center gap-6">
          <button
            className="bg-brand-primary text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-brand-primary-dark transition focus:outline-none shadow-lg"
            onClick={() => navigate('/signup?isSignUp=true')}
          >
            Get Started
          </button>
          <button
            className="bg-brand-secondary text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-brand-secondary-dark transition focus:outline-none shadow-lg"
            onClick={() => navigate('/about')}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;