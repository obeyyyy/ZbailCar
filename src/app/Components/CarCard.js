"use client"
import dynamic from 'next/dynamic'
import { useState } from 'react'

const Image = dynamic(() => import('next/image'), {
  loading: () => <div className="bg-gray-700 h-48 w-full" />
})

export default function CarCard({ car }) {
  const [imageLoading, setImageLoading] = useState(true)

  const formatPrice = (price) => `${price.toFixed(0)} MAD / day`;

  const handleBookNow = () => {
    const message = encodeURIComponent(
      `Hello! I would like to rent the ${car.name}.\n\nDetails:\n- Price: ${formatPrice(car.price)}\n- Features: ${car.features.join(', ')}`
    );
    window.open(`https://wa.me/1234567890?text=${message}`, '_blank');
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden
                  transition-all duration-300 ease-out hover:translate-y-[-4px]
                  border border-[#B38E3B]/30
                  hover:border-[#D4AF37]/40
                  shadow-[0_0_15px_rgba(179,142,59,0.1)]
                  hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]">
      {/* Image Container */}
      <div className="relative h-48 w-full">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <Image
          src={car.image}
          alt={car.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          onLoadingComplete={() => setImageLoading(false)}
        />
        {/* Price Tag */}
        <div className="absolute top-4 right-4 z-20 bg-[#D4AF37]/90 px-3 py-1 rounded-full">
          <span className="text-black font-bold">{formatPrice(car.price)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">{car.name}</h3>
        
        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-6">
          {car.features.map((feature, index) => (
            <span 
              key={index}
              className="text-sm px-3 py-1 rounded-full 
                       bg-[#B38E3B]/10 text-[#D4AF37]
                       border border-[#B38E3B]/20
                       shadow-[0_0_10px_rgba(179,142,59,0.05)]"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Book Button */}
        <button
          onClick={handleBookNow}
          className="w-full py-3 px-4 
                   bg-gradient-to-r from-[#B38E3B] to-[#D4AF37]
                   text-black font-semibold rounded-full 
                   transition-all duration-300
                   active:scale-[0.98]
                   shadow-[0_2px_8px_rgba(179,142,59,0.2)]
                   hover:shadow-[0_4px_12px_rgba(212,175,55,0.3)]
                   hover:brightness-110"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
