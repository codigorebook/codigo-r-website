import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LegalDisclaimer = () => {
  const { t } = useLanguage();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 transition-all duration-300 ${
      isMinimized ? 'transform translate-y-0' : ''
    }`}>
      <div className="bg-yellow-900/95 border border-yellow-600 rounded-lg shadow-lg backdrop-blur-sm">
        {!isMinimized ? (
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-yellow-200 font-bold text-sm">⚠️ AVISO LEGAL</h4>
              <div className="flex space-x-1">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-yellow-400 hover:text-yellow-200 transition-colors"
                  title="Minimizar"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-yellow-400 hover:text-yellow-200 transition-colors"
                  title="Fechar"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-yellow-200 text-xs leading-relaxed">
              {t('footer.investment.warning')}
            </p>
          </div>
        ) : (
          <div className="p-2">
            <button
              onClick={() => setIsMinimized(false)}
              className="flex items-center space-x-2 text-yellow-200 hover:text-yellow-100 transition-colors w-full"
            >
              <span className="text-sm">⚠️</span>
              <span className="text-xs">Aviso Legal</span>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalDisclaimer;