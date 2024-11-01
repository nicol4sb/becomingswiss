import React from 'react';
import { useTranslation } from 'react-i18next';

function Contact() {
  const { t } = useTranslation();
  return (
    <div className="contact">
      <h2>{t('contact')}</h2>
      <p>Contact form or contact details will go here.</p>
    </div>
  );
}

export default Contact;
