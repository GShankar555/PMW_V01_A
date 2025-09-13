import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Splash from "./components/Splash";
import Header from "./components/Header";
import PageTransition from "./components/PageTransition";
import Toast from "./components/Toast";
import { AppProvider } from "./context/AppContext";
import { useAppContext } from "./context/AppContext";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Saved from "./pages/Saved";
import Planner from "./pages/Planner";

const AppContent: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toastMessage, hideToast } = useAppContext();

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <div
          className={`transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-50" : "opacity-100"
          }`}
          onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
        >
          <Routes>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
            <Route
              path="/explore"
              element={
                <PageTransition>
                  <Explore />
                </PageTransition>
              }
            />
            <Route
              path="/saved"
              element={
                <PageTransition>
                  <Saved />
                </PageTransition>
              }
            />
            <Route
              path="/planner"
              element={
                <PageTransition>
                  <Planner />
                </PageTransition>
              }
            />
          </Routes>
        </div>
        {toastMessage && <Toast message={toastMessage} onClose={hideToast} />}
      </div>
    </Router>
  );
};

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashComplete = () => {
    setShowSplash(false);
  };
  if (showSplash) {
    return <Splash onComplete={handleSplashComplete} />;
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
