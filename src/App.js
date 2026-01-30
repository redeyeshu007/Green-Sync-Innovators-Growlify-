import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Global Styles */
import "./App.css";

/* Layout Components */
import Navbar from "./Navbar";
import Footer from "./Footer";

/* Pages */
import { HomePageContent } from "./first";
import Features from "./features";
import Contact from "./contact";
import MainAppContent from "./Page";
import GardenPage from "./garden";
import About from "./about";
import SignupLogin from "./signupLogin";
import Profile from "./profile";
import Diagnose from "./diagnose";
import Community from "./Community";
import AdminPanel from "./AdminPanel";

const App = () => {
  // Controls decorative background animations
  const [showAnimations, setShowAnimations] = useState(true);

  const bubbles = Array.from({ length: 8 });
  const leaves = Array.from({ length: 6 });

  return (
    <BrowserRouter>
      <div className="App flex flex-col min-h-screen">

        {/* Decorative background elements */}
        {showAnimations && (
          <>
            <div className="bubble-container">
              {bubbles.map((_, index) => (
                <div key={`bubble-${index}`} className="bubble" />
              ))}
            </div>

            <div className="leaf-container">
              {leaves.map((_, index) => (
                <div key={`leaf-${index}`} className="leaf">
                  {index % 2 === 0 ? "🍃" : "🌿"}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Top Navigation */}
        <Navbar
          animationsEnabled={showAnimations}
          setAnimationsEnabled={setShowAnimations}
        />

        {/* Page Content */}
        <main
          className="flex-grow flex flex-col items-center px-4"
          style={{
            paddingTop: "110px",
            paddingBottom: "2rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Routes>
            <Route path="/" element={<HomePageContent />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shop" element={<MainAppContent />} />
            <Route path="/my-garden" element={<GardenPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<SignupLogin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/diagnose" element={<Diagnose />} />
            <Route path="/community" element={<Community />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>

        {/* Footer Section */}
        <Footer />

        {/* Fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
        />

        {/* External CSS (kept here intentionally) */}
        <style>{`
          @import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css");
          @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");
          @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");
        `}</style>
      </div>
    </BrowserRouter>
  );
};

export default App;
