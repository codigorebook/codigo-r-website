import React, { useState } from 'react';
import axios from 'axios';

const VSLSection = ({ config }) => {
  const [videoPlaying, setVideoPlaying] = useState(false);

  const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

  const handleVideoPlay = async () => {
    setVideoPlaying(true);
    try {
      await axios.post(`${API_URL}/analytics/video-view`);
    } catch (error) {
      console.error('Error tracking video view:', error);
    }
  };

  return (
    <section id="vsl" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {config?.vsl_title || 'Assista ao Vídeo e Descubra Como Ganhar Consistentemente'}
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Veja como eu transformei apenas R$ 1.000 em mais de R$ 100.000 em apenas 6 meses 
            usando essa estratégia simples e eficaz.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
            {config?.video_url ? (
              <div className="aspect-video">
                <iframe
                  src={config.video_url}
                  title="Video Sales Letter"
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  onLoad={handleVideoPlay}
                />
              </div>
            ) : (
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-yellow-500 transition-colors">
                    <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Vídeo Exclusivo</h3>
                  <p className="text-gray-400">Clique para assistir a estratégia completa</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm mb-4">
              ⚠️ Este vídeo contém informações confidenciais do meu método de trading
            </p>
            <div className="flex justify-center space-x-4">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">🔴 AO VIVO</span>
              <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm">⚡ LIMITADO</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VSLSection;