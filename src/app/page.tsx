"use client"
import Car from "./Components/car";
import Navbar from "./Components/Navbar";
import MainContent from "./Components/MainContent";
import { useState, useEffect } from "react";
import Info from "./Components/info";
export default function Home() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const handleCarComplete = () => {
      // Add a small delay before showing content
      setTimeout(() => setShowContent(true), 300);
    };

    window.addEventListener('carAnimationComplete', handleCarComplete);
    return () => window.removeEventListener('carAnimationComplete', handleCarComplete);
  }, []);

  return (
    <div className="bg-black min-h-dynamic w-screen overflow-x-hidden">
      <Navbar />
      <div className="relative w-full h-screen-safe">
        <Car />
        <MainContent isVisible={showContent} />
        <div className="relative z-10 w-full flex justify-center gap-4 sm:gap-6 lg:gap-8 py-4 sm:py-8">
          <Info number="100+" text="Happy Clients" />
          <Info number="10+" text="Luxury Cars" />
          <Info number="24/7" text="Support" />
        </div>
      </div>
    </div>
  );
}
