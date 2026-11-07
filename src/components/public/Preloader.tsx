import React, { useEffect, useState } from 'react';

export const Preloader: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => setVisible(false), 500);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#0f172a] flex items-center justify-center transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-center text-white">
        <div className="w-16 h-16 border-4 border-white/20 border-t-[#3b82f6] rounded-full animate-spin mx-auto mb-5" />
        <h2 className="text-2xl font-bold tracking-wide font-heading">Lingaraj Portfolio</h2>
        <p className="text-sm text-slate-400 mt-1">Loading Quality Assurance Suite...</p>
      </div>
    </div>
  );
};

export const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        setProgress((scrollTop / height) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-[4px] bg-[#2563eb] z-[9999] transition-all duration-75"
      style={{ width: `${progress}%` }}
    />
  );
};
