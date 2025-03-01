"use client"
import React, { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, AccumulativeShadows, RandomizedLight } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'

// Update SECTIONS positions for responsive views
const SECTIONS = [
  { 
    progress: 0, 
    duration: 1000,
    carPosition: {
      mobile: { x: 0.01, y: 0.07, z: 4.7 },     // Moved back and slightly down for better mobile view
      tablet: { x: 0, y: 0, z: 4.7 },     // Adjusted for tablet
      desktop: { x: 0.05, y: 0.02, z: 4.85 }
    },
    carRotation: {
      mobile: { x: 0.3, y: -0.5, z: 0 },   // Slight front view for mobile
      tablet: { x: 0.2, y: 0.2, z: 0 },    // Adjusted angle for tablet
      desktop: { x: 0.2, y: 1.5, z: 0 }
    },
    text: {
      title: "Premium Rides, Unmatched Comfort",
      description: "At Zbail Cars, we offer top-quality vehicles for every journey—whether business or leisure. Drive in style and comfort with our well-maintained fleet."
    }
  },
  { 
    progress: 0.33, 
    duration: 1000,
    carPosition: {
      mobile: { x: 0.01, y: 0.05, z: 4.7 },
      tablet: { x: 0, y: -0.3, z: 4.7 },
      desktop: { x: -0.07, y: -0.01, z: 4.82 }
    },
    carRotation: {
      mobile: { x: 0.2, y: 2.5, z: 0 },    // Side view for mobile
      tablet: { x: 0.2, y: 2.2, z: 0 },    // Side view for tablet
      desktop: { x: 1.5, y: -1.55, z: 0 }
    },
    text: {
      title: "Affordable Rates, Exceptional Service",
      description: "Enjoy transparent pricing with no hidden fees. We provide flexible rental options and 24/7 support to ensure a smooth experience."
    }
  },
  { 
    progress: 0.55, 
    duration: 1000,
    carPosition: {
      mobile: { x: 0, y: -0.1, z: 4.7 },
      tablet: { x: 0, y: -0.3, z: 7 },
      desktop: { x: 0.06, y: -0.112, z: 4.82 }
    },
    carRotation: {
      mobile: { x: 0.1, y: -2.8, z: 0 },   // Rear quarter view for mobile
      tablet: { x: 0.2, y: -2.5, z: 0 },   // Rear quarter view for tablet
      desktop: { x: -0.25, y: 0.45, z: 0 }
    },
    text: {
      title: "Hassle-Free Booking, Instant Access",
      description: "Renting a car has never been easier. With our seamless online booking system, you can secure your ride in just a few clicks."
    }
  }
];

function CarModel({ scrollProgress, deviceType }) {
  const group = useRef()
  const { scene } = useGLTF('/models/2022_abt_audi_rs7-r.glb')
  const targetRotation = useRef({ x: 0, y: 0, z: 0 })
  const currentRotation = useRef({ x: 0, y: 0, z: 0 })
  const targetPosition = useRef({ x: 0, y: 0, z: 0 })
  const currentPosition = useRef({ x: 0, y: 0, z: 0 })

  useFrame((state) => {
    if (!group.current) return;

    const currentSection = SECTIONS.find((s, i, arr) => 
      scrollProgress < (i === arr.length - 1 ? 1 : arr[i + 1].progress)
    ) || SECTIONS[0];

    const nextSection = SECTIONS[SECTIONS.indexOf(currentSection) + 1] || currentSection;
    const sectionProgress = (scrollProgress - currentSection.progress) / 
      (nextSection.progress - currentSection.progress || 1);

    // Use device-specific positions
    Object.keys(currentSection.carPosition[deviceType]).forEach(axis => {
      targetPosition.current[axis] = lerp(
        currentSection.carPosition[deviceType][axis],
        nextSection.carPosition[deviceType][axis],
        sectionProgress
      );
      
      targetRotation.current[axis] = lerp(
        currentSection.carRotation[deviceType][axis],
        nextSection.carRotation[deviceType][axis],
        sectionProgress
      );
    });

    // Smooth transitions
    ['x', 'y', 'z'].forEach(axis => {
      group.current.position[axis] = lerp(
        group.current.position[axis],
        targetPosition.current[axis],
        0.05
      );
      group.current.rotation[axis] = lerp(
        group.current.rotation[axis],
        targetRotation.current[axis],
        0.05
      );
    });
  });

  // Initialize position
  useEffect(() => {
    if (group.current) {
      const initialSection = SECTIONS[0];
      group.current.position.set(
        initialSection.carPosition[deviceType].x,
        initialSection.carPosition[deviceType].y,
        initialSection.carPosition[deviceType].z
      );
      group.current.rotation.set(
        initialSection.carRotation[deviceType].x,
        initialSection.carRotation[deviceType].y,
        initialSection.carRotation[deviceType].z
      );
      // Adjust scale based on device
      const scale = deviceType === 'mobile' ? 3 : deviceType === 'tablet' ? 2.8 : 2.5;
      group.current.scale.set(scale, scale, scale);
    }
  }, [deviceType]);

  return <primitive ref={group} object={scene} castShadow receiveShadow />;
}

// Helper function for smooth interpolation
function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

function ScrollIndicator({ progress }) {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30">
      <div className="h-1 w-40 bg-black rounded-full overflow-hidden border border-[#B38E3B]/30">
        <div 
          className="h-full bg-gradient-to-r from-[#B38E3B] to-[#D4AF37] transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  )
}

export default function Car3D() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef(null)
  const animating = useRef(false)
  const currentSection = useRef(0)
  const lastScrollTime = useRef(Date.now())
  const scrollThreshold = 50 // Minimum scroll amount to trigger section change
  const scrollCooldown = 800 // Milliseconds to wait between scroll actions
  const [deviceType, setDeviceType] = useState('desktop')

  const enablePageScroll = () => {
    if (containerRef.current) {
      containerRef.current.style.pointerEvents = 'none';
      document.body.style.overflow = 'auto';
      // Ensure event is dispatched after a slight delay
      setTimeout(() => {
        window.dispatchEvent(new Event('carAnimationComplete'));
      }, 100);
    }
  };

  const scrollToSection = (index) => {
    if (animating.current) return;
    
    const now = Date.now()
    if (now - lastScrollTime.current < scrollCooldown) return;
    lastScrollTime.current = now;
    
    animating.current = true;
    currentSection.current = index;
    
    const startProgress = scrollProgress;
    const targetProgress = SECTIONS[index].progress;
    const duration = SECTIONS[index].duration;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const eased = 1 - Math.pow(1 - progress, 4);
      const currentProgress = startProgress + (targetProgress - startProgress) * eased;
      
      setScrollProgress(currentProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        animating.current = false;
        if (index === SECTIONS.length - 1) {
          enablePageScroll();
        }
      }
    };

    animate();
  };

  const smoothScroll = (targetSection) => {
    if (animating.current) return;
    animating.current = true;

    const startTime = performance.now();
    const startProgress = scrollProgress;
    const targetProgress = SECTIONS[targetSection].progress;
    const duration = 1000; // 1 second

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Improved easing function
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentProgress = startProgress + (targetProgress - startProgress) * eased;
      
      setScrollProgress(currentProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        animating.current = false;
        if (targetSection === SECTIONS.length - 1) {
          enablePageScroll();
        }
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Initially lock scroll
    document.body.style.overflow = 'hidden';
    let accumulatedDelta = 0;
    
    const handleWheel = (e) => {
      if (currentSection.current === SECTIONS.length - 1) {
        const isScrollingDown = e.deltaY > 0;
        if (isScrollingDown && containerRef.current.getBoundingClientRect().bottom <= window.innerHeight) {
          enablePageScroll();
          return;
        }
      }

      if (animating.current) {
        e.preventDefault();
        return;
      }

      // Accumulate scroll delta
      accumulatedDelta += e.deltaY;

      // Check if accumulated scroll meets threshold
      if (Math.abs(accumulatedDelta) >= scrollThreshold) {
        const direction = accumulatedDelta > 0 ? 1 : -1;
        const nextSection = currentSection.current + direction;
        
        if (nextSection >= 0 && nextSection < SECTIONS.length) {
          scrollToSection(nextSection);
        }
        
        // Reset accumulated delta
        accumulatedDelta = 0;
      }
    };

    // Modified touch handling
    let touchStartY = 0;
    let touchAccumulated = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchAccumulated = 0;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      if (animating.current) return;

      const currentY = e.touches[0].clientY;
      const delta = touchStartY - currentY;
      touchAccumulated += delta;
      touchStartY = currentY;

      if (Math.abs(touchAccumulated) >= scrollThreshold) {
        const direction = touchAccumulated > 0 ? 1 : -1;
        const nextSection = currentSection.current + direction;
        
        if (nextSection >= 0 && nextSection < SECTIONS.length) {
          scrollToSection(nextSection);
        }
        
        touchAccumulated = 0;
      }
    };

    const handleKeydown = (e) => {
      if (animating.current) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        const nextSection = Math.min(currentSection.current + 1, SECTIONS.length - 1);
        scrollToSection(nextSection);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        const nextSection = Math.max(currentSection.current - 1, 0);
        scrollToSection(nextSection);
      }
    };

    const element = containerRef.current;
    if (element) {
      element.addEventListener('wheel', handleWheel, { passive: false });
      element.addEventListener('touchstart', handleTouchStart, { passive: true });
      element.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('keydown', handleKeydown);
    }

    return () => {
      enablePageScroll();
      if (element) {
        element.removeEventListener('wheel', handleWheel);
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('keydown', handleKeydown);
      }
    };
  }, []);

  // Add function to calculate text opacity based on section
  const getTextOpacity = (sectionIndex) => {
    const currentProgress = scrollProgress;
    const sectionStart = SECTIONS[sectionIndex].progress;
    const sectionEnd = SECTIONS[sectionIndex + 1]?.progress ?? 1;
    
    if (currentProgress >= sectionStart && currentProgress < sectionEnd) {
      return 1;
    } else {
      return 0.3;
    }
  };

  // Add viewport height calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setDeviceType('mobile')
      } else if (window.innerWidth < 1024) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div ref={containerRef} className={`
      relative
      ${deviceType === 'mobile' ? 'h-[250vh]' : deviceType === 'tablet' ? 'h-[160vh]' : 'h-[120vh]'}
      w-screen max-w-[100vw]
    `}>
      {/* Canvas container with adjusted height */}
      <div className="absolute inset-0 w-full h-full z-0 ">
        <Canvas
          shadows="soft"
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
          gl={{ powerPreference: "high-performance", antialias: false }}
          style={{ 
            width: '100%', 
            height: deviceType === 'desktop' ? '150vh' : '100%'
          }}
        >
          <color attach="background" args={['#000000']} />
          <Suspense fallback={null}>
            <CarModel scrollProgress={scrollProgress} deviceType={deviceType} />
            <Environment preset="forest" />
          </Suspense>
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
            enableRotate={false}
          />

          <AccumulativeShadows 
            temporal 
            frames={20}
            alphaTest={0.85} 
            opacity={0.4}
            color="#B38E3B"
          >
            <RandomizedLight 
              amount={3}
              radius={4} 
              ambient={0.5} 
              intensity={0.8} 
              position={[5, 5, -10]} 
              bias={0.001}
            />
          </AccumulativeShadows>

          {/* Reduced bloom effect */}
          <EffectComposer>
            <Bloom 
              luminanceThreshold={0.4}
              intensity={0.6}
              radius={0.5}
              mipmapBlur={false}
            />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Text sections with adjusted spacing */}
      <div className={`absolute inset-0 z-20 mt-10
         ${deviceType === 'mobile' ?  'mt-[7dvh]':''}
      `}>
        <div className={`
          relative h-full flex flex-col
          ${deviceType === 'desktop' ? 'justify-start pt-32' : 'justify-start pt-24'}
          px-4 sm:px-8 lg:px-12
        `}>
          <div className={`
            w-full flex flex-col
            ${deviceType === 'desktop' ? 'gap-[25vh]' : 'gap-[60vh]'}
            ${deviceType === 'tablet' ? 'gap-[45vh]' : ''}
            ${deviceType === 'mobile' ? 'items-center text-center gap-[40vh]' : ''}
          `}>
            {SECTIONS.map((section, index) => (
              <div 
                key={index}
                className={`
                  group relative transition-all duration-500 
                  ${deviceType === 'desktop' 
                    ? index % 2 === 0 ? 'self-start' : 'self-end' 
                    : 'w-full max-w-[90%] sm:max-w-[80%] mx-auto p-4'}
                  ${deviceType !== 'desktop' ? 'text-center' : ''}
                  p-2 backdrop-blur-[2px]
                  before:absolute before:inset-0 
                  before:border before:border-[#B38E3B]/10
                  before:rounded-lg before:-z-10
                  hover:before:border-[#D4AF37]/30
                  before:transition-colors before:duration-300
                `}
                style={{ 
                  opacity: getTextOpacity(index),
                  transform: `translateY(${
                    deviceType !== 'desktop' && currentSection.current === index 
                      ? '0' 
                      : currentSection.current > index 
                        ? '-30px' 
                        : '30px'
                  })`,
                  transition: 'opacity 0.5s ease, transform 0.5s ease'
                }}
              >
                <h2 className="
                  text-2xl sm:text-3xl lg:text-4xl p-4 font-bold text-[#D4AF37] 
                  tracking-tight max-w-xl
                  relative 
                  after:absolute after:bottom-0 after:left-0 
                  after:w-16 after:h-[1px]
                  after:bg-gradient-to-r after:from-[#B38E3B] after:to-transparent
                  group-hover:after:w-32
                  after:transition-all after:duration-300
                ">
                  {section.text.title}
                </h2>
                <p className="
                  text-sm sm:text-base lg:text-lg text-[#B38E3B] max-w-xl
                  relative pl-4 border-l border-[#B38E3B]/20
                  group-hover:border-[#B38E3B]/40
                  transition-colors duration-300
                ">
                  {section.text.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation elements - Highest z-index */}
      <ScrollIndicator 
        progress={scrollProgress} 
        className={`
          fixed left-1/2 transform -translate-x-1/2 z-20
          ${deviceType !== 'desktop' ? 'bottom-24' : 'bottom-12'}
        `} 
      />

      <div className={`
        fixed right-4 sm:right-8 z-20 flex gap-3 sm:gap-4
        ${deviceType === 'desktop' ? 'top-1/2 -translate-y-1/2 flex-col' : 'bottom-12 flex-row justify-center w-full right-0'}
      `}>
        {SECTIONS.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSection.current === index 
                ? 'bg-[#D4AF37] scale-125' 
                : 'bg-gray-500 hover:bg-[#B38E3B]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Preload the GLB model
useGLTF.preload('/models/2022_abt_audi_rs7-r.glb')