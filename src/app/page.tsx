"use client"
import Car from "./Components/car";
import Navbar from "./Components/Navbar";
import MainContent from "./Components/MainContent";
import { useState, useEffect } from "react";
import Info from "./Components/info";


function GlobalScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInCarSection, setIsInCarSection] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrolled = window.scrollY;
      const carSectionHeight = windowHeight * 3; // 3 sections

      // Update progress based on whether we're in car section or not
      if (scrolled <= carSectionHeight) {
        setIsInCarSection(true);
        setScrollProgress(scrolled / carSectionHeight);
      } else {
        setIsInCarSection(false);
        const remainingScroll = scrolled - carSectionHeight;
        const remainingHeight = documentHeight - carSectionHeight;
        setScrollProgress((carSectionHeight + remainingScroll) / documentHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30">
      <div className="h-1 w-40 bg-black rounded-full overflow-hidden border border-[#B38E3B]/30">
        <div 
          className="h-full bg-gradient-to-r from-[#B38E3B] to-[#D4AF37] transition-all duration-300"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [showContent, setShowContent] = useState(true); // Set default to true
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  useEffect(() => {
    if (!isMobile) {
      // Only use animation completion handler for desktop
      const handleCarComplete = () => {
        setTimeout(() => setShowContent(true), 300);
      };

      window.addEventListener('carAnimationComplete', handleCarComplete);
      return () => window.removeEventListener('carAnimationComplete', handleCarComplete);
    }
  }, [isMobile]);

  return (
    <div className="bg-black min-h-dynamic w-screen overflow-x-hidden">
      <Navbar />
      <div className="relative w-full h-screen-safe">
        <Car />
        <MainContent isVisible={showContent} />
        <div className="relative z-10 w-full flex sm:flex-row flex-col items-center justify-center gap-4 sm:gap-6 lg:gap-8 py-4 sm:py-8">
          <Info number="100+" text="Clients" icon="client" />
          <Info number="10+" text="Luxury Cars" icon="car5" />
          <Info number="24/7" text="Support" icon="phone" />
        </div>
      </div>
      <GlobalScrollIndicator />
    </div>
  );
}
