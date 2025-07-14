import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [config, setConfig] = useState(null);
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      const [configRes, productsRes, analyticsRes] = await Promise.all([
        axios.get(`${API_URL}/config`),
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/analytics`)
      ]);

      setConfig(configRes.data);
      setProducts(productsRes.data);
      setAnalytics(analyticsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleConfigSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/config`, config);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleProductSave = async (product) => {
    setSaving(true);
    try {
      if (product.id) {
        await axios.put(`${API_URL}/products/${product.id}`, product);
      } else {
        await axios.post(`${API_URL}/products`, product);
      }
      await fetchData();
      alert('Produto salvo com sucesso!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Erro ao salvar produto');
    } finally {
      setSaving(false);
    }
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
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Visão Geral' },
              { id: 'site', label: 'Site Config' },
              { id: 'products', label: 'Produtos' },
              { id: 'analytics', label: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
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
              <h3 className="text-lg font-medium text-white mb-2">Produtos</h3>
              <p className="text-3xl font-bold text-purple-400">{products.length}</p>
            </div>
          </div>
        )}

        {/* Site Config Tab */}
        {activeTab === 'site' && config && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Configurações do Site</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título do Site
                </label>
                <input
                  type="text"
                  value={config.site_title}
                  onChange={(e) => setConfig({...config, site_title: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título Principal
                </label>
                <input
                  type="text"
                  value={config.hero_title}
                  onChange={(e) => setConfig({...config, hero_title: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={config.hero_subtitle}
                  onChange={(e) => setConfig({...config, hero_subtitle: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título da Seção VSL
                </label>
                <input
                  type="text"
                  value={config.vsl_title}
                  onChange={(e) => setConfig({...config, vsl_title: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <button
                onClick={handleConfigSave}
                disabled={saving}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Gerenciar Produtos</h2>
            <div className="space-y-6">
              {products.map((product) => (
                <div key={product.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nome do Produto
                      </label>
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => {
                          const updated = products.map(p => 
                            p.id === product.id ? {...p, name: e.target.value} : p
                          );
                          setProducts(updated);
                        }}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Preço
                      </label>
                      <input
                        type="number"
                        value={product.price}
                        onChange={(e) => {
                          const updated = products.map(p => 
                            p.id === product.id ? {...p, price: parseFloat(e.target.value)} : p
                          );
                          setProducts(updated);
                        }}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleProductSave(product)}
                    disabled={saving}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Analytics</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-3">Data</th>
                    <th className="pb-3">Visualizações</th>
                    <th className="pb-3">Vídeo Views</th>
                    <th className="pb-3">Cliques</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((item) => (
                    <tr key={item.id} className="border-b border-gray-700">
                      <td className="py-3">
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3">{item.page_views}</td>
                      <td className="py-3">{item.video_views}</td>
                      <td className="py-3">{item.button_clicks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;