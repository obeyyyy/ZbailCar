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
  const currentProgress = useRef(0)

  useFrame((state) => {
    // Calculate normalized scroll progress (0 to 1)
    const scrollOffset = scroll.offset
    currentProgress.current = scrollOffset

    // Calculate which section we're in and the progress within that section
    let sectionIndex = 0
    for (let i = 0; i < SECTIONS.length; i++) {
      if (scrollOffset >= SECTIONS[i].progress) {
        sectionIndex = i
      }
    }

    // Map the overall scroll progress to the car animation progress
    let mappedProgress
    if (sectionIndex >= SECTIONS.length - 1) {
      mappedProgress = 1
    } else {
      const sectionStart = SECTIONS[sectionIndex].progress
      const sectionEnd = SECTIONS[sectionIndex + 1]?.progress || 1
      const sectionProgress = (scrollOffset - sectionStart) / (sectionEnd - sectionStart)
      mappedProgress = sectionStart + sectionProgress * (sectionEnd - sectionStart)
    }

    return mappedProgress
  })

  return (
    <group>
      <Suspense fallback={null}>
        <CarModel 
          scrollProgress={currentProgress.current}
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
