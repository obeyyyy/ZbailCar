"use client"
import Image from "next/image";
import CarCard from './CarCard';
import { cars } from '../data/cars';

export default function MainContent({ isVisible }) {
  return (
    <div 
      className={`bg-black transition-all duration-1000 lg:mt-[55dvh] md:mt-[30dvh] ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-24'
      }`}
     
      style={{ 
        transitionDelay: isVisible ? '500ms' : '0ms',
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#D4AF37] mb-8 text-center">
          Our Fleet
        </h2>
        
        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </main>
    </div>
  );
}
