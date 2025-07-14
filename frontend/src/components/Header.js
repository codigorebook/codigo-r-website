import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-gray-900 font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-white">Codigo R</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-300 hover:text-white transition-colors">
              {t('nav.home')}
            </a>
            <a href="#vsl" className="text-gray-300 hover:text-white transition-colors">
              {t('nav.video')}
            </a>
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              {t('nav.benefits')}
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              {t('nav.price')}
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <button className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;