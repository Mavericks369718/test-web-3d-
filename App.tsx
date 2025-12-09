import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { Experience } from './components/Experience';

const App: React.FC = () => {
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [5, 2, 8], fov: 40 }}
        className="touch-none"
      >
        <color attach="background" args={['#bfe3dd']} />
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>
      <Loader 
        containerStyles={{ background: '#bfe3dd' }} 
        innerStyles={{ background: 'white', height: '2px' }}
        barStyles={{ background: '#2983ff', height: '2px' }}
        dataStyles={{ color: '#2983ff', fontFamily: 'sans-serif' }}
      />
    </>
  );
};

export default App;