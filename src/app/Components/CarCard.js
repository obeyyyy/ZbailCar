"use client"
import dynamic from 'next/dynamic'
import { useState } from 'react'

const Image = dynamic(() => import('next/image'), {
  loading: () => <div className="bg-white h-48 w-full" />
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
    <div className="
      group
      relative
      backdrop-blur-md rounded-2xl
      overflow-hidden
      transition-all duration-500
      hover:-translate-y-1
    ">
      {/* Layered Background */}
      <div className="absolute inset-0">
        {/* Base layer with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-[#D4AF37]/5 to-white/80" />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(45deg, 
                #D4AF37 25%, 
                transparent 25%,
                transparent 75%,
                #D4AF37 75%
              )
            `,
            backgroundSize: '4px 4px'
          }}
        />
        
        {/* Animated borders */}
        <div className="
          absolute inset-0
          bg-gradient-to-r from-[#D4AF37]/20 via-white/5 to-[#D4AF37]/20
          opacity-0 group-hover:opacity-100
          transition-opacity duration-700
          border border-[#D4AF37]/20
          group-hover:border-[#D4AF37]/40
        "/>

        {/* Corner decorations */}
        <div className="absolute top-0 right-0 w-24 h-24 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-bl-[100%]" />
        </div>
        <div className="absolute bottom-0 left-0 w-24 h-24 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-tl from-[#D4AF37]/20 to-transparent rounded-tr-[100%]" />
        </div>
      </div>

      {/* Main content container */}
      <div className="relative shadow-[0_8px_20px_rgba(212,175,55,0.07)] group-hover:shadow-[0_15px_30px_rgba(212,175,55,0.15)]">
        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 via-white/20 to-[#D4AF37]/10 animate-shimmer" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent z-10" />
          <Image
            src={car.image}
            alt={car.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transform group-hover:scale-105 transition-transform duration-1000"
            onLoadingComplete={() => setImageLoading(false)}
          />
          
          {/* Price Tag with enhanced styling */}
          <div className="
            absolute top-4 right-4 z-20 
            bg-gradient-to-br from-white/95 via-white/90 to-white/95
            px-4 py-2
            rounded-full 
            shadow-[0_4px_12px_rgba(212,175,55,0.15)]
            border border-[#D4AF37]/20
            backdrop-blur-md
            group-hover:border-[#D4AF37]/40
            transition-all duration-500
          ">
            <span className="bg-gradient-to-r from-[#B38E3B] to-[#D4AF37] bg-clip-text text-transparent font-bold">
              {formatPrice(car.price)}
            </span>
          </div>
        </div>

        {/* Content section */}
        <div className="p-6 relative">
          <h3 className="
            text-2xl font-bold 
            bg-black 
            bg-clip-text text-transparent
            mb-4 
            relative
            after:absolute after:bottom-0 after:left-0 
            after:w-16 after:h-[2px]
            after:bg-gradient-to-r after:from-[#D4AF37]/50 after:to-transparent
            group-hover:after:w-full
            after:transition-all after:duration-700
          ">{car.name}</h3>
          
          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-6">
            {car.features.map((feature, index) => (
              <span 
                key={index}
                className="
                  text-sm px-3 py-1.5 rounded-full 
                  bg-gradient-to-br from-[#D4AF37]/5 to-[#D4AF37]/10
                  text-[#B38E3B]
                  border border-[#D4AF37]/20
                  transition-all duration-300
                "
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Book Button */}
          <button
            onClick={handleBookNow}
            className="
              w-full py-3.5 px-4 
              bg-gradient-to-r from-[#D4AF37]/10 via-[#B38E3B]/5 to-[#D4AF37]/10
              hover:from-[#D4AF37]/20 hover:via-[#B38E3B]/15 hover:to-[#D4AF37]/20
              text-[#B38E3B] font-semibold 
              rounded-full 
              transition-all duration-500
              border border-[#D4AF37]/20
              hover:border-[#D4AF37]/40
              hover:shadow-[0_4px_15px_rgba(212,175,55,0.25)]
              relative
              overflow-hidden
              group/btn
            "
          >
            <span className="relative z-10 transition-colors duration-500 group-hover/btn:text-[#8B7355]">
              Book Now
            </span>
            <div className="
              absolute inset-0 -translate-x-full
              bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent
              group-hover/btn:translate-x-full
              transition-transform duration-1000
            "/>
          </button>
        </div>
      </div>
    </div>
  );
}
