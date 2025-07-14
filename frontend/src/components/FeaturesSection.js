import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      icon: '📈',
      title: 'Setup Completo',
      description: 'Configuração passo a passo de todas as ferramentas necessárias para operar com sucesso'
    },
    {
      icon: '💰',
      title: 'Estratégias Rentáveis',
      description: 'Métodos testados e aprovados que uso diariamente para gerar lucros consistentes'
    },
    {
      icon: '🎯',
      title: 'Gestão de Risco',
      description: 'Aprenda a proteger seu capital e nunca mais perder dinheiro por emocional'
    },
    {
      icon: '📊',
      title: 'Análise Técnica',
      description: 'Domine os indicadores mais importantes para tomar decisões certeiras'
    },
    {
      icon: '🤖',
      title: 'Automação',
      description: 'Configure bots e alertas para nunca perder uma oportunidade de lucro'
    },
    {
      icon: '🏆',
      title: 'Mindset Vencedor',
      description: 'Desenvolva a mentalidade necessária para ser um trader profissional'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            O Que Você Vai Aprender
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Tudo o que você precisa para se tornar um trader profissional e lucrativo
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
              🎁 BÔNUS EXCLUSIVOS
            </h3>
            <div className="space-y-2 text-gray-900">
              <p>✅ Planilha de Controle de Trades</p>
              <p>✅ Lista de Moedas Recomendadas</p>
              <p>✅ Script de Automação Gratuito</p>
              <p>✅ Acesso ao Grupo VIP no Telegram</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;