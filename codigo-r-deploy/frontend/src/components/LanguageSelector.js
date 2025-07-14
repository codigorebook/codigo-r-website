import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = () => {
  const { currentLanguage, languages, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors border border-gray-600"
      >
        <span className="text-lg">{languages[currentLanguage].flag}</span>
        <span className="hidden md:block">{languages[currentLanguage].name}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-600 z-20">
            <div className="py-2">
              {Object.entries(languages).map(([lang, info]) => (
                <button
                  key={lang}
                  onClick={() => {
                    changeLanguage(lang);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors flex items-center space-x-3 ${
                    currentLanguage === lang ? 'bg-gray-700 text-yellow-400' : 'text-white'
                  }`}
                >
                  <span className="text-lg">{info.flag}</span>
                  <span>{info.name}</span>
                  {currentLanguage === lang && (
                    <span className="ml-auto text-yellow-400">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;