import React, { useRef } from 'react';
import { ScrollControls, Scroll, Environment, useScroll, Float } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { LittlestTokyo } from './LittlestTokyo';
import { Overlay } from './Overlay';

// Helper for smooth damping (Frame-rate independent lerp)
const damp = (current: number, target: number, lambda: number, delta: number) => {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * delta));
};

const ParallaxEnvironment = () => {
  const scroll = useScroll();
  const { scene } = useThree();
  
  // Refs for idle rotation logic
  const idleTimer = useRef(0);
  const extraRotation = useRef(0);

  useFrame((state, delta) => {
    const offset = scroll.offset;
    
    // Check if scrolling
    const isScrolling = Math.abs(scroll.delta) > 0.0001;

    if (isScrolling) {
      idleTimer.current = 0;
    } else {
      idleTimer.current += delta;
    }

    // If idle for more than 0.5 seconds, add to the extra rotation
    if (idleTimer.current > 0.5) {
      extraRotation.current += delta * 0.05;
    }

    // Rotate the environment based on scroll position for a dynamic lighting effect
    // We rotate around Y for horizontal movement and X for a subtle vertical tilt
    // Added extraRotation.current to the Y axis for the idle effect
    const targetRotationY = (-offset * Math.PI * 0.5) + extraRotation.current;
    const targetRotationX = (offset - 0.5) * Math.PI * 0.15; // Subtle tilt up/down
    
    // Cast scene to any to access newer properties that might not be in the types yet
    const s = scene as any;

    if (s.environmentRotation) {
      s.environmentRotation.y = damp(
        s.environmentRotation.y,
        targetRotationY,
        4,
        delta
      );
      s.environmentRotation.x = damp(
        s.environmentRotation.x,
        targetRotationX,
        4,
        delta
      );
    }

    // Adjust environment intensity based on scroll (brighter in middle sections)
    // Checks if environmentIntensity exists (Three.js r163+)
    if ('environmentIntensity' in s) {
      // Intensity peaks at 1.5 in the middle of scroll, base is 0.8
      const targetIntensity = 0.8 + Math.sin(offset * Math.PI) * 0.7;
      s.environmentIntensity = damp(
        s.environmentIntensity,
        targetIntensity,
        2,
        delta
      );
    }
  });

  return null;
};

const IdleRotation: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const group = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const timer = useRef(0);
  const speed = useRef(0);

  useFrame((state, delta) => {
    if (!group.current) return;

    // Check if user is scrolling by looking at the delta (change in scroll)
    const isScrolling = Math.abs(scroll.delta) > 0.0001;

    if (isScrolling) {
      timer.current = 0;
    } else {
      timer.current += delta;
    }

    // Resume rotation after 0.5s of inactivity
    // If scrolling, target speed is 0. If idle, target speed is 0.15 radians/sec
    const shouldRotate = timer.current > 0.5;
    const targetSpeed = shouldRotate ? 0.15 : 0;

    // Smoothly interpolate current speed to target speed
    speed.current = damp(speed.current, targetSpeed, 2, delta);

    // Apply rotation
    group.current.rotation.y += speed.current * delta;
  });

  return <group ref={group}>{children}</group>;
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
          IdleRotation wraps the content to add a gentle spin when the user stops scrolling.
        */}
        <IdleRotation>
          {/* 
            Float adds a subtle continuous animation (floating and rotating) 
            which makes the scene feel alive even when not scrolling.
          */}
          <Float 
            speed={2} 
            rotationIntensity={0.2} 
            floatIntensity={0.2} 
            floatingRange={[-0.05, 0.05]}
          >
            {/* 3D Content that moves based on scroll */}
            <LittlestTokyo />
          </Float>
        </IdleRotation>

        {/* HTML Content that scrolls */}
        <Scroll html style={{ width: '100%' }}>
          <Overlay />
        </Scroll>
        
      </ScrollControls>
    </>
  );
};