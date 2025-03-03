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
      mobile: { x: 0, y: -0.2, z: 2.2 },     // Updated to match working static position
      tablet: { x: 0, y: 0, z: 4.7 },
      desktop: { x: 0.05, y: 0.02, z: 4.85 }
    },
    carRotation: {
      mobile: { x: 0.2, y: -0.3, z: 0 },        // Updated to match working static rotation
      tablet: { x: 0.2, y: 0.2, z: 0 },
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

// Update StaticCarModel to include rotation animation
function StaticCarModel({ deviceType }) {
  const group = useRef()
  const { scene } = useGLTF('/models/2022_abt_audi_rs7-r.glb')
  
  // Add rotation animation using useFrame
  useFrame((state) => {
    if (group.current && deviceType === 'mobile') {
      // Slow rotation around Y axis
      group.current.rotation.y += 0.003; // Adjust speed by changing this value
    }
  });
  
  useEffect(() => {
    if (group.current) {
      if (deviceType === 'mobile') {
        // Initial position and scale
        group.current.position.set(0, -0.2, 2.2);
        group.current.rotation.set(0.2, -0.3, 0);
        group.current.scale.set(5.5, 5.5, 5.5);
      } else {
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
        const scale = deviceType === 'tablet' ? 2.8 : 2.5;
        group.current.scale.set(scale, scale, scale);
      }
    }
  }, [deviceType]);

  return <primitive ref={group} object={scene} castShadow receiveShadow />;
}

// Helper function for smooth interpolation
function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

// Update ScrollIndicator component to accept custom styles and visibility control
function ScrollIndicator({ progress, className, style }) {
  return (
    <div className={`fixed left-1/2 transform -translate-x-1/2 z-30 ${className}`} style={style}>
      <div className="h-1 w-40 bg-black/20 rounded-full overflow-hidden border border-[#B38E3B]/30">
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
  const scrollThreshold = 60 // Minimum scroll amount to trigger section change
  const scrollCooldown = 800 // Milliseconds to wait between scroll actions
  const [deviceType, setDeviceType] = useState('desktop')

  // Add scroll progress state for mobile
  const [mobileScrollProgress, setMobileScrollProgress] = useState(0);

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

  const handleWheel = (e) => {
    if (animating.current) {
      e.preventDefault();
      return;
    }

    // Only handle wheel events during car animation sections
    if (currentSection.current < SECTIONS.length) {
      accumulatedDelta += e.deltaY;

      if (Math.abs(accumulatedDelta) >= scrollThreshold) {
        const direction = accumulatedDelta > 0 ? 1 : -1;
        const nextSection = currentSection.current + direction;
        
        // Allow scrolling between sections
        if (nextSection >= 0 && nextSection < SECTIONS.length) {
          e.preventDefault();
          scrollToSection(nextSection);
        }
        
        // Enable normal scroll when going past last section
        if (nextSection >= SECTIONS.length && direction > 0) {
          enablePageScroll();
        }
        
        accumulatedDelta = 0;
      }
    }
  };

  const handleTouchMove = (e) => {
    if (animating.current) {
      e.preventDefault();
      return;
    }

    const currentY = e.touches[0].clientY;
    const delta = touchStartY - currentY;
    touchAccumulated += delta;
    touchStartY = currentY;

    // Only handle touch events during car animation sections
    if (currentSection.current < SECTIONS.length && Math.abs(touchAccumulated) >= scrollThreshold) {
      const direction = touchAccumulated > 0 ? 1 : -1;
      const nextSection = currentSection.current + direction;
      
      if (nextSection >= 0 && nextSection < SECTIONS.length) {
        e.preventDefault();
        scrollToSection(nextSection);
      }
      
      // Enable normal scroll when going past last section
      if (nextSection >= SECTIONS.length && direction > 0) {
        enablePageScroll();
      }
      
      touchAccumulated = 0;
    }
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

      const touch = e.touches[0];
      const currentY = touch.clientY;
      const delta = touchStartY - currentY;

      // More aggressive threshold for Safari mobile
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const touchThreshold = isSafari && deviceType === 'mobile' ? 20 : scrollThreshold;

      if (Math.abs(delta) >= touchThreshold) {
        const direction = delta > 0 ? 1 : -1;
        const nextSection = currentSection.current + direction;
        
        if (nextSection >= 0 && nextSection < SECTIONS.length) {
          scrollToSection(nextSection);
        }
        touchStartY = currentY;
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

  // Add Safari viewport height fix
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  // Update the scroll handler to enable bi-directional scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        // When at the top, re-enable car section scrolling
        document.body.style.overflow = 'hidden';
        currentSection.current = 0;
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add scroll handler for mobile view
  useEffect(() => {
    if (deviceType === 'mobile') {
      const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const progress = Math.min(scrolled / scrollHeight, 1);
        setMobileScrollProgress(progress);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [deviceType]);

  // Simplified mobile view
  if (deviceType === 'mobile') {
    return (
      <div className="min-h-screen w-screen bg-black">
        {/* Static 3D Car Canvas */}
        <div className="fixed top-0 left-0 w-full h-[50vh]"> {/* Changed from absolute to fixed */}
          <Canvas
            shadows="soft"
            dpr={[1, 2]}
            performance={{ min: 0.5 }}
            gl={{ powerPreference: "high-performance", antialias: false }}
            camera={{
              position: [0, -0.2, 3.0], // Adjusted position for mobile
              
              fov: 17, // Reduced FOV for closer view
              near: 0.1,
              far: 90
            }}
          >
            <color attach="background" args={['#000000']} />
            <Suspense fallback={null}>
              <StaticCarModel deviceType={deviceType} />
              <Environment preset="forest" />
              <AccumulativeShadows temporal frames={20} alphaTest={0.85} opacity={0.4} color="#B38E3B">
                <RandomizedLight amount={3} radius={4} ambient={0.5} intensity={0.8} position={[5, 5, -10]} bias={0.001} />
              </AccumulativeShadows>
              <EffectComposer>
                <Bloom luminanceThreshold={0.4} intensity={0.6} radius={0.5} mipmapBlur={false} />
              </EffectComposer>
            </Suspense>
          </Canvas>
        </div>

        {/* Content Sections */}
        <div className="relative mt-[50vh] w-full min-h-[50vh] bg-black"> {/* Added min-height */}
          <div className="w-full py-12 space-y-24">
            {SECTIONS.map((section, index) => (
              <div 
                key={index}
                className="
                  relative w-full max-w-[90%] mx-auto
                  p-6 rounded-lg
                  bg-black/40
                  backdrop-blur-md
                  shadow-lg shadow-[#B38E3B]/5
                  hover:shadow-[#D4AF37]/10
                  transform hover:-translate-y-1
                  transition-all duration-500 ease-out
                  overflow-hidden
                  before:absolute before:inset-0
                  before:p-[2px]
                  before:rounded-lg
                  before:content-['']
                  before:bg-gradient-to-r
                  before:from-transparent
                  before:via-[#D4AF37]
                  before:to-transparent
                  before:animate-borderGlow
                  after:absolute after:inset-[1px]
                  after:rounded-lg after:bg-black
                "
              >
                {/* Decorative elements */}
                <div className="
                  absolute -inset-[1px] 
                  bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent
                  blur-sm
                  animate-shimmer
                " />
                
                {/* Content container with dark background */}
                <div className="relative z-10 bg-black/90 rounded-lg p-4">
                  <div className="relative z-10">
                    <h2 className="
                      text-3xl font-bold text-[#D4AF37]
                      mb-6 tracking-tight
                      relative inline-block
                      after:absolute after:-bottom-2 after:left-0
                      after:w-1/3 after:h-[2px]
                      after:bg-gradient-to-r after:from-[#B38E3B] after:to-transparent
                      after:transition-all after:duration-300
                      group-hover:after:w-full
                    ">
                      {section.text.title}
                    </h2>
                    <p className="
                      text-base text-[#B38E3B]/90
                      pl-4 mt-4
                      border-l-2 border-[#B38E3B]/20
                      hover:border-[#D4AF37]/40
                      transition-colors duration-300
                      leading-relaxed
                    ">
                      {section.text.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* ScrollIndicator */}
          <ScrollIndicator 
            progress={mobileScrollProgress}
            className="bottom-8"
            style={{ position: 'fixed' }}
          />
        </div>
      </div>
    )
  }

  // Desktop view remains unchanged
  return (
    <div ref={containerRef} className={`
      relative
      ${deviceType === 'mobile' ? 'h-[150dvh]' : deviceType === 'tablet' ? 'h-[160dvh]' : 'h-[120vh]'}
      w-screen max-w-[100vw]
    `}>
      {/* Canvas with fixed position on mobile */}
      <div className={`
        ${deviceType === 'mobile' ? 'fixed h-[50dvh]' : 'absolute h-full'} 
        inset-0 w-full z-0
      `}>
        <Canvas
  r        shadows="soft"
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
          gl={{ powerPreference: "high-performance", antialias: false }}
          style={{ 
            width: '100%', 
            height: '100%'
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

      {/* Adjust text container for mobile */}
      <div className={`
        ${deviceType === 'mobile' ? 'relative mt-[50dvh]' : 'absolute'} 
        inset-0 z-20 
        ${deviceType === 'mobile' ? 'mt-[15dvh] pb-[15dvh] ' : 'mt-10'}
      `}>
        <div className={`
          relative h-full flex flex-col
          ${deviceType === 'mobile' ? 'gap-[10dvh]' : 'justify-start pt-24'}
          px-2 sm:px-8 lg:px-12
        `}>
          <div className={`
            w-full flex flex-col
            ${deviceType === 'mobile' ? 'gap-[15dvh]' : 'gap-[25vh]'}
            ${deviceType === 'tablet' ? 'gap-[35vh]' : ''}
            ${deviceType === 'mobile' ? 'items-center text-center gap-[20vh]' : ''}
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

      {/* Keep scroll indicator visible on mobile */}
      <ScrollIndicator 
        progress={scrollProgress} 
        className={`
          fixed left-1/2 transform -translate-x-1/2 z-30
          ${deviceType === 'mobile' ? 'bottom-4' : 'bottom-12'}
        `} 
      />

      {/* Adjust navigation dots position for mobile */}
      <div className={`
        fixed right-4 sm:right-8 z-30 flex gap-3 sm:gap-4
        ${deviceType === 'mobile' 
          ? 'bottom-4 flex-row justify-center w-full right-0' 
          : 'top-1/2 -translate-y-1/2 flex-col'}
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
