"use client"
// ...existing imports...

export default function FullPageCanvas() {
  return (
    <div className="w-screen h-screen">
      <Canvas
        className="touch-none"
        shadows="soft"
        dpr={[1, 2]}
        gl={{ powerPreference: "high-performance", antialias: false }}
      >
        <color attach="background" args={['#000000']} />
        <ScrollControls
          pages={4}
          damping={0.25}
          distance={1}
          enabled={!window?.matchMedia('(max-width: 640px)').matches} // Disable ScrollControls on mobile
        >
          <Suspense fallback={null}>
            <CarScene />
          </Suspense>
          <Overlay />
        </ScrollControls>
      </Canvas>
    </div>
  )
}
