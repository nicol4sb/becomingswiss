import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
const resources = {
  en: {
    translation: {
      // Process Section
      process_title: "Your Journey to Swiss Citizenship",
      
      process_step1_title: "Initial Consultation",
      process_step1_desc: "Free assessment of your eligibility and personalized roadmap for your Swiss citizenship journey.",
      
      process_step2_title: "Document Preparation",
      process_step2_desc: "We help you gather and prepare all required documents, ensuring everything meets Swiss standards.",
      
      process_step3_title: "Application Submission",
      process_step3_desc: "Expert handling of your application submission across all required administrative levels.",
      
      process_step4_title: "Follow-up & Support",
      process_step4_desc: "Continuous support throughout the process, including test preparation and final approval assistance.",

      // Testimonials Section
      testimonials_title: "What Our Clients Say",
      
      testimonial1_content: "We had been putting off our citizenship application for a couple of years, unsure if we were even eligible and worried about all the paperwork. Becoming Swiss handled everything so professionally - within 2 weeks they had collected all our documents and submitted our application.",
      testimonial1_author: "Namita and Ankush A.",
      testimonial1_location: "Wettswill, Switzerland",
      
      testimonial2_content: "The fear of administrative burden kept us delaying for months. Becoming Swiss took care of all the forms and requirements, making the whole process stress-free. Their expertise and support were invaluable throughout.",
      testimonial2_author: "Julie and Alexis S.",
      testimonial2_location: "Thalwil, Switzerland",

      // CTA Section
      cta_title: "Ready to Start Your Journey?",
      cta_subtitle: "Contact us today for a free consultation and take the first step towards becoming Swiss.",
      cta_whatsapp: "Chat on WhatsApp",
      whatsapp_message: "Hi! I need some support with the Swiss passport application process. Could we chat?",

      // Footer
      footer_privacy: "Privacy Policy",
      footer_about: "About Us",
      footer_confidentiality: "Complete confidentiality guaranteed",
      footer_rights: "All rights reserved."
    },
  },
  de: {
    translation: {
      // Process Section
      process_title: "Ihr Weg zur Schweizer Staatsbürgerschaft",
      
      process_step1_title: "Erstberatung",
      process_step1_desc: "Kostenlose Bewertung Ihrer Berechtigung und personalisierte Roadmap für Ihre Schweizer Staatsbürgerschaftsreise.",
      
      process_step2_title: "Dokumentenvorbereitung",
      process_step2_desc: "Wir helfen Ihnen bei der Sammlung und Vorbereitung aller erforderlichen Dokumente und stellen sicher, dass alles den Schweizer Standards entspricht.",
      
      process_step3_title: "Antragseinreichung",
      process_step3_desc: "Fachkundige Bearbeitung Ihrer Antragseinreichung auf allen erforderlichen Verwaltungsebenen.",
      
      process_step4_title: "Nachbetreuung & Support",
      process_step4_desc: "Kontinuierliche Unterstützung während des gesamten Prozesses, einschließlich Testvorbereitung und Unterstützung bei der endgültigen Genehmigung.",

      // Testimonials Section
      testimonials_title: "Was unsere Kunden sagen",
      
      testimonial1_content: "Wir hatten unseren Staatsbürgerschaftsantrag ein paar Jahre aufgeschoben, unsicher ob wir überhaupt berechtigt waren und besorgt über all die Papiere. Becoming Swiss hat alles so professionell gehandhabt - innerhalb von 2 Wochen hatten sie alle unsere Dokumente gesammelt und unseren Antrag eingereicht.",
      testimonial1_author: "Namita und Ankush A.",
      testimonial1_location: "Wettswill, Schweiz",
      
      testimonial2_content: "Die Angst vor der Verwaltungslast ließ uns monatelang zögern. Becoming Swiss hat sich um alle Formulare und Anforderungen gekümmert und den gesamten Prozess stressfrei gemacht. Ihre Expertise und Unterstützung waren während des gesamten Prozesses unbezahlbar.",
      testimonial2_author: "Julie und Alexis S.",
      testimonial2_location: "Thalwil, Schweiz",

      // CTA Section
      cta_title: "Bereit, Ihre Reise zu beginnen?",
      cta_subtitle: "Kontaktieren Sie uns heute für eine kostenlose Beratung und machen Sie den ersten Schritt zur Schweizer Staatsbürgerschaft.",
      cta_whatsapp: "WhatsApp Chat",
      whatsapp_message: "Hallo! Ich brauche Unterstützung beim Schweizer Passantragsverfahren. Können wir chatten?",

      // Footer
      footer_privacy: "Datenschutz",
      footer_about: "Über uns",
      footer_confidentiality: "Vollständige Vertraulichkeit garantiert",
      footer_rights: "Alle Rechte vorbehalten."
    },
  },
  fr: {
    translation: {
      // Process Section
      process_title: "Votre Chemin vers la Citoyenneté Suisse",
      
      process_step1_title: "Consultation Initiale",
      process_step1_desc: "Évaluation gratuite de votre éligibilité et feuille de route personnalisée pour votre parcours vers la citoyenneté suisse.",
      
      process_step2_title: "Préparation des Documents",
      process_step2_desc: "Nous vous aidons à rassembler et préparer tous les documents requis, en nous assurant que tout respecte les standards suisses.",
      
      process_step3_title: "Soumission de la Demande",
      process_step3_desc: "Gestion experte de votre soumission de demande à tous les niveaux administratifs requis.",
      
      process_step4_title: "Suivi & Support",
      process_step4_desc: "Support continu tout au long du processus, incluant la préparation aux tests et l'assistance à l'approbation finale.",

      // Testimonials Section
      testimonials_title: "Ce que Disent Nos Clients",
      
      testimonial1_content: "Nous avions repoussé notre demande de citoyenneté pendant quelques années, incertains si nous étions même éligibles et inquiets de tous les papiers. Becoming Swiss a tout géré si professionnellement - en 2 semaines ils avaient collecté tous nos documents et soumis notre demande.",
      testimonial1_author: "Namita et Ankush A.",
      testimonial1_location: "Wettswill, Suisse",
      
      testimonial2_content: "La peur de la charge administrative nous a fait retarder pendant des mois. Becoming Swiss s'est occupé de tous les formulaires et exigences, rendant tout le processus sans stress. Leur expertise et soutien ont été inestimables tout au long du processus.",
      testimonial2_author: "Julie et Alexis S.",
      testimonial2_location: "Thalwil, Suisse",

      // CTA Section
      cta_title: "Prêt à Commencer Votre Voyage ?",
      cta_subtitle: "Contactez-nous aujourd'hui pour une consultation gratuite et faites le premier pas vers la citoyenneté suisse.",
      cta_whatsapp: "Chat WhatsApp",
      whatsapp_message: "Salut ! J'ai besoin d'aide pour le processus de demande de passeport suisse. On peut discuter ?",

      // Footer
      footer_privacy: "Politique de Confidentialité",
      footer_about: "À Propos",
      footer_confidentiality: "Confidentialité complète garantie",
      footer_rights: "Tous droits réservés."
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // react already safe from xss
  },
});

export default i18n;
