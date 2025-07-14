import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import VSLSection from '../components/VSLSection';
import FeaturesSection from '../components/FeaturesSection';
import ProofsOfGainsSection from '../components/ProofsOfGainsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import PricingSection from '../components/PricingSection';
import Footer from '../components/Footer';
import LegalDisclaimer from '../components/LegalDisclaimer';

const LandingPage = () => {
  const [config, setConfig] = useState(null);
  const [products, setProducts] = useState([]);
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);

  const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Track page view
        await axios.post(`${API_URL}/analytics/page-view`);
        
        // Fetch site config
        const configResponse = await axios.get(`${API_URL}/config`);
        setConfig(configResponse.data);
        
        // Fetch products
        const productsResponse = await axios.get(`${API_URL}/products`);
        setProducts(productsResponse.data);
        
        // Fetch sections configuration
        const sectionsResponse = await axios.get(`${API_URL}/sections`);
        setSections(sectionsResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header - Always visible */}
      {sections.header !== false && <Header />}
      
      {/* Hero Section - Always visible */}
      {sections.hero !== false && <HeroSection config={config} />}
      
      {/* VSL Section - Can be hidden */}
      {sections.vsl !== false && <VSLSection config={config} />}
      
      {/* Features Section - Can be hidden */}
      {sections.features !== false && <FeaturesSection />}
      
      {/* Proofs of Gains Section - Can be hidden */}
      {sections.proofs_of_gains !== false && <ProofsOfGainsSection />}
      
      {/* Testimonials Section - Can be hidden */}
      {sections.testimonials !== false && <TestimonialsSection testimonials={config?.testimonials || []} />}
      
      {/* Pricing Section - Always visible */}
      {sections.pricing !== false && <PricingSection products={products} />}
      
      {/* Footer - Always visible */}
      {sections.footer !== false && <Footer />}
      
      {/* Legal Disclaimer - Always visible */}
      <LegalDisclaimer />
    </div>
  );
};

export default LandingPage;