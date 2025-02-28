"use client"
import dynamic from 'next/dynamic'
import { useState } from 'react'

// Lazy load Image component
const Image = dynamic(() => import('next/image'), {
  loading: () => <div className="animate-pulse bg-gray-700 h-48 w-full" />
})

export default function CarCard({ car }) {
  const [imageLoading, setImageLoading] = useState(true)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleBookNow = () => {
    const message = encodeURIComponent(
      `Hello! I would like to rent the ${car.name}.\n\nDetails:\n- Price: ${formatPrice(car.price)}/day\n- Features: ${car.features.join(', ')}\n\nPlease provide more information about availability.`
    );
    window.open(`https://wa.me/1234567890?text=${message}`, '_blank');
  };

  return (
    <div className="relative group">
      {/* Card Container with enhanced shadow and hover effects */}
      <div className="bg-black/40 backdrop-blur-sm border border-[#B38E3B]/30 rounded-xl overflow-hidden
                    transition-all duration-500 ease-out
                    hover:border-[#D4AF37] hover:shadow-[0_0_30px_rgba(179,142,59,0.3)]
                    group-hover:translate-y-[-8px]">
        {/* Car Image Container */}
        <div className="relative h-48 w-full overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 animate-pulse bg-gray-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <Image
            src={car.image}
            alt={car.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={75}
            priority={false}
            onLoadingComplete={() => setImageLoading(false)}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Price Tag */}
          <div className="absolute top-4 right-4 z-20 bg-[#D4AF37]/90 px-3 py-1 rounded-full
                        shadow-lg backdrop-blur-sm">
            <span className="text-black font-bold">{formatPrice(car.price)}/day</span>
          </div>
        </div>

        {/* Car Info */}
        <div className="p-6 relative">
          {/* Name and Features */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#D4AF37] tracking-tight">{car.name}</h3>
            
            {/* Features Grid */}
            <div className="flex flex-wrap gap-2">
              {car.features.map((feature, index) => (
                <span 
                  key={index}
                  className="text-sm px-3 py-1 rounded-full bg-[#B38E3B]/10 text-[#D4AF37]
                           border border-[#B38E3B]/20 backdrop-blur-sm
                           transition-colors duration-300 hover:bg-[#B38E3B]/20"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Book Button */}
          <button
            onClick={handleBookNow}
            className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-[#B38E3B] to-[#D4AF37]
                     text-black font-semibold rounded-full 
                     transition-all duration-300 ease-out
                     hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]
                     active:scale-95 transform"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Reflection Effect */}
      <div className="absolute inset-x-0 h-1/2 bottom-0 bg-gradient-to-t from-[#D4AF37]/5 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
    </div>
  );
}
