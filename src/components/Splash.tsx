import React, { useState, useEffect } from "react";

interface SplashProps {
  onComplete: () => void;
}

const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 600);
    }, 1200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary to-secondary transition-opacity duration-600 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-center">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-highlight text-background px-4 py-2 rounded-2xl font-medium focus-ring"
        >
          Skip to main content
        </a>

        <div className="animate-splash-logo">
          <div className="mb-6 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl shadow-2xl">
              <img src="/logo1.png" alt="logo" className="w-48" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-white mb-2">PlanMyWeekend</h1>

          <p className="text-white/80 text-lg font-light">
            Plan your perfect weekend
          </p>
        </div>
      </div>
    </div>
  );
};

export default Splash;
