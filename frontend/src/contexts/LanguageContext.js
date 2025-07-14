import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Traduções completas para cada idioma
const translations = {
  pt: {
    // Header
    'nav.home': 'Início',
    'nav.video': 'Vídeo',
    'nav.benefits': 'Benefícios',
    'nav.price': 'Preço',
    
    // Hero Section
    'hero.title': 'DOMINE O MERCADO CRIPTO',
    'hero.subtitle': 'O Setup Completo que Transformou Minha Vida no Trading',
    'hero.description': 'Descubra o método que uso para gerar lucros consistentes',
    'hero.cta.primary': 'Ver Vídeo Agora',
    'hero.cta.secondary': 'Comprar Agora',
    'hero.badge.tested': 'Método Testado',
    'hero.badge.practical': '100% Prático',
    'hero.badge.results': 'Resultados Reais',
    
    // VSL Section
    'vsl.title': 'Assista ao Vídeo e Descubra Como Ganhar Consistentemente',
    'vsl.subtitle': 'Veja como eu transformei apenas R$ 1.000 em mais de R$ 100.000 em apenas 6 meses usando essa estratégia simples e eficaz.',
    'vsl.exclusive': 'Vídeo Exclusivo',
    'vsl.click': 'Clique para assistir a estratégia completa',
    'vsl.warning': '⚠️ Este vídeo contém informações confidenciais do meu método de trading',
    'vsl.live': '🔴 AO VIVO',
    'vsl.limited': '⚡ LIMITADO',
    
    // Features Section
    'features.title': 'O Que Você Vai Aprender',
    'features.subtitle': 'Tudo o que você precisa para se tornar um trader profissional e lucrativo',
    'features.setup.title': 'Setup Completo',
    'features.setup.desc': 'Configuração passo a passo de todas as ferramentas necessárias para operar com sucesso',
    'features.strategies.title': 'Estratégias Rentáveis',
    'features.strategies.desc': 'Métodos testados e aprovados que uso diariamente para gerar lucros consistentes',
    'features.risk.title': 'Gestão de Risco',
    'features.risk.desc': 'Aprenda a proteger seu capital e nunca mais perder dinheiro por emocional',
    'features.analysis.title': 'Análise Técnica',
    'features.analysis.desc': 'Domine os indicadores mais importantes para tomar decisões certeiras',
    'features.automation.title': 'Automação',
    'features.automation.desc': 'Configure bots e alertas para nunca perder uma oportunidade de lucro',
    'features.mindset.title': 'Mindset Vencedor',
    'features.mindset.desc': 'Desenvolva a mentalidade necessária para ser um trader profissional',
    'features.bonus.title': '🎁 BÔNUS EXCLUSIVOS',
    'features.bonus.spreadsheet': '✅ Planilha de Controle de Trades',
    'features.bonus.coins': '✅ Lista de Moedas Recomendadas',
    'features.bonus.script': '✅ Script de Automação Gratuito',
    'features.bonus.group': '✅ Acesso ao Grupo VIP no Telegram',
    
    // Testimonials Section
    'testimonials.title': 'Depoimentos de Quem Já Lucra',
    'testimonials.subtitle': 'Veja os resultados reais de pessoas que aplicaram o método',
    'testimonials.results': '🏆 RESULTADOS COMPROVADOS',
    'testimonials.results.desc': 'Mais de 1.000 pessoas já transformaram suas vidas com nosso método',
    
    // Pricing Section
    'pricing.title': 'Investimento Único',
    'pricing.subtitle': 'Acesso completo ao método que mudou minha vida financeira',
    'pricing.limited': 'OFERTA LIMITADA',
    'pricing.installments': 'ou 12x de R$ {amount} sem juros',
    'pricing.guarantee': '🔒 GARANTIA DE 7 DIAS',
    'pricing.guarantee.desc': '100% do seu dinheiro de volta se não ficar satisfeito',
    'pricing.secure': '🔐 Pagamento Seguro',
    'pricing.immediate': '📱 Acesso Imediato',
    'pricing.support': '🌟 Suporte 24h',
    'pricing.attention': '⏰ ATENÇÃO!',
    'pricing.attention.desc': 'Esta oferta é por tempo limitado. O preço voltará para R$ 497 em breve!',
    'pricing.buy': 'COMPRAR AGORA',
    
    // Footer
    'footer.description': 'Transformando traders iniciantes em profissionais lucrativos através de métodos testados e comprovados.',
    'footer.links': 'Links Úteis',
    'footer.contact': 'Contato',
    'footer.social': 'Redes Sociais',
    'footer.copyright': '© 2024 Codigo R. Todos os direitos reservados.',
    'footer.disclaimer': 'Este produto não garante a obtenção de resultados. Qualquer referência ao desempenho de uma estratégia não deve ser interpretada como uma garantia de resultados.',
    'footer.investment.warning': '⚠️ AVISO IMPORTANTE: Este ebook não constitui recomendação de investimentos. O conteúdo apresenta apenas setup pessoal e experiências do autor. Trading envolve riscos e você pode perder dinheiro. Sempre faça sua própria análise e consulte um profissional qualificado antes de investir.',
    
    // Loading and Common
    'loading': 'Carregando...',
    'save': 'Salvar',
    'cancel': 'Cancelar',
    'edit': 'Editar',
    'delete': 'Excluir',
    'close': 'Fechar',
  },
  
  en: {
    // Header
    'nav.home': 'Home',
    'nav.video': 'Video',
    'nav.benefits': 'Benefits',
    'nav.price': 'Price',
    
    // Hero Section
    'hero.title': 'MASTER THE CRYPTO MARKET',
    'hero.subtitle': 'The Complete Setup That Transformed My Trading Life',
    'hero.description': 'Discover the method I use to generate consistent profits',
    'hero.cta.primary': 'Watch Video Now',
    'hero.cta.secondary': 'Buy Now',
    'hero.badge.tested': 'Tested Method',
    'hero.badge.practical': '100% Practical',
    'hero.badge.results': 'Real Results',
    
    // VSL Section
    'vsl.title': 'Watch the Video and Discover How to Earn Consistently',
    'vsl.subtitle': 'See how I turned just $1,000 into over $100,000 in just 6 months using this simple and effective strategy.',
    'vsl.exclusive': 'Exclusive Video',
    'vsl.click': 'Click to watch the complete strategy',
    'vsl.warning': '⚠️ This video contains confidential information from my trading method',
    'vsl.live': '🔴 LIVE',
    'vsl.limited': '⚡ LIMITED',
    
    // Features Section
    'features.title': 'What You Will Learn',
    'features.subtitle': 'Everything you need to become a professional and profitable trader',
    'features.setup.title': 'Complete Setup',
    'features.setup.desc': 'Step-by-step configuration of all necessary tools to operate successfully',
    'features.strategies.title': 'Profitable Strategies',
    'features.strategies.desc': 'Tested and approved methods I use daily to generate consistent profits',
    'features.risk.title': 'Risk Management',
    'features.risk.desc': 'Learn to protect your capital and never lose money emotionally again',
    'features.analysis.title': 'Technical Analysis',
    'features.analysis.desc': 'Master the most important indicators to make accurate decisions',
    'features.automation.title': 'Automation',
    'features.automation.desc': 'Set up bots and alerts to never miss a profit opportunity',
    'features.mindset.title': 'Winning Mindset',
    'features.mindset.desc': 'Develop the mindset necessary to be a professional trader',
    'features.bonus.title': '🎁 EXCLUSIVE BONUSES',
    'features.bonus.spreadsheet': '✅ Trade Control Spreadsheet',
    'features.bonus.coins': '✅ Recommended Coins List',
    'features.bonus.script': '✅ Free Automation Script',
    'features.bonus.group': '✅ VIP Telegram Group Access',
    
    // Testimonials Section
    'testimonials.title': 'Testimonials from Those Already Profiting',
    'testimonials.subtitle': 'See real results from people who applied the method',
    'testimonials.results': '🏆 PROVEN RESULTS',
    'testimonials.results.desc': 'Over 1,000 people have already transformed their lives with our method',
    
    // Pricing Section
    'pricing.title': 'One-Time Investment',
    'pricing.subtitle': 'Complete access to the method that changed my financial life',
    'pricing.limited': 'LIMITED OFFER',
    'pricing.installments': 'or 12x of ${amount} interest-free',
    'pricing.guarantee': '🔒 7-DAY GUARANTEE',
    'pricing.guarantee.desc': '100% money back if not satisfied',
    'pricing.secure': '🔐 Secure Payment',
    'pricing.immediate': '📱 Immediate Access',
    'pricing.support': '🌟 24h Support',
    'pricing.attention': '⏰ ATTENTION!',
    'pricing.attention.desc': 'This offer is for a limited time. The price will return to $497 soon!',
    'pricing.buy': 'BUY NOW',
    
    // Footer
    'footer.description': 'Transforming beginner traders into profitable professionals through tested and proven methods.',
    'footer.links': 'Useful Links',
    'footer.contact': 'Contact',
    'footer.social': 'Social Media',
    'footer.copyright': '© 2024 Codigo R. All rights reserved.',
    'footer.disclaimer': 'This product does not guarantee results. Any reference to strategy performance should not be interpreted as a guarantee of results.',
    'footer.investment.warning': '⚠️ IMPORTANT NOTICE: This ebook does not constitute investment advice. The content presents only personal setup and author experiences. Trading involves risks and you may lose money. Always do your own analysis and consult a qualified professional before investing.',
    
    // Loading and Common
    'loading': 'Loading...',
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'delete': 'Delete',
    'close': 'Close',
  },
  
  es: {
    // Header
    'nav.home': 'Inicio',
    'nav.video': 'Video',
    'nav.benefits': 'Beneficios',
    'nav.price': 'Precio',
    
    // Hero Section
    'hero.title': 'DOMINA EL MERCADO CRYPTO',
    'hero.subtitle': 'La Configuración Completa que Transformó Mi Vida en Trading',
    'hero.description': 'Descubre el método que uso para generar ganancias consistentes',
    'hero.cta.primary': 'Ver Video Ahora',
    'hero.cta.secondary': 'Comprar Ahora',
    'hero.badge.tested': 'Método Probado',
    'hero.badge.practical': '100% Práctico',
    'hero.badge.results': 'Resultados Reales',
    
    // VSL Section
    'vsl.title': 'Mira el Video y Descubre Cómo Ganar Consistentemente',
    'vsl.subtitle': 'Ve cómo convertí solo $1,000 en más de $100,000 en solo 6 meses usando esta estrategia simple y efectiva.',
    'vsl.exclusive': 'Video Exclusivo',
    'vsl.click': 'Haz clic para ver la estrategia completa',
    'vsl.warning': '⚠️ Este video contiene información confidencial de mi método de trading',
    'vsl.live': '🔴 EN VIVO',
    'vsl.limited': '⚡ LIMITADO',
    
    // Features Section
    'features.title': 'Lo Que Vas a Aprender',
    'features.subtitle': 'Todo lo que necesitas para convertirte en un trader profesional y rentable',
    'features.setup.title': 'Configuración Completa',
    'features.setup.desc': 'Configuración paso a paso de todas las herramientas necesarias para operar con éxito',
    'features.strategies.title': 'Estrategias Rentables',
    'features.strategies.desc': 'Métodos probados y aprobados que uso diariamente para generar ganancias consistentes',
    'features.risk.title': 'Gestión de Riesgo',
    'features.risk.desc': 'Aprende a proteger tu capital y nunca más perder dinero por emociones',
    'features.analysis.title': 'Análisis Técnico',
    'features.analysis.desc': 'Domina los indicadores más importantes para tomar decisiones acertadas',
    'features.automation.title': 'Automatización',
    'features.automation.desc': 'Configura bots y alertas para nunca perder una oportunidad de ganancia',
    'features.mindset.title': 'Mentalidad Ganadora',
    'features.mindset.desc': 'Desarrolla la mentalidad necesaria para ser un trader profesional',
    'features.bonus.title': '🎁 BONOS EXCLUSIVOS',
    'features.bonus.spreadsheet': '✅ Hoja de Control de Operaciones',
    'features.bonus.coins': '✅ Lista de Monedas Recomendadas',
    'features.bonus.script': '✅ Script de Automatización Gratuito',
    'features.bonus.group': '✅ Acceso al Grupo VIP en Telegram',
    
    // Testimonials Section
    'testimonials.title': 'Testimonios de Quienes Ya Ganan',
    'testimonials.subtitle': 'Ve los resultados reales de personas que aplicaron el método',
    'testimonials.results': '🏆 RESULTADOS COMPROBADOS',
    'testimonials.results.desc': 'Más de 1,000 personas ya han transformado sus vidas con nuestro método',
    
    // Pricing Section
    'pricing.title': 'Inversión Única',
    'pricing.subtitle': 'Acceso completo al método que cambió mi vida financiera',
    'pricing.limited': 'OFERTA LIMITADA',
    'pricing.installments': 'o 12x de ${amount} sin intereses',
    'pricing.guarantee': '🔒 GARANTÍA DE 7 DÍAS',
    'pricing.guarantee.desc': '100% de tu dinero de vuelta si no estás satisfecho',
    'pricing.secure': '🔐 Pago Seguro',
    'pricing.immediate': '📱 Acceso Inmediato',
    'pricing.support': '🌟 Soporte 24h',
    'pricing.attention': '⏰ ¡ATENCIÓN!',
    'pricing.attention.desc': 'Esta oferta es por tiempo limitado. ¡El precio volverá a $497 pronto!',
    'pricing.buy': 'COMPRAR AHORA',
    
    // Footer
    'footer.description': 'Transformando traders principiantes en profesionales rentables a través de métodos probados y comprobados.',
    'footer.links': 'Enlaces Útiles',
    'footer.contact': 'Contacto',
    'footer.social': 'Redes Sociales',
    'footer.copyright': '© 2024 Codigo R. Todos los derechos reservados.',
    'footer.disclaimer': 'Este producto no garantiza la obtención de resultados. Cualquier referencia al rendimiento de una estrategia no debe interpretarse como una garantía de resultados.',
    'footer.investment.warning': '⚠️ AVISO IMPORTANTE: Este ebook no constituye recomendación de inversiones. El contenido presenta solo setup personal y experiencias del autor. Trading involucra riesgos y puedes perder dinero. Siempre haz tu propio análisis y consulta un profesional calificado antes de invertir.',
    
    // Loading and Common
    'loading': 'Cargando...',
    'save': 'Guardar',
    'cancel': 'Cancelar',
    'edit': 'Editar',
    'delete': 'Eliminar',
    'close': 'Cerrar',
  },
  
  it: {
    // Header
    'nav.home': 'Home',
    'nav.video': 'Video',
    'nav.benefits': 'Benefici',
    'nav.price': 'Prezzo',
    
    // Hero Section
    'hero.title': 'DOMINA IL MERCATO CRYPTO',
    'hero.subtitle': 'La Configurazione Completa che ha Trasformato la Mia Vita nel Trading',
    'hero.description': 'Scopri il metodo che uso per generare profitti consistenti',
    'hero.cta.primary': 'Guarda Video Ora',
    'hero.cta.secondary': 'Compra Ora',
    'hero.badge.tested': 'Metodo Testato',
    'hero.badge.practical': '100% Pratico',
    'hero.badge.results': 'Risultati Reali',
    
    // VSL Section
    'vsl.title': 'Guarda il Video e Scopri Come Guadagnare Costantemente',
    'vsl.subtitle': 'Vedi come ho trasformato solo €1.000 in oltre €100.000 in soli 6 mesi usando questa strategia semplice ed efficace.',
    'vsl.exclusive': 'Video Esclusivo',
    'vsl.click': 'Clicca per vedere la strategia completa',
    'vsl.warning': '⚠️ Questo video contiene informazioni riservate del mio metodo di trading',
    'vsl.live': '🔴 LIVE',
    'vsl.limited': '⚡ LIMITATO',
    
    // Features Section
    'features.title': 'Cosa Imparerai',
    'features.subtitle': 'Tutto quello che ti serve per diventare un trader professionale e redditizio',
    'features.setup.title': 'Setup Completo',
    'features.setup.desc': 'Configurazione passo dopo passo di tutti gli strumenti necessari per operare con successo',
    'features.strategies.title': 'Strategie Redditizie',
    'features.strategies.desc': 'Metodi testati e approvati che uso quotidianamente per generare profitti consistenti',
    'features.risk.title': 'Gestione del Rischio',
    'features.risk.desc': 'Impara a proteggere il tuo capitale e non perdere mai più soldi per emozione',
    'features.analysis.title': 'Analisi Tecnica',
    'features.analysis.desc': 'Padroneggia gli indicatori più importanti per prendere decisioni accurate',
    'features.automation.title': 'Automazione',
    'features.automation.desc': 'Configura bot e avvisi per non perdere mai un\'opportunità di profitto',
    'features.mindset.title': 'Mentalità Vincente',
    'features.mindset.desc': 'Sviluppa la mentalità necessaria per essere un trader professionale',
    'features.bonus.title': '🎁 BONUS ESCLUSIVI',
    'features.bonus.spreadsheet': '✅ Foglio di Controllo delle Operazioni',
    'features.bonus.coins': '✅ Lista di Monete Raccomandate',
    'features.bonus.script': '✅ Script di Automazione Gratuito',
    'features.bonus.group': '✅ Accesso al Gruppo VIP su Telegram',
    
    // Testimonials Section
    'testimonials.title': 'Testimonianze di Chi Già Guadagna',
    'testimonials.subtitle': 'Vedi i risultati reali di persone che hanno applicato il metodo',
    'testimonials.results': '🏆 RISULTATI COMPROVATI',
    'testimonials.results.desc': 'Oltre 1.000 persone hanno già trasformato le loro vite con il nostro metodo',
    
    // Pricing Section
    'pricing.title': 'Investimento Unico',
    'pricing.subtitle': 'Accesso completo al metodo che ha cambiato la mia vita finanziaria',
    'pricing.limited': 'OFFERTA LIMITATA',
    'pricing.installments': 'o 12x di €{amount} senza interessi',
    'pricing.guarantee': '🔒 GARANZIA DI 7 GIORNI',
    'pricing.guarantee.desc': '100% dei tuoi soldi indietro se non sei soddisfatto',
    'pricing.secure': '🔐 Pagamento Sicuro',
    'pricing.immediate': '📱 Accesso Immediato',
    'pricing.support': '🌟 Supporto 24h',
    'pricing.attention': '⏰ ATTENZIONE!',
    'pricing.attention.desc': 'Questa offerta è per tempo limitato. Il prezzo tornerà a €497 presto!',
    'pricing.buy': 'COMPRA ORA',
    
    // Footer
    'footer.description': 'Trasformando trader principianti in professionisti redditizi attraverso metodi testati e comprovati.',
    'footer.links': 'Collegamenti Utili',
    'footer.contact': 'Contatto',
    'footer.social': 'Social Media',
    'footer.copyright': '© 2024 Codigo R. Tutti i diritti riservati.',
    'footer.disclaimer': 'Questo prodotto non garantisce l\'ottenimento di risultati. Qualsiasi riferimento alle prestazioni di una strategia non deve essere interpretato come garanzia di risultati.',
    'footer.investment.warning': '⚠️ AVVISO IMPORTANTE: Questo ebook non costituisce raccomandazione di investimenti. Il contenuto presenta solo setup personale ed esperienze dell\'autore. Il trading comporta rischi e potresti perdere denaro. Fai sempre la tua analisi e consulta un professionista qualificato prima di investire.',
    
    // Loading and Common
    'loading': 'Caricamento...',
    'save': 'Salva',
    'cancel': 'Annulla',
    'edit': 'Modifica',
    'delete': 'Elimina',
    'close': 'Chiudi',
  },
  
  fr: {
    // Header
    'nav.home': 'Accueil',
    'nav.video': 'Vidéo',
    'nav.benefits': 'Avantages',
    'nav.price': 'Prix',
    
    // Hero Section
    'hero.title': 'MAÎTRISEZ LE MARCHÉ CRYPTO',
    'hero.subtitle': 'La Configuration Complète qui a Transformé Ma Vie de Trading',
    'hero.description': 'Découvrez la méthode que j\'utilise pour générer des profits constants',
    'hero.cta.primary': 'Voir Vidéo Maintenant',
    'hero.cta.secondary': 'Acheter Maintenant',
    'hero.badge.tested': 'Méthode Testée',
    'hero.badge.practical': '100% Pratique',
    'hero.badge.results': 'Résultats Réels',
    
    // VSL Section
    'vsl.title': 'Regardez la Vidéo et Découvrez Comment Gagner Constamment',
    'vsl.subtitle': 'Voyez comment j\'ai transformé seulement 1 000€ en plus de 100 000€ en seulement 6 mois en utilisant cette stratégie simple et efficace.',
    'vsl.exclusive': 'Vidéo Exclusive',
    'vsl.click': 'Cliquez pour voir la stratégie complète',
    'vsl.warning': '⚠️ Cette vidéo contient des informations confidentielles de ma méthode de trading',
    'vsl.live': '🔴 EN DIRECT',
    'vsl.limited': '⚡ LIMITÉ',
    
    // Features Section
    'features.title': 'Ce Que Vous Allez Apprendre',
    'features.subtitle': 'Tout ce dont vous avez besoin pour devenir un trader professionnel et rentable',
    'features.setup.title': 'Configuration Complète',
    'features.setup.desc': 'Configuration étape par étape de tous les outils nécessaires pour opérer avec succès',
    'features.strategies.title': 'Stratégies Rentables',
    'features.strategies.desc': 'Méthodes testées et approuvées que j\'utilise quotidiennement pour générer des profits constants',
    'features.risk.title': 'Gestion des Risques',
    'features.risk.desc': 'Apprenez à protéger votre capital et ne plus jamais perdre d\'argent par émotion',
    'features.analysis.title': 'Analyse Technique',
    'features.analysis.desc': 'Maîtrisez les indicateurs les plus importants pour prendre des décisions précises',
    'features.automation.title': 'Automatisation',
    'features.automation.desc': 'Configurez des bots et des alertes pour ne jamais rater une opportunité de profit',
    'features.mindset.title': 'Mentalité Gagnante',
    'features.mindset.desc': 'Développez la mentalité nécessaire pour être un trader professionnel',
    'features.bonus.title': '🎁 BONUS EXCLUSIFS',
    'features.bonus.spreadsheet': '✅ Feuille de Contrôle des Trades',
    'features.bonus.coins': '✅ Liste de Cryptos Recommandées',
    'features.bonus.script': '✅ Script d\'Automatisation Gratuit',
    'features.bonus.group': '✅ Accès au Groupe VIP Telegram',
    
    // Testimonials Section
    'testimonials.title': 'Témoignages de Ceux Qui Gagnent Déjà',
    'testimonials.subtitle': 'Voyez les vrais résultats de personnes qui ont appliqué la méthode',
    'testimonials.results': '🏆 RÉSULTATS PROUVÉS',
    'testimonials.results.desc': 'Plus de 1 000 personnes ont déjà transformé leur vie avec notre méthode',
    
    // Pricing Section
    'pricing.title': 'Investissement Unique',
    'pricing.subtitle': 'Accès complet à la méthode qui a changé ma vie financière',
    'pricing.limited': 'OFFRE LIMITÉE',
    'pricing.installments': 'ou 12x de {amount}€ sans intérêts',
    'pricing.guarantee': '🔒 GARANTIE DE 7 JOURS',
    'pricing.guarantee.desc': '100% de votre argent remboursé si vous n\'êtes pas satisfait',
    'pricing.secure': '🔐 Paiement Sécurisé',
    'pricing.immediate': '📱 Accès Immédiat',
    'pricing.support': '🌟 Support 24h',
    'pricing.attention': '⏰ ATTENTION!',
    'pricing.attention.desc': 'Cette offre est pour une durée limitée. Le prix reviendra à 497€ bientôt!',
    'pricing.buy': 'ACHETER MAINTENANT',
    
    // Footer
    'footer.description': 'Transformer les traders débutants en professionnels rentables grâce à des méthodes testées et éprouvées.',
    'footer.links': 'Liens Utiles',
    'footer.contact': 'Contact',
    'footer.social': 'Réseaux Sociaux',
    'footer.copyright': '© 2024 Codigo R. Tous droits réservés.',
    'footer.disclaimer': 'Ce produit ne garantit pas l\'obtention de résultats. Toute référence à la performance d\'une stratégie ne doit pas être interprétée comme une garantie de résultats.',
    
    // Loading and Common
    'loading': 'Chargement...',
    'save': 'Enregistrer',
    'cancel': 'Annuler',
    'edit': 'Modifier',
    'delete': 'Supprimer',
    'close': 'Fermer',
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Try to get saved language from localStorage
    const savedLanguage = localStorage.getItem('codigoR_language');
    if (savedLanguage && translations[savedLanguage]) {
      return savedLanguage;
    }
    
    // Detect browser language
    const browserLang = navigator.language.slice(0, 2);
    return translations[browserLang] ? browserLang : 'pt';
  });

  const languages = {
    pt: { name: 'Português', flag: '🇧🇷' },
    en: { name: 'English', flag: '🇺🇸' },
    es: { name: 'Español', flag: '🇪🇸' },
    it: { name: 'Italiano', flag: '🇮🇹' },
    fr: { name: 'Français', flag: '🇫🇷' }
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setCurrentLanguage(lang);
      localStorage.setItem('codigoR_language', lang);
    }
  };

  const t = (key, params = {}) => {
    let text = translations[currentLanguage]?.[key] || translations['pt'][key] || key;
    
    // Replace parameters in text
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
  };

  const value = {
    currentLanguage,
    languages,
    changeLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};