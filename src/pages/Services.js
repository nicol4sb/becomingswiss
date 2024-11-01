import React from 'react';
import { useTranslation } from 'react-i18next';

function Services() {
  const { t } = useTranslation();
  return (
    <div className="services">
      <h2>{t('services')}</h2>
      <p>Details about the services offered to help with Swiss citizenship.</p>
    </div>
  );
}

export default Services;
