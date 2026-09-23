import React from 'react';

export const AmbientThemeBackground: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Deep Charcoal / Near-Black Background */}
      <div className="absolute inset-0 bg-[#0B0D14]" />
      
      {/* Subtle Micro-Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Very subtle restrained dark gradient highlight in top center */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] opacity-[0.04] blur-3xl pointer-events-none bg-indigo-500 rounded-full"
      />
    </div>
  );
};
