import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/* --- CSS Imports --- */
import './App.css';

/* --- Components & Pages --- */
import Navbar from './Navbar';
import Footer from './Footer';
import { HomePageContent } from './first';
import Features from './features';
import Contact from './contact';
import MainAppContent from './Page'; // Shop
import GardenPage from './garden';
import About from './about';
import SignupLogin from './signupLogin';
import Profile from './profile';
import Diagnose from './diagnose';
import Community from './Community';
import AdminPanel from './AdminPanel';

function App() {
  // Toggle for animations (bubbles/leaves)
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  return (
    <Router>
      <div className="App flex flex-col min-h-screen">

        {/* --- Background Animations --- */}
        {animationsEnabled && (
          <>
            <div className="bubble-container">
              {[...Array(8)].map((_, i) => <div key={i} className="bubble"></div>)}
            </div>
            <div className="leaf-container">
              {[...Array(6)].map((_, i) => <div key={i} className="leaf">{i % 2 === 0 ? '🍃' : '🌿'}</div>)}
            </div>
          </>
        )}

        {/* --- Navbar --- */}
        <Navbar
          animationsEnabled={animationsEnabled}
          setAnimationsEnabled={setAnimationsEnabled}
        />

        {/* --- Main Content --- */}
        <main
          className="flex-grow flex flex-col items-center justify-start px-4"
          style={{
            paddingTop: '110px',
            paddingBottom: '2rem',
            position: 'relative',
            zIndex: 1
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

        {/* --- Footer --- */}
        <Footer />

        {/* --- External Fonts --- */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />

        {/* --- External Stylesheets --- */}
        {/* Note: Bootstap/Icons are better loaded via index.html or npm imports, but keeping here for now to avoid breaking changes if they aren't in index.html */}
        <style>
          {`
            @import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css");
            @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");
            @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");
          `}
        </style>
      </div>
    </Router>
  );
}

export default App;

