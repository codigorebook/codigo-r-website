import React from 'react';
import axios from 'axios';

const PricingSection = ({ products }) => {
  const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

  const handleBuyClick = async (buttonInfo) => {
    try {
      await axios.post(`${API_URL}/analytics/button-click`);
      window.open(buttonInfo.url, '_blank');
    } catch (error) {
      console.error('Error tracking button click:', error);
      window.open(buttonInfo.url, '_blank');
    }
  };

  const defaultProduct = {
    name: 'Codigo R - Trading Setup Completo',
    description: 'O método completo para dominar o trading de criptomoedas',
    price: 197,
    original_price: 497,
    buy_buttons: [
      {
        platform: 'Hotmart',
        url: 'https://hotmart.com/seu-produto',
        color: 'bg-orange-500 hover:bg-orange-600'
      },
      {
        platform: 'Monetizze',
        url: 'https://monetizze.com.br/seu-produto',
        color: 'bg-blue-500 hover:bg-blue-600'
      }
    ]
  };

  const product = products.length > 0 ? products[0] : defaultProduct;

  return (
    <section id="pricing" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Investimento Único
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Acesso completo ao método que mudou minha vida financeira
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border-2 border-yellow-400 relative overflow-hidden">
            {/* Selo de Oferta */}
            <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-2 rounded-bl-lg font-bold">
              OFERTA LIMITADA
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
              <p className="text-gray-400 mb-6">{product.description}</p>
              
              <div className="flex items-center justify-center space-x-4 mb-6">
                {product.original_price && (
                  <span className="text-2xl text-gray-500 line-through">
                    R$ {product.original_price}
                  </span>
                )}
                <span className="text-4xl font-bold text-yellow-400">
                  R$ {product.price}
                </span>
              </div>
              
              <div className="text-gray-400 text-sm mb-8">
                ou 12x de R$ {(product.price / 12).toFixed(2)} sem juros
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <span className="text-green-400">✅</span>
                <span className="text-gray-300">Ebook Completo (150+ páginas)</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-400">✅</span>
                <span className="text-gray-300">Vídeo Aulas Explicativas</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-400">✅</span>
                <span className="text-gray-300">Planilhas e Ferramentas</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-400">✅</span>
                <span className="text-gray-300">Grupo VIP no Telegram</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-400">✅</span>
                <span className="text-gray-300">Suporte Direto Comigo</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-400">✅</span>
                <span className="text-gray-300">Atualizações Vitalícias</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {product.buy_buttons.map((button, index) => (
                <button
                  key={index}
                  onClick={() => handleBuyClick(button)}
                  className={`w-full ${button.color} text-white font-bold py-4 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg`}
                >
                  COMPRAR AGORA - {button.platform}
                </button>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <div className="bg-green-600 text-white rounded-lg p-4 mb-4">
                <span className="font-bold">🔒 GARANTIA DE 7 DIAS</span>
                <p className="text-sm mt-1">100% do seu dinheiro de volta se não ficar satisfeito</p>
              </div>
              
              <div className="flex justify-center space-x-4 text-sm text-gray-400">
                <span>🔐 Pagamento Seguro</span>
                <span>📱 Acesso Imediato</span>
                <span>🌟 Suporte 24h</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-red-600 text-white rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-2">⏰ ATENÇÃO!</h3>
            <p className="text-lg">
              Esta oferta é por tempo limitado. O preço voltará para R$ 497 em breve!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;