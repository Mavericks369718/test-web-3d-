import React from 'react';

const Section: React.FC<{
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
}> = ({ children, align = 'center', className = '' }) => {
  const alignClasses = {
    left: 'items-start text-left',
    right: 'items-end text-right',
    center: 'items-center text-center',
  };

  return (
    <section 
      className={`h-screen w-full flex flex-col justify-center p-10 ${alignClasses[align]} ${className}`}
    >
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-lg transition-transform duration-500 hover:scale-105">
        {children}
      </div>
    </section>
  );
};

export const Overlay: React.FC = () => {
  return (
    <div className="w-full">
      <Section align="center">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Littlest Tokyo
        </h1>
        <p className="text-lg text-slate-700 leading-relaxed font-medium">
          A recreation of the classic Three.js example using 
          <span className="text-blue-600"> React Three Fiber</span>.
        </p>
        <p className="text-sm text-slate-500 mt-6">
          Scroll down to explore the details
        </p>
        <div className="mt-8 animate-bounce">
           <svg className="w-6 h-6 text-slate-900 mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </Section>

      <Section align="right">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Intricate Details
        </h2>
        <p className="text-slate-700 leading-relaxed">
          The model features a charming low-poly aesthetic depicting a futuristic yet nostalgic Tokyo street corner.
          Notice the animated train running through the building and the subtle neon signs.
        </p>
      </Section>

      <Section align="left">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Technical Credits
        </h2>
        <p className="text-slate-700 mb-4">
          Model: <a href="https://artstation.com/artwork/1AGwX" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold">Littlest Tokyo</a> by <a href="https://artstation.com/glenatron" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Glen Fox</a>.
        </p>
        <p className="text-slate-700">
          Built with React 18, Tailwind CSS, and React Three Fiber.
        </p>
        <div className="mt-6 flex gap-4">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-colors">
                View Source
            </button>
            <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-full font-bold hover:bg-blue-50 transition-colors">
                Documentation
            </button>
        </div>
      </Section>
    </div>
  );
};