"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const activeIndex = Math.round(scrollPosition / windowHeight);
      setActiveSection(activeIndex);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = ['hero', 'features', 'how-it-works', 'cta'];

  return (
    <>
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
        {/* Hero Section */}
        <section id="hero" className="h-screen w-screen flex flex-col items-center justify-center text-center snap-start bg-gradient-to-r from-blue-100 to-blue-200 p-6">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-600 mb-4">InventTrack</h1>
          <h2 className="text-2xl md:text-3xl text-gray-800 mb-6">AI-Powered Inventory Management</h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">Harness the power of AI for smart inventory tracking and recipe generation</p>
          <Link href="/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300">
            Get Started
          </Link>
        </section>

        {/* Features Section */}
        <section id="features" className="h-screen w-screen flex flex-col items-center justify-center snap-start bg-white p-6">
          <h2 className="text-4xl font-bold text-blue-600 mb-12">AI-Driven Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Smart Inventory Tracking</h3>
              <p className="text-gray-600">AI algorithms predict stock levels and suggest optimal reorder points.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">AI Recipe Suggestions</h3>
              <p className="text-gray-600">Get personalized recipe ideas based on your available ingredients, powered by machine learning.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Intelligent Alerts</h3>
              <p className="text-gray-600">AI-driven notifications for low stock and expiring items, optimizing your inventory management.</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="h-screen w-screen flex flex-col items-center justify-center snap-start bg-gradient-to-r from-blue-100 to-blue-200 p-6">
          <h2 className="text-4xl font-bold text-blue-600 mb-12">How Our AI Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">1. Data Collection</h3>
              <p className="text-gray-600">Our AI system collects and analyzes your inventory data in real-time.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">2. Pattern Recognition</h3>
              <p className="text-gray-600">Machine learning algorithms identify patterns in your inventory usage and restocking needs.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">3. Intelligent Insights</h3>
              <p className="text-gray-600">Receive AI-generated recommendations for inventory management and recipe ideas.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="h-screen w-screen flex flex-col items-center justify-center snap-start bg-white p-6">
          <h2 className="text-4xl font-bold text-blue-600 mb-6">Experience AI-Powered Inventory Management</h2>
          <p className="text-xl text-gray-600 mb-8">Sign up now and let our AI revolutionize your inventory tracking and meal planning!</p>
          <Link href="/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300">
            Sign Up Now
          </Link>
        </section>
      </div>

      {/* Navigation Dots */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => {
              document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === index ? 'bg-blue-600 scale-125' : 'bg-gray-400 hover:bg-gray-600'
            }`}
            aria-label={`Scroll to ${section} section`}
          />
        ))}
      </div>
    </>
  );
}