import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Define the source URL for the model (Official Three.js example asset)
const MODEL_URL = 'https://threejs.org/examples/models/gltf/LittlestTokyo.glb';

export const LittlestTokyo: React.FC = () => {
  const group = useRef<THREE.Group>(null);
  const scroll = useScroll();
  
  // Load the GLTF model and animations
  // useGLTF handles DRACO decompression automatically if needed
  const { scene, animations } = useGLTF(MODEL_URL);
  
  // Extract animations
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Play the first animation clip found, similar to the original code:
    // mixer.clipAction( gltf.animations[ 0 ] ).play();
    if (actions && animations.length > 0) {
      const firstAction = actions[animations[0].name];
      firstAction?.play();
    }
  }, [actions, animations]);

  // Animation loop for scroll interaction
  useFrame((state, delta) => {
    if (!group.current) return;

    // The scroll.offset is a value between 0 and 1
    // 0 = top, 1 = bottom
    const offset = scroll.offset;

    // Rotation logic:
    // Rotate the entire model slowly based on scroll position
    // Initial rotation y is usually 0. Let's make it spin 360 degrees (2 * PI) over the full scroll
    // but keep it subtle.
    
    // We can also move the model position to create a parallax effect.
    // Section 1 (0.0 - 0.33): Center
    // Section 2 (0.33 - 0.66): Move Left
    // Section 3 (0.66 - 1.0): Move Right
    
    // Smooth dampening for rotation
    const targetRotationY = offset * Math.PI * 2;
    // Simple linear interpolation for demonstration, normally would use MathUtils.damp
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y, 
      targetRotationY, 
      4, 
      delta
    );

    // Position Handling (Parallax)
    // Original pos: [1, 1, 0]
    const targetX = 1 + Math.sin(offset * Math.PI * 2) * 2; // Moves left/right
    const targetY = 1 - offset * 2; // Moves up as we scroll down
    const targetZ = offset * 3; // Moves closer
    
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetX, 2, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetY, 2, delta);
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, targetZ, 2, delta);
  });

  return (
    <group ref={group} dispose={null}>
      <primitive 
        object={scene} 
        scale={[0.01, 0.01, 0.01]} 
        position={[1, 1, 0]} // Initial position from original code
      />
    </group>
  );
};

// Preload the model to prevent stutter
useGLTF.preload(MODEL_URL);