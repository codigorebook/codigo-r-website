import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [siteContent, setSiteContent] = useState(null);
  const [ebooks, setEbooks] = useState([]);
  const [vslConfig, setVslConfig] = useState(null);
  const [funnelConfig, setFunnelConfig] = useState(null);
  const [sections, setSections] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    if (!user || !user.is_admin) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [siteRes, ebooksRes, vslRes, funnelRes, sectionsRes, analyticsRes] = await Promise.all([
        axios.get(`${API_URL}/site-content`),
        axios.get(`${API_URL}/ebooks`),
        axios.get(`${API_URL}/vsl-config`),
        axios.get(`${API_URL}/funnel-config`),
        axios.get(`${API_URL}/sections`),
        axios.get(`${API_URL}/analytics`)
      ]);

      setSiteContent(siteRes.data);
      setEbooks(ebooksRes.data);
      setVslConfig(vslRes.data);
      setFunnelConfig(funnelRes.data);
      setSections(sectionsRes.data);
      setAnalytics(analyticsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSave = async (endpoint, data, successMessage) => {
    setSaving(true);
    try {
      await axios.put(`${API_URL}${endpoint}`, data);
      alert(successMessage || 'Salvo com sucesso!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleSectionToggle = async (section, value) => {
    const updatedSections = { ...sections, [section]: value };
    setSections(updatedSections);
    await handleSave('/sections', updatedSections, 'Configuração de seções atualizada!');
  };

  const createNewEbook = () => {
    const newEbook = {
      id: Date.now().toString(),
      title: 'Novo Ebook',
      subtitle: 'Subtítulo do ebook',
      description: 'Descrição detalhada do ebook',
      price: 197,
      original_price: 497,
      features: ['Funcionalidade 1', 'Funcionalidade 2'],
      bonuses: ['Bônus 1', 'Bônus 2'],
      testimonials: [],
      buy_buttons: [
        { platform: 'Hotmart', url: 'https://hotmart.com/seu-produto', color: 'bg-orange-500' },
        { platform: 'Monetizze', url: 'https://monetizze.com.br/seu-produto', color: 'bg-blue-500' }
      ],
      enabled: true
    };
    setSelectedEbook(newEbook);
    setActiveTab('ebook-editor');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-gray-900 font-bold text-lg">R</span>
              </div>
              <h1 className="text-xl font-bold text-white">Codigo R Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Olá, {user?.username}</span>
              <button
                onClick={logout}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Visão Geral' },
              { id: 'site-content', label: 'Conteúdo do Site' },
              { id: 'ebook-manager', label: 'Gerenciar Ebooks' },
              { id: 'vsl-config', label: 'Configurar VSL' },
              { id: 'funnel-config', label: 'Funil de Vendas' },
              { id: 'sections', label: 'Controle de Seções' },
              { id: 'analytics', label: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-2">Visualizações</h3>
                <p className="text-3xl font-bold text-yellow-400">
                  {analytics.reduce((sum, a) => sum + a.page_views, 0)}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-2">Vídeo Views</h3>
                <p className="text-3xl font-bold text-blue-400">
                  {analytics.reduce((sum, a) => sum + a.video_views, 0)}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-2">Cliques</h3>
                <p className="text-3xl font-bold text-green-400">
                  {analytics.reduce((sum, a) => sum + a.button_clicks, 0)}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-2">Ebooks</h3>
                <p className="text-3xl font-bold text-purple-400">{ebooks.length}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">Status das Seções</h3>
                <div className="space-y-3">
                  {sections && Object.entries(sections).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-gray-300 capitalize">{key}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        value ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {value ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('ebook-manager')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Gerenciar Ebooks
                  </button>
                  <button
                    onClick={() => setActiveTab('vsl-config')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Configurar VSL
                  </button>
                  <button
                    onClick={() => setActiveTab('sections')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Controlar Seções
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Site Content Tab */}
        {activeTab === 'site-content' && siteContent && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Editar Conteúdo do Site</h2>
            <div className="space-y-8">
              
              {/* Hero Section */}
              <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">🎯 Seção Principal (Hero)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Título Principal</label>
                    <input
                      type="text"
                      value={siteContent.hero_title}
                      onChange={(e) => setSiteContent({...siteContent, hero_title: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="Ex: DOMINE O MERCADO CRIPTO"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Subtítulo</label>
                    <input
                      type="text"
                      value={siteContent.hero_subtitle}
                      onChange={(e) => setSiteContent({...siteContent, hero_subtitle: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="Ex: O Setup Completo que Transformou..."
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                  <textarea
                    value={siteContent.hero_description}
                    onChange={(e) => setSiteContent({...siteContent, hero_description: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white h-20"
                    placeholder="Descrição adicional do hero..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Botão Primário</label>
                    <input
                      type="text"
                      value={siteContent.hero_cta_primary}
                      onChange={(e) => setSiteContent({...siteContent, hero_cta_primary: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="Ex: Ver Vídeo Agora"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Botão Secundário</label>
                    <input
                      type="text"
                      value={siteContent.hero_cta_secondary}
                      onChange={(e) => setSiteContent({...siteContent, hero_cta_secondary: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="Ex: Comprar Agora"
                    />
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">📋 Seção de Benefícios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Título da Seção</label>
                    <input
                      type="text"
                      value={siteContent.features_title}
                      onChange={(e) => setSiteContent({...siteContent, features_title: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Subtítulo</label>
                    <input
                      type="text"
                      value={siteContent.features_subtitle}
                      onChange={(e) => setSiteContent({...siteContent, features_subtitle: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Lista de Benefícios</label>
                  <div className="space-y-2">
                    {siteContent.features_list?.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={feature.icon}
                          onChange={(e) => {
                            const updated = [...siteContent.features_list];
                            updated[index] = {...feature, icon: e.target.value};
                            setSiteContent({...siteContent, features_list: updated});
                          }}
                          className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                          placeholder="📈"
                        />
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => {
                            const updated = [...siteContent.features_list];
                            updated[index] = {...feature, title: e.target.value};
                            setSiteContent({...siteContent, features_list: updated});
                          }}
                          className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                          placeholder="Título"
                        />
                        <input
                          type="text"
                          value={feature.description}
                          onChange={(e) => {
                            const updated = [...siteContent.features_list];
                            updated[index] = {...feature, description: e.target.value};
                            setSiteContent({...siteContent, features_list: updated});
                          }}
                          className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                          placeholder="Descrição"
                        />
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={feature.enabled}
                            onChange={(e) => {
                              const updated = [...siteContent.features_list];
                              updated[index] = {...feature, enabled: e.target.checked};
                              setSiteContent({...siteContent, features_list: updated});
                            }}
                            className="form-checkbox"
                          />
                          <span className="ml-2 text-sm text-gray-300">Ativo</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">💰 Seção de Preços</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Título da Seção</label>
                    <input
                      type="text"
                      value={siteContent.pricing_title}
                      onChange={(e) => setSiteContent({...siteContent, pricing_title: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Subtítulo</label>
                    <input
                      type="text"
                      value={siteContent.pricing_subtitle}
                      onChange={(e) => setSiteContent({...siteContent, pricing_subtitle: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Texto da Garantia</label>
                  <input
                    type="text"
                    value={siteContent.pricing_guarantee}
                    onChange={(e) => setSiteContent({...siteContent, pricing_guarantee: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => handleSave('/site-content', siteContent, 'Conteúdo do site atualizado!')}
                  disabled={saving}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ebook Manager Tab */}
        {activeTab === 'ebook-manager' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Gerenciar Ebooks</h2>
              <button
                onClick={createNewEbook}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
              >
                + Novo Ebook
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ebooks.map((ebook) => (
                <div key={ebook.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-white">{ebook.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      ebook.enabled ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {ebook.enabled ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{ebook.subtitle}</p>
                  <p className="text-yellow-400 font-bold text-lg mb-3">R$ {ebook.price}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedEbook(ebook);
                        setActiveTab('ebook-editor');
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        // Toggle enabled status
                        const updatedEbook = {...ebook, enabled: !ebook.enabled};
                        handleSave(`/ebooks/${ebook.id}`, updatedEbook, 'Status do ebook atualizado!');
                      }}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      {ebook.enabled ? 'Desativar' : 'Ativar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Continue with other tabs... */}
        {/* This is getting long, so I'll continue in the next file */}
      </main>
    </div>
  );
};

export default AdminDashboard;