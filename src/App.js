import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaWhatsapp
} from 'react-icons/fa';
import { motion } from 'framer-motion';

import './App.css';

function App() {
  const { t, i18n } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState('en');

  // Language switcher function
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setActiveLanguage(language);
  };

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.header');
      if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <a href="#home" className="logo">
            <span className="logo-icon">🇨🇭</span>
            Becoming Swiss
          </a>
          <div className="language-switcher">
            <button 
              onClick={() => changeLanguage('en')} 
              className={`lang-btn ${activeLanguage === 'en' ? 'active' : ''}`}
            >
              EN
            </button>
            <button 
              onClick={() => changeLanguage('de')} 
              className={`lang-btn ${activeLanguage === 'de' ? 'active' : ''}`}
            >
              DE
            </button>
            <button 
              onClick={() => changeLanguage('fr')} 
              className={`lang-btn ${activeLanguage === 'fr' ? 'active' : ''}`}
            >
              FR
            </button>
          </div>
        </div>
      </header>

      {/* Process Section */}
      <section className="process section" id="home">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-center">{t('process_title')}</h2>
          </motion.div>

          <motion.div 
            className="process-steps"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="step-card" variants={itemVariants}>
              <div className="step-number">1</div>
              <h3>{t('process_step1_title')}</h3>
              <p>{t('process_step1_desc')}</p>
            </motion.div>

            <motion.div className="step-card" variants={itemVariants}>
              <div className="step-number">2</div>
              <h3>{t('process_step2_title')}</h3>
              <p>{t('process_step2_desc')}</p>
            </motion.div>

            <motion.div className="step-card" variants={itemVariants}>
              <div className="step-number">3</div>
              <h3>{t('process_step3_title')}</h3>
              <p>{t('process_step3_desc')}</p>
            </motion.div>

            <motion.div className="step-card" variants={itemVariants}>
              <div className="step-number">4</div>
              <h3>{t('process_step4_title')}</h3>
              <p>{t('process_step4_desc')}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-center">{t('testimonials_title')}</h2>
          </motion.div>

          <motion.div 
            className="testimonials-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="testimonial-card" variants={itemVariants}>
              <div className="testimonial-content">
                {t('testimonial1_content')}
              </div>
              <div className="testimonial-author">{t('testimonial1_author')}</div>
              <div className="testimonial-location">{t('testimonial1_location')}</div>
            </motion.div>

            <motion.div className="testimonial-card" variants={itemVariants}>
              <div className="testimonial-content">
                {t('testimonial2_content')}
              </div>
              <div className="testimonial-author">{t('testimonial2_author')}</div>
              <div className="testimonial-location">{t('testimonial2_location')}</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>{t('cta_title')}</h2>
            
            <div className="cta-buttons">
              <motion.a 
                href={`https://wa.me/41764071979?text=${encodeURIComponent(t('whatsapp_message'))}`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaWhatsapp /> {t('cta_whatsapp')}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default App;
