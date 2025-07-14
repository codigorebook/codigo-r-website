import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';

const ProofsOfGainsSection = () => {
  const [proofs, setProofs] = useState([]);
  const [siteContent, setSiteContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { language, translations } = useLanguage();

  const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proofsResponse, contentResponse] = await Promise.all([
          axios.get(`${API_URL}/proofs-of-gains`),
          axios.get(`${API_URL}/site-content`)
        ]);
        
        setProofs(proofsResponse.data);
        setSiteContent(contentResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching proofs of gains:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-white text-lg">Carregando provas de ganhos...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!proofs || proofs.length === 0) {
    return null;
  }

  const activeProofs = proofs.filter(proof => proof.enabled);

  if (activeProofs.length === 0) {
    return null;
  }

  return (
    <section id="proofs-of-gains" className="py-16 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {translations.proofs?.title || siteContent?.proofs_title || 'Provas de Ganhos Reais'}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {translations.proofs?.subtitle || siteContent?.proofs_subtitle || 'Resultados comprovados do método Codigo R'}
          </p>
        </div>

        {/* Proofs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeProofs.map((proof, index) => (
            <ProofCard key={proof.id || index} proof={proof} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProofCard = ({ proof }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/20">
      {/* Image Section */}
      {proof.image_base64 && !imageError && (
        <div className="relative">
          <img
            src={`data:image/jpeg;base64,${proof.image_base64}`}
            alt={proof.image_alt || proof.title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`w-full h-48 object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <div className="text-gray-400">Carregando...</div>
            </div>
          )}
          {/* Overlay com valor */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="text-yellow-400 text-2xl font-bold">
              {proof.amount}
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">
          {proof.title}
        </h3>
        <p className="text-gray-300 mb-4">
          {proof.description}
        </p>
        
        {/* Stats */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">
            {proof.date}
          </span>
          <span className="text-yellow-400 font-bold">
            {proof.amount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProofsOfGainsSection;