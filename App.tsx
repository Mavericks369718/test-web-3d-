import React, { Suspense, ErrorInfo, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { Experience } from './components/Experience';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary to catch 3D/Suspense errors
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen w-full bg-red-50 text-red-900 p-8 font-sans">
          <div className="max-w-md text-center bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="mb-4 text-sm opacity-80">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
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
        containerStyles={{ 
          background: 'radial-gradient(circle at center, #d4f1ec 0%, #bfe3dd 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }} 
        innerStyles={{ 
          background: 'rgba(255,255,255,0.3)', 
          height: '6px',
          width: '240px',
          borderRadius: '3px',
          marginTop: '20px',
          border: '1px solid rgba(255,255,255,0.5)'
        }}
        barStyles={{ 
          background: '#ff6b6b', 
          height: '6px',
          borderRadius: '3px',
          boxShadow: '0 0 10px rgba(255, 107, 107, 0.4)'
        }}
        dataStyles={{ 
          color: '#5f6f75', 
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
          fontSize: '14px',
          marginTop: '12px',
          fontWeight: '600',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}
        dataInterpolation={(p) => `Loading ${p.toFixed(0)}%`}
      />
    </ErrorBoundary>
  );
};

export default App;