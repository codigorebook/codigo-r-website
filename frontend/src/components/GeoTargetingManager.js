import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GeoTargetingManager = ({ onSave, saving }) => {
  const [config, setConfig] = useState({
    geo_targeting_enabled: true,
    geo_platform_mappings: [],
    platform_configs: [],
    default_platform: 'hotmart'
  });
  const [loading, setLoading] = useState(true);
  const [testCountry, setTestCountry] = useState('');
  const [detectedLocation, setDetectedLocation] = useState(null);

  const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

  // Configurações padrão das plataformas
  const defaultPlatforms = [
    {
      platform_name: 'hotmart',
      display_name: 'Hotmart',
      supported_countries: ['BR', 'PT', 'MX', 'AR', 'CL', 'CO', 'PE'],
      payment_methods: ['Pix', 'Cartão', 'Boleto'],
      commission_rate: 70,
      enabled: true
    },
    {
      platform_name: 'clickbank',
      display_name: 'ClickBank',
      supported_countries: ['US', 'CA', 'GB', 'AU', 'NZ', 'DE', 'FR', 'IT', 'ES'],
      payment_methods: ['PayPal', 'Credit Card'],
      commission_rate: 75,
      enabled: true
    },
    {
      platform_name: 'monetizze',
      display_name: 'Monetizze',
      supported_countries: ['BR'],
      payment_methods: ['Pix', 'Cartão', 'Boleto'],
      commission_rate: 60,
      enabled: true
    }
  ];

  // Mapeamentos padrão por país
  const defaultMappings = [
    { country_code: 'BR', country_name: 'Brasil', primary_platform: 'hotmart', backup_platforms: ['monetizze'], enabled: true },
    { country_code: 'US', country_name: 'Estados Unidos', primary_platform: 'clickbank', backup_platforms: ['hotmart'], enabled: true },
    { country_code: 'CA', country_name: 'Canadá', primary_platform: 'clickbank', backup_platforms: ['hotmart'], enabled: true },
    { country_code: 'GB', country_name: 'Reino Unido', primary_platform: 'clickbank', backup_platforms: ['hotmart'], enabled: true },
    { country_code: 'AU', country_name: 'Austrália', primary_platform: 'clickbank', backup_platforms: ['hotmart'], enabled: true },
    { country_code: 'DE', country_name: 'Alemanha', primary_platform: 'clickbank', backup_platforms: ['hotmart'], enabled: true },
    { country_code: 'FR', country_name: 'França', primary_platform: 'clickbank', backup_platforms: ['hotmart'], enabled: true },
    { country_code: 'IT', country_name: 'Itália', primary_platform: 'clickbank', backup_platforms: ['hotmart'], enabled: true },
    { country_code: 'ES', country_name: 'Espanha', primary_platform: 'clickbank', backup_platforms: ['hotmart'], enabled: true },
    { country_code: 'PT', country_name: 'Portugal', primary_platform: 'hotmart', backup_platforms: ['clickbank'], enabled: true },
    { country_code: 'MX', country_name: 'México', primary_platform: 'hotmart', backup_platforms: ['clickbank'], enabled: true },
    { country_code: 'AR', country_name: 'Argentina', primary_platform: 'hotmart', backup_platforms: ['clickbank'], enabled: true }
  ];

  useEffect(() => {
    fetchConfig();
    detectUserLocation();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await axios.get(`${API_URL}/geo-config`);
      setConfig(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching geo config:', error);
      setLoading(false);
    }
  };

  const detectUserLocation = async () => {
    try {
      const response = await axios.get(`${API_URL}/detect-country`);
      setDetectedLocation(response.data);
    } catch (error) {
      console.error('Error detecting location:', error);
    }
  };

  const handleSaveConfig = async () => {
    try {
      await axios.put(`${API_URL}/geo-config`, config);
      alert('Configuração geográfica salva com sucesso!');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Erro ao salvar configuração');
    }
  };

  const initializeDefaultSettings = () => {
    setConfig({
      ...config,
      platform_configs: defaultPlatforms,
      geo_platform_mappings: defaultMappings
    });
  };

  const testRecommendation = async () => {
    if (!testCountry) return;
    
    try {
      const response = await axios.get(`${API_URL}/recommended-platform/${testCountry}`);
      alert(`País: ${testCountry}\nPlataforma recomendada: ${response.data.platform}\nBackup: ${response.data.backup_platforms?.join(', ') || 'Nenhuma'}`);
    } catch (error) {
      alert('Erro ao testar recomendação');
    }
  };

  const addCountryMapping = () => {
    const newMapping = {
      country_code: '',
      country_name: '',
      primary_platform: 'hotmart',
      backup_platforms: [],
      enabled: true
    };
    setConfig({
      ...config,
      geo_platform_mappings: [...config.geo_platform_mappings, newMapping]
    });
  };

  const updateMapping = (index, field, value) => {
    const updatedMappings = [...config.geo_platform_mappings];
    updatedMappings[index] = { ...updatedMappings[index], [field]: value };
    setConfig({ ...config, geo_platform_mappings: updatedMappings });
  };

  const removeMapping = (index) => {
    const updatedMappings = config.geo_platform_mappings.filter((_, i) => i !== index);
    setConfig({ ...config, geo_platform_mappings: updatedMappings });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-white text-xl">Carregando configurações geográficas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🌍 Geo-Targeting Inteligente</h2>
        <p className="text-lg">Configure redirecionamento automático por país para maximizar conversões</p>
      </div>

      {/* Current Location Detection */}
      <div className="bg-gray-800 rounded-lg p-6 border border-green-500">
        <h3 className="text-xl font-bold text-green-400 mb-4">📍 Detecção Atual</h3>
        {detectedLocation ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300"><strong>País:</strong> {detectedLocation.country_name} ({detectedLocation.country_code})</p>
              <p className="text-gray-300"><strong>Região:</strong> {detectedLocation.region}</p>
              <p className="text-gray-300"><strong>Cidade:</strong> {detectedLocation.city}</p>
            </div>
            <div>
              <p className="text-gray-300"><strong>IP:</strong> {detectedLocation.ip}</p>
              <button
                onClick={detectUserLocation}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                🔄 Detectar Novamente
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Detectando localização...</p>
        )}
      </div>

      {/* Global Settings */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">⚙️ Configurações Globais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.geo_targeting_enabled}
                onChange={(e) => setConfig({ ...config, geo_targeting_enabled: e.target.checked })}
                className="mr-2"
              />
              <span className="text-white">Ativar Geo-Targeting</span>
            </label>
            <p className="text-gray-400 text-sm mt-1">
              Redireciona automaticamente para a melhor plataforma baseada no país
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Plataforma Padrão (Fallback)
            </label>
            <select
              value={config.default_platform}
              onChange={(e) => setConfig({ ...config, default_platform: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value="hotmart">Hotmart</option>
              <option value="clickbank">ClickBank</option>
              <option value="monetizze">Monetizze</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex space-x-3">
          <button
            onClick={initializeDefaultSettings}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            🚀 Configurar Padrões Recomendados
          </button>
          <button
            onClick={handleSaveConfig}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
          >
            💾 Salvar Configurações
          </button>
        </div>
      </div>

      {/* Test Tool */}
      <div className="bg-gray-800 rounded-lg p-6 border border-yellow-500">
        <h3 className="text-xl font-bold text-yellow-400 mb-4">🧪 Testar Redirecionamento</h3>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={testCountry}
            onChange={(e) => setTestCountry(e.target.value.toUpperCase())}
            placeholder="Ex: BR, US, CA"
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            maxLength="2"
          />
          <button
            onClick={testRecommendation}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Testar País
          </button>
        </div>
        <p className="text-gray-400 text-sm mt-2">
          Digite o código do país (2 letras) para ver qual plataforma será recomendada
        </p>
      </div>

      {/* Country Mappings */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">🗺️ Mapeamento por País</h3>
          <button
            onClick={addCountryMapping}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            + Adicionar País
          </button>
        </div>

        <div className="space-y-4">
          {config.geo_platform_mappings.map((mapping, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Código País</label>
                  <input
                    type="text"
                    value={mapping.country_code}
                    onChange={(e) => updateMapping(index, 'country_code', e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                    placeholder="BR"
                    maxLength="2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Nome do País</label>
                  <input
                    type="text"
                    value={mapping.country_name}
                    onChange={(e) => updateMapping(index, 'country_name', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                    placeholder="Brasil"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Plataforma Principal</label>
                  <select
                    value={mapping.primary_platform}
                    onChange={(e) => updateMapping(index, 'primary_platform', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                  >
                    <option value="hotmart">Hotmart</option>
                    <option value="clickbank">ClickBank</option>
                    <option value="monetizze">Monetizze</option>
                  </select>
                </div>
                
                <div className="flex items-end space-x-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={mapping.enabled}
                      onChange={(e) => updateMapping(index, 'enabled', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-white text-sm">Ativo</span>
                  </label>
                  <button
                    onClick={() => removeMapping(index)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {config.geo_platform_mappings.length === 0 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-white mb-2">Nenhum país configurado</h3>
            <p className="text-gray-400 mb-4">Clique em "Configurar Padrões Recomendados" para começar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeoTargetingManager;