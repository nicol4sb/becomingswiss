import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
const resources = {
  en: {
    translation: {
      welcome: "Welcome to Becoming Swiss",
      description: "We simplify the path to Swiss citizenship, guiding you through every step of the administrative process.",
      services: "Our Services",
      contact: "Contact Us",
      footer: "© 2024 Becoming Swiss. All rights reserved.",
    },
  },
  de: {
    translation: {
      welcome: "Willkommen bei Becoming Swiss",
      description: "Wir vereinfachen den Weg zur Schweizer Staatsbürgerschaft und begleiten Sie durch jeden Schritt des Verwaltungsprozesses.",
      services: "Unsere Dienstleistungen",
      contact: "Kontaktieren Sie uns",
      footer: "© 2024 Becoming Swiss. Alle Rechte vorbehalten.",
    },
  },
  fr: {
    translation: {
      welcome: "Bienvenue chez Becoming Swiss",
      description: "Nous simplifions le chemin vers la citoyenneté suisse en vous guidant à chaque étape du processus administratif.",
      services: "Nos Services",
      contact: "Contactez-nous",
      footer: "© 2024 Becoming Swiss. Tous droits réservés.",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // default language
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
