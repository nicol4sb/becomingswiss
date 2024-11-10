import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import './App.css';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

function App() {
  const { i18n } = useTranslation();

  // Language switcher function
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav className="top-menu">
            <div className="logo">🇨🇭 Becoming Swiss</div>
            <ul className="menu">
              <li><a href="/">Home</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/contact">Contact</a></li>
              {/* Language Switcher directly to the right of menu items */}
              <div className="language-switcher">
                <button onClick={() => changeLanguage('en')}>EN</button>
                <button onClick={() => changeLanguage('de')}>DE</button>
                <button onClick={() => changeLanguage('fr')}>FR</button>
              </div>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <footer className="App-footer">
          <p>© 2024 Becoming Swiss</p>
          <div className="social-icons">
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
