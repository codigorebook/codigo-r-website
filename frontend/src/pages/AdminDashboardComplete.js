import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const AdminDashboardComplete = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [siteContent, setSiteContent] = useState(null);
  const [ebooks, setEbooks] = useState([]);
  const [vslConfig, setVslConfig] = useState(null);
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
      const [siteRes, ebooksRes, vslRes, sectionsRes, analyticsRes] = await Promise.all([
        axios.get(`${API_URL}/site-content`),
        axios.get(`${API_URL}/ebooks`),
        axios.get(`${API_URL}/vsl-config`),
        axios.get(`${API_URL}/sections`),
        axios.get(`${API_URL}/analytics`)
      ]);

      setSiteContent(siteRes.data);
      setEbooks(ebooksRes.data);
      setVslConfig(vslRes.data);
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
      fetchData(); // Refresh data
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
              <h1 className="text-xl font-bold text-white">Codigo R - Painel Administrativo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/" 
                target="_blank" 
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                👁️ Ver Site
              </a>
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
              { id: 'overview', label: '📊 Visão Geral', color: 'text-blue-400' },
              { id: 'ebook-manager', label: '📚 Gerenciar Ebooks', color: 'text-green-400' },
              { id: 'buy-buttons', label: '🛒 Botões de Compra', color: 'text-orange-400' },
              { id: 'vsl-config', label: '🎬 Configurar VSL', color: 'text-purple-400' },
              { id: 'site-content', label: '✏️ Editar Textos', color: 'text-yellow-400' },
              { id: 'sections', label: '🎛️ Controle de Seções', color: 'text-pink-400' },
              { id: 'analytics', label: '📈 Analytics', color: 'text-red-400' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-yellow-400 text-yellow-400'
                    : `border-transparent ${tab.color} hover:text-white hover:border-gray-300`
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
        
        {/* VSL Configuration Tab */}
        {activeTab === 'vsl-config' && vslConfig && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">🎬 Configurar VSL (Video Sales Letter)</h2>
              <p className="text-lg">Configure seu vídeo de vendas para aumentar as conversões</p>
            </div>

            {/* Instruções */}
            <div className="bg-gray-800 rounded-lg p-6 border border-blue-500">
              <h3 className="text-xl font-bold text-blue-400 mb-4">📋 COMO CONFIGURAR SEU VSL</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-white mb-3">🎥 YouTube</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-400">1.</span>
                      <span className="text-gray-300">Faça upload do seu vídeo no YouTube</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-400">2.</span>
                      <span className="text-gray-300">Clique em "Compartilhar" → "Incorporar"</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-400">3.</span>
                      <span className="text-gray-300">Copie apenas a URL do src=""</span>
                    </div>
                    <div className="bg-gray-700 p-2 rounded text-xs text-green-400">
                      Exemplo: https://www.youtube.com/embed/VIDEO_ID
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-white mb-3">🎬 Vimeo</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-400">1.</span>
                      <span className="text-gray-300">Faça upload do seu vídeo no Vimeo</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-400">2.</span>
                      <span className="text-gray-300">Clique no botão "Embed"</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-400">3.</span>
                      <span className="text-gray-300">Copie apenas a URL do src=""</span>
                    </div>
                    <div className="bg-gray-700 p-2 rounded text-xs text-green-400">
                      Exemplo: https://player.vimeo.com/video/VIDEO_ID
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuração do VSL */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <input
                  type="checkbox"
                  id="vsl-enabled"
                  checked={vslConfig.enabled}
                  onChange={(e) => setVslConfig({...vslConfig, enabled: e.target.checked})}
                  className="form-checkbox w-5 h-5"
                />
                <label htmlFor="vsl-enabled" className="text-xl font-bold text-white">
                  Habilitar seção VSL no site
                </label>
              </div>

              {vslConfig.enabled && (
                <div className="space-y-6">
                  {/* Títulos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        📝 Título da Seção
                      </label>
                      <input
                        type="text"
                        value={vslConfig.title}
                        onChange={(e) => setVslConfig({...vslConfig, title: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        placeholder="Ex: Assista ao Vídeo e Descubra..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        📄 Subtítulo
                      </label>
                      <input
                        type="text"
                        value={vslConfig.subtitle}
                        onChange={(e) => setVslConfig({...vslConfig, subtitle: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        placeholder="Ex: Veja como transformei..."
                      />
                    </div>
                  </div>

                  {/* URL do Vídeo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      🎥 URL do Vídeo (Embed)
                    </label>
                    <input
                      type="url"
                      value={vslConfig.video_url}
                      onChange={(e) => setVslConfig({...vslConfig, video_url: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="https://www.youtube.com/embed/VIDEO_ID"
                    />
                    <div className="mt-2 text-sm text-gray-400">
                      <p>✅ Formatos aceitos:</p>
                      <p>• YouTube: https://www.youtube.com/embed/VIDEO_ID</p>
                      <p>• Vimeo: https://player.vimeo.com/video/VIDEO_ID</p>
                    </div>
                  </div>

                  {/* Preview do Vídeo */}
                  {vslConfig.video_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        👁️ Preview do Vídeo
                      </label>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="aspect-video bg-black rounded">
                          <iframe
                            src={vslConfig.video_url}
                            title="Preview VSL"
                            className="w-full h-full rounded"
                            frameBorder="0"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Descrição */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      📖 Descrição Adicional
                    </label>
                    <textarea
                      value={vslConfig.description}
                      onChange={(e) => setVslConfig({...vslConfig, description: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white h-20"
                      placeholder="Ex: Este vídeo contém informações confidenciais..."
                    />
                  </div>
                </div>
              )}

              {/* Botão de Salvar */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => handleSave('/vsl-config', vslConfig, 'Configuração VSL salva com sucesso!')}
                  disabled={saving}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : '💾 Salvar Configuração VSL'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sections Control Tab */}
        {activeTab === 'sections' && sections && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">🎛️ Controle de Seções</h2>
              <p className="text-lg">Ative ou desative partes do seu site conforme necessário</p>
            </div>

            {/* Instruções */}
            <div className="bg-gray-800 rounded-lg p-6 border border-yellow-500">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">💡 COMO FUNCIONA</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-white mb-3">✅ Seção Ativa</h4>
                  <p className="text-gray-300 text-sm">
                    Quando uma seção está ativa, ela aparece no seu site publicamente. 
                    Visitantes podem ver e interagir com o conteúdo.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-3">❌ Seção Inativa</h4>
                  <p className="text-gray-300 text-sm">
                    Quando uma seção está inativa, ela fica oculta do site. 
                    Útil para fazer testes ou esconder temporariamente.
                  </p>
                </div>
              </div>
            </div>

            {/* Controles das Seções */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { 
                  key: 'hero', 
                  name: 'Seção Principal (Hero)', 
                  icon: '🎯', 
                  description: 'Título principal, subtítulo e botões de ação',
                  color: 'border-blue-500'
                },
                { 
                  key: 'vsl', 
                  name: 'Seção VSL', 
                  icon: '🎬', 
                  description: 'Video Sales Letter para aumentar conversões',
                  color: 'border-purple-500'
                },
                { 
                  key: 'features', 
                  name: 'Seção de Benefícios', 
                  icon: '📋', 
                  description: 'Lista de funcionalidades e benefícios do produto',
                  color: 'border-green-500'
                },
                { 
                  key: 'testimonials', 
                  name: 'Seção de Depoimentos', 
                  icon: '⭐', 
                  description: 'Depoimentos de clientes satisfeitos',
                  color: 'border-yellow-500'
                },
                { 
                  key: 'pricing', 
                  name: 'Seção de Preços', 
                  icon: '💰', 
                  description: 'Preços e botões de compra dos produtos',
                  color: 'border-orange-500'
                },
                { 
                  key: 'footer', 
                  name: 'Rodapé', 
                  icon: '📄', 
                  description: 'Informações de contato e links adicionais',
                  color: 'border-gray-500'
                }
              ].map((section) => (
                <div key={section.key} className={`bg-gray-800 rounded-lg p-6 border-2 ${section.color}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{section.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold text-white">{section.name}</h3>
                        <p className="text-sm text-gray-400">{section.description}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sections[section.key]}
                        onChange={(e) => handleSectionToggle(section.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-yellow-400"></div>
                    </label>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      sections[section.key] 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                    }`}>
                      {sections[section.key] ? '✅ Ativo' : '❌ Inativo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Status Summary */}
            <div className="bg-gray-800 rounded-lg p-6 border border-blue-500">
              <h3 className="text-xl font-bold text-blue-400 mb-4">📊 Resumo do Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {Object.values(sections).filter(Boolean).length}
                  </div>
                  <div className="text-sm text-gray-400">Seções Ativas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {Object.values(sections).filter(v => !v).length}
                  </div>
                  <div className="text-sm text-gray-400">Seções Inativas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {Object.keys(sections).length}
                  </div>
                  <div className="text-sm text-gray-400">Total de Seções</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {Math.round((Object.values(sections).filter(Boolean).length / Object.keys(sections).length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-400">Site Completo</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">📈 Analytics e Métricas</h2>
              <p className="text-lg">Acompanhe o desempenho do seu site de vendas</p>
            </div>

            {/* Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">👀 Visualizações</h3>
                    <p className="text-3xl font-bold text-blue-400">
                      {analytics.reduce((sum, a) => sum + a.page_views, 0)}
                    </p>
                    <p className="text-sm text-gray-400">Total de visitas</p>
                  </div>
                  <div className="text-4xl text-blue-400">📊</div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">🎬 Vídeo Views</h3>
                    <p className="text-3xl font-bold text-purple-400">
                      {analytics.reduce((sum, a) => sum + a.video_views, 0)}
                    </p>
                    <p className="text-sm text-gray-400">VSL assistidos</p>
                  </div>
                  <div className="text-4xl text-purple-400">📹</div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">🖱️ Cliques</h3>
                    <p className="text-3xl font-bold text-green-400">
                      {analytics.reduce((sum, a) => sum + a.button_clicks, 0)}
                    </p>
                    <p className="text-sm text-gray-400">Botões clicados</p>
                  </div>
                  <div className="text-4xl text-green-400">👆</div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">📈 Taxa de Conversão</h3>
                    <p className="text-3xl font-bold text-yellow-400">
                      {analytics.reduce((sum, a) => sum + a.page_views, 0) > 0
                        ? ((analytics.reduce((sum, a) => sum + a.button_clicks, 0) / analytics.reduce((sum, a) => sum + a.page_views, 0)) * 100).toFixed(1)
                        : 0}%
                    </p>
                    <p className="text-sm text-gray-400">Cliques/Visitas</p>
                  </div>
                  <div className="text-4xl text-yellow-400">💹</div>
                </div>
              </div>
            </div>

            {/* Tabela de Analytics */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">📋 Dados Detalhados</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="pb-3 text-white">Data</th>
                      <th className="pb-3 text-blue-400">Visualizações</th>
                      <th className="pb-3 text-purple-400">Vídeo Views</th>
                      <th className="pb-3 text-green-400">Cliques</th>
                      <th className="pb-3 text-yellow-400">Taxa Conv.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.map((item) => (
                      <tr key={item.id} className="border-b border-gray-700">
                        <td className="py-3">
                          {new Date(item.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3 text-blue-400">{item.page_views}</td>
                        <td className="py-3 text-purple-400">{item.video_views}</td>
                        <td className="py-3 text-green-400">{item.button_clicks}</td>
                        <td className="py-3 text-yellow-400">
                          {item.page_views > 0 ? ((item.button_clicks / item.page_views) * 100).toFixed(1) : 0}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardComplete;