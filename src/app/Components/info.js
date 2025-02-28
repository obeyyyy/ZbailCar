"use client"
import './info.css';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Info({ number, text, icon }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`badge-container transition-all duration-700 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="badge">
        <div className="flex items-center gap-4">
          <Image 
            src={`/${icon}.svg`}
            alt={text}
            width={32}
            height={32}
            className="text-[#D4AF37]"
          />
          <div className="text-[#D4AF37] text-left">
            <div className="font-bold">{number}</div>
            <div className="text-sm opacity-80">{text}</div>
          </div>
        </div>
        <span></span>
      </div>
    </div>
  );
}
