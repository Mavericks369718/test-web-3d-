import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Define the source URL for the model
// Using GitHub Raw is often more reliable for CORS than direct threejs.org links in sandboxes
const MODEL_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/LittlestTokyo.glb';

// Helper for smooth damping (Frame-rate independent lerp)
const damp = (current: number, target: number, lambda: number, delta: number) => {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * delta));
};

export const LittlestTokyo: React.FC = () => {
  const group = useRef<THREE.Group>(null);
  const scroll = useScroll();
  
  // Load the GLTF model and animations
  // useGLTF handles DRACO decompression automatically if needed
  const { scene, animations } = useGLTF(MODEL_URL);
  
  // Extract animations
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Play the first animation clip found
    if (actions && animations.length > 0) {
      const firstAction = actions[animations[0].name];
      firstAction?.play();
    }
  }, [actions, animations]);

  // Animation loop for scroll interaction
  useFrame((state, delta) => {
    if (!group.current) return;

    // The scroll.offset is a value between 0 and 1
    const offset = scroll.offset;

    // Rotation logic:
    // Rotate the entire model slowly based on scroll position
    const targetRotationY = offset * Math.PI * 2;
    
    group.current.rotation.y = damp(
      group.current.rotation.y, 
      targetRotationY, 
      4, 
      delta
    );

    // Position Handling (Parallax)
    const targetX = 1 + Math.sin(offset * Math.PI * 2) * 2; // Moves left/right
    const targetY = 1 - offset * 2; // Moves up as we scroll down
    const targetZ = offset * 3; // Moves closer
    
    group.current.position.x = damp(group.current.position.x, targetX, 2, delta);
    group.current.position.y = damp(group.current.position.y, targetY, 2, delta);
    group.current.position.z = damp(group.current.position.z, targetZ, 2, delta);
  });

  return (
    <group ref={group} dispose={null}>
      <primitive 
        object={scene} 
        scale={[0.01, 0.01, 0.01]} 
        position={[1, 1, 0]} 
      />
    </group>
  );
};

// Preload the model to prevent stutter
useGLTF.preload(MODEL_URL);