import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: '📈',
      title: t('features.setup.title'),
      description: t('features.setup.desc')
    },
    {
      icon: '💰',
      title: t('features.strategies.title'),
      description: t('features.strategies.desc')
    },
    {
      icon: '🎯',
      title: t('features.risk.title'),
      description: t('features.risk.desc')
    },
    {
      icon: '📊',
      title: t('features.analysis.title'),
      description: t('features.analysis.desc')
    },
    {
      icon: '🤖',
      title: t('features.automation.title'),
      description: t('features.automation.desc')
    },
    {
      icon: '🏆',
      title: t('features.mindset.title'),
      description: t('features.mindset.desc')
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {t('features.title')}
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('features.bonus.title')}
            </h3>
            <div className="space-y-2 text-gray-900">
              <p>{t('features.bonus.spreadsheet')}</p>
              <p>{t('features.bonus.coins')}</p>
              <p>{t('features.bonus.script')}</p>
              <p>{t('features.bonus.group')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;