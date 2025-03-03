"use client"
import React, { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, AccumulativeShadows, RandomizedLight, EffectComposer, Bloom } from '@react-three/drei'

function CarModel({ scrollProgress }) {
  const group = useRef()
  const { scene } = useGLTF('/models/audi_a6_c8_limousine.glb')

  // Add smooth lerping
  const targetPosition = useRef(0)
  const currentPosition = useRef(0)
  const lerpFactor = 0.1 // Adjust this value between 0 and 1 for different smoothing amounts

  useFrame(() => {
    if (group.current) {
      // Calculate target position based on scroll
      if (scrollProgress < 0.33) {
        targetPosition.current = -scrollProgress * 6
      } else if (scrollProgress < 0.66) {
        targetPosition.current = (scrollProgress - 0.33) * 6
      } else {
        targetPosition.current = 0
      }

      // Smooth transition for position
      currentPosition.current += (targetPosition.current - currentPosition.current) * lerpFactor
      
      // Apply smooth position and rotation
      group.current.position.x = currentPosition.current
      group.current.rotation.y = scrollProgress * 4
    }
  })

  return <primitive ref={group} object={scene} scale={0.8} /> // Increased scale from 0.5 to 0.8
}

export default function Car3D() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [deviceType, setDeviceType] = useState('desktop')

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(window.scrollY / maxScroll, 1)
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setDeviceType('mobile')
      } else {
        setDeviceType('desktop')
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (deviceType === 'mobile') {
    return (
      <div className="w-full bg-black">
        {/* Fixed height container for the 3D car */}
        <div className="w-full h-[60vh] relative">
          <Canvas
            shadows="soft"
            dpr={[1, 2]}
            performance={{ min: 0.5 }}
            gl={{ powerPreference: "high-performance", antialias: false }}
            camera={{
              position: [0, -0.2, 3.0],
              fov: 17,
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

        {/* Scrollable content */}
        <div className="w-full bg-black">
          {SECTIONS.map((section, index) => (
            <div key={index} className="min-h-screen w-full py-12 px-4">
              <div className="relative w-full max-w-[90%] mx-auto p-6 rounded-lg bg-black/40 backdrop-blur-md">
                <h2 className="text-3xl font-bold text-[#D4AF37] mb-6">{section.text.title}</h2>
                <p className="text-base text-[#B38E3B]/90">{section.text.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[300vh]">
      {/* 3D Canvas Container */}
      <div className="fixed inset-0 z-10">
        <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <CarModel scrollProgress={scrollProgress} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Text Overlay Container */}
      <div className="fixed inset-0 z-20 pointer-events-none">
        <div className="h-full flex items-center">
          {/* First text section */}
          <div 
            className="absolute right-[10%] w-[40%] transition-all duration-500 transform"
            style={{ 
              opacity: scrollProgress < 0.33 ? 1 : 0,
              translateY: scrollProgress < 0.33 ? '0' : '20px'
            }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Luxury Redefined</h2>
            <p className="text-xl text-gray-300">Experience the epitome of automotive excellence.</p>
          </div>

          {/* Second text section */}
          <div 
            className="absolute left-[10%] w-[40%] transition-all duration-500 transform"
            style={{ 
              opacity: scrollProgress >= 0.33 && scrollProgress < 0.66 ? 1 : 0,
              translateY: scrollProgress >= 0.33 && scrollProgress < 0.66 ? '0' : '20px'
            }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Unmatched Performance</h2>
            <p className="text-xl text-gray-300">Power and precision engineered for you.</p>
          </div>

          {/* Final text section */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 w-[40%] text-center transition-all duration-500 transform"
            style={{ 
              opacity: scrollProgress >= 0.66 ? 1 : 0,
              translateY: scrollProgress >= 0.66 ? '0' : '20px'
            }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Drive?</h2>
            <p className="text-xl text-gray-300">Book your premium experience today.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
