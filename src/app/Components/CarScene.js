"use client"
import { useRef, Suspense } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll, Environment, AccumulativeShadows, RandomizedLight } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { SECTIONS } from './car'
import { CarModel } from './car'

export default function CarScene() {
  const scroll = useScroll()
  const { viewport } = useThree()
  const isMobile = viewport.width < 5
  const deviceType = isMobile ? 'mobile' : 'desktop'
  const progressRef = useRef(0)

  useFrame((state) => {
    // Get normalized scroll offset (0 to 1)
    const offsetY = window.scrollY
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const scrollFraction = Math.min(offsetY / maxScroll, 1)
    
    // Map scroll progress to animation sections
    let currentSection = 0
    for (let i = 0; i < SECTIONS.length; i++) {
      if (scrollFraction >= SECTIONS[i].progress) {
        currentSection = i
      }
    }

    // Calculate progress within current section
    const sectionStart = SECTIONS[currentSection].progress
    const sectionEnd = SECTIONS[currentSection + 1]?.progress ?? 1
    const sectionProgress = (scrollFraction - sectionStart) / (sectionEnd - sectionStart)
    
    // Update progress ref
    progressRef.current = Math.min(Math.max(scrollFraction, 0), 1)
  })

  return (
    <group>
      <Suspense fallback={null}>
        <CarModel 
          scrollProgress={progressRef.current}
          deviceType={deviceType}
        />
        <Environment preset="forest" />
        <AccumulativeShadows temporal frames={20} alphaTest={0.85} opacity={0.4} color="#B38E3B">
          <RandomizedLight amount={3} radius={4} ambient={0.5} intensity={0.8} position={[5, 5, -10]} bias={0.001} />
        </AccumulativeShadows>
        <EffectComposer>
          <Bloom luminanceThreshold={0.4} intensity={0.6} radius={0.5} mipmapBlur={false} />
        </EffectComposer>
      </Suspense>
    </group>
  )
}
