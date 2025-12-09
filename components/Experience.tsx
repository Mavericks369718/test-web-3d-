import React from 'react';
import { ScrollControls, Scroll, Environment, useScroll, Float } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { LittlestTokyo } from './LittlestTokyo';
import { Overlay } from './Overlay';

const ParallaxEnvironment = () => {
  const scroll = useScroll();
  const { scene } = useThree();

  useFrame((state, delta) => {
    // Rotate the environment based on scroll position for a parallax effect
    // We rotate around the Y axis
    const targetRotation = -scroll.offset * Math.PI * 0.5;
    
    // Smoothly dampen the rotation
    if (scene.environmentRotation) {
      scene.environmentRotation.y = THREE.MathUtils.damp(
        scene.environmentRotation.y,
        targetRotation,
        4,
        delta
      );
    }
  });

  return null;
};

export const Experience: React.FC = () => {
  return (
    <>
      {/* 
        ScrollControls creates a HTML scroll container in front of the canvas
        pages={3} means the scroll area is 300% of the viewport height.
        damping={0.25} adds a smooth physics effect to the scroll.
      */}
      <ScrollControls pages={3} damping={0.25}>
        
        {/* 
           Environment provides IBL (Image Based Lighting).
           We place it inside ScrollControls so we can pair it with our ParallaxEnvironment
           helper which relies on useScroll().
        */}
        <Environment preset="apartment" background={false} blur={1} />
        <ParallaxEnvironment />

        {/* 
          Float adds a subtle continuous animation (floating and rotating) 
          which makes the scene feel alive even when not scrolling.
        */}
        <Float 
          speed={1.5} 
          rotationIntensity={0.5} 
          floatIntensity={0.5} 
          floatingRange={[-0.1, 0.1]}
        >
          {/* 3D Content that moves based on scroll */}
          <LittlestTokyo />
        </Float>

        {/* HTML Content that scrolls */}
        <Scroll html style={{ width: '100%' }}>
          <Overlay />
        </Scroll>
        
      </ScrollControls>
    </>
  );
};