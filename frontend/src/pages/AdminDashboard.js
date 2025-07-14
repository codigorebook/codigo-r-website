import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
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
      id: 'new',
      title: 'Codigo R - Trading Setup Completo',
      subtitle: 'O método completo para dominar o trading de criptomoedas',
      description: 'Descubra como transformar R$ 1.000 em mais de R$ 100.000 usando estratégias testadas e comprovadas no mercado de criptomoedas.',
      price: 197,
      original_price: 497,
      features: [
        'Ebook Completo (150+ páginas)',
        'Vídeo Aulas Explicativas',
        'Planilhas e Ferramentas',
        'Grupo VIP no Telegram',
        'Suporte Direto',
        'Atualizações Vitalícias'
      ],
      bonuses: [
        'Planilha de Controle de Trades',
        'Lista de Moedas Recomendadas',
        'Script de Automação Gratuito',
        'Acesso ao Grupo VIP no Telegram'
      ],
      testimonials: [],
      buy_buttons: [
        { 
          platform: 'Hotmart', 
          url: 'https://hotmart.com/seu-produto-aqui', 
          color: 'bg-orange-500 hover:bg-orange-600',
          enabled: true
        },
        { 
          platform: 'Monetizze', 
          url: 'https://monetizze.com.br/seu-produto-aqui', 
          color: 'bg-blue-500 hover:bg-blue-600',
          enabled: true
        }
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
              <h1 className="text-xl font-bold text-white">Codigo R - Painel Administrativo</h1>
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
              { id: 'overview', label: '📊 Visão Geral', color: 'text-blue-400' },
              { id: 'ebook-manager', label: '📚 Gerenciar Ebooks', color: 'text-green-400' },
              { id: 'proofs-manager', label: '🏆 Provas de Ganhos', color: 'text-yellow-400' },
              { id: 'buy-buttons', label: '🛒 Botões de Compra', color: 'text-orange-400' },
              { id: 'vsl-config', label: '🎬 Configurar VSL', color: 'text-purple-400' },
              { id: 'site-content', label: '✏️ Editar Textos', color: 'text-yellow-400' },
              { id: 'sections', label: '🎛️ Controle de Seções', color: 'text-pink-400' },
              { id: 'languages', label: '🌍 Idiomas', color: 'text-indigo-400' },
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
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-gray-900">
              <h2 className="text-2xl font-bold mb-2">👋 Bem-vindo ao Painel Administrativo!</h2>
              <p className="text-lg">Gerencie seu site de vendas de forma simples e eficiente.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Visualizações</h3>
                    <p className="text-3xl font-bold text-blue-400">
                      {analytics.reduce((sum, a) => sum + a.page_views, 0)}
                    </p>
                  </div>
                  <div className="text-4xl text-blue-400">👀</div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Vídeo Views</h3>
                    <p className="text-3xl font-bold text-purple-400">
                      {analytics.reduce((sum, a) => sum + a.video_views, 0)}
                    </p>
                  </div>
                  <div className="text-4xl text-purple-400">📹</div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Cliques</h3>
                    <p className="text-3xl font-bold text-green-400">
                      {analytics.reduce((sum, a) => sum + a.button_clicks, 0)}
                    </p>
                  </div>
                  <div className="text-4xl text-green-400">🖱️</div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Ebooks</h3>
                    <p className="text-3xl font-bold text-yellow-400">{ebooks.length}</p>
                  </div>
                  <div className="text-4xl text-yellow-400">📚</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-green-500">
                <h3 className="text-lg font-bold text-green-400 mb-3">🚀 Começar Agora</h3>
                <p className="text-gray-300 mb-4">Configure seu primeiro ebook e comece a vender!</p>
                <button
                  onClick={createNewEbook}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Criar Primeiro Ebook
                </button>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-orange-500">
                <h3 className="text-lg font-bold text-orange-400 mb-3">💰 Configurar Vendas</h3>
                <p className="text-gray-300 mb-4">Configure os botões de compra das plataformas</p>
                <button
                  onClick={() => setActiveTab('buy-buttons')}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Configurar Botões
                </button>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500">
                <h3 className="text-lg font-bold text-purple-400 mb-3">🎬 Adicionar VSL</h3>
                <p className="text-gray-300 mb-4">Configure seu vídeo de vendas</p>
                <button
                  onClick={() => setActiveTab('vsl-config')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Configurar VSL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Proofs of Gains Manager Tab */}
        {activeTab === 'proofs-manager' && (
          <ProofsOfGainsManager 
            onSave={handleSave}
            saving={saving}
          />
        )}

        {/* Buy Buttons Configuration - NOVA ABA SUPER DIDÁTICA */}
        {activeTab === 'buy-buttons' && (
          <div className="space-y-6">
            {/* Header com instruções */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">🛒 Configuração dos Botões de Compra</h2>
              <p className="text-lg">Configure os links das plataformas de afiliação para receber suas vendas</p>
            </div>

            {/* Guia Passo a Passo */}
            <div className="bg-gray-800 rounded-lg p-6 border border-blue-500">
              <h3 className="text-xl font-bold text-blue-400 mb-4">📋 GUIA PASSO A PASSO</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-white mb-3">🟦 HOTMART</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-400">1.</span>
                      <span className="text-gray-300">Acesse hotmart.com e faça login</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-400">2.</span>
                      <span className="text-gray-300">Vá em "Meus Produtos" → "Criar Produto"</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-400">3.</span>
                      <span className="text-gray-300">Após criar, copie o link de checkout</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-400">4.</span>
                      <span className="text-gray-300">Cole o link no campo "URL do Produto" abaixo</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-white mb-3">🟦 MONETIZZE</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-400">1.</span>
                      <span className="text-gray-300">Acesse monetizze.com.br e faça login</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-400">2.</span>
                      <span className="text-gray-300">Vá em "Produtos" → "Adicionar Produto"</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-400">3.</span>
                      <span className="text-gray-300">Após criar, copie o link de checkout</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-400">4.</span>
                      <span className="text-gray-300">Cole o link no campo "URL do Produto" abaixo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuração dos Botões */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">⚙️ Configurar Botões de Compra</h3>
              
              {ebooks.length > 0 ? (
                <div className="space-y-6">
                  {ebooks.map((ebook) => (
                    <div key={ebook.id} className="border border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-white">{ebook.title}</h4>
                        <span className="text-yellow-400 font-bold">R$ {ebook.price}</span>
                      </div>
                      
                      <div className="space-y-4">
                        {ebook.buy_buttons?.map((button, index) => (
                          <BuyButtonConfig
                            key={index}
                            button={button}
                            buttonIndex={index}
                            ebook={ebook}
                            onUpdate={(updatedEbook) => {
                              handleSave(`/ebooks/${updatedEbook.id}`, updatedEbook, 'Botão de compra atualizado!');
                              fetchData(); // Refresh data
                            }}
                          />
                        ))}
                        
                        <button
                          onClick={() => {
                            const newButton = {
                              platform: 'Hotmart',
                              url: 'https://hotmart.com/seu-produto-aqui',
                              color: 'bg-orange-500 hover:bg-orange-600',
                              enabled: true
                            };
                            const updatedEbook = {
                              ...ebook,
                              buy_buttons: [...(ebook.buy_buttons || []), newButton]
                            };
                            handleSave(`/ebooks/${ebook.id}`, updatedEbook, 'Novo botão adicionado!');
                            fetchData();
                          }}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                          + Adicionar Novo Botão
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-bold text-white mb-2">Nenhum ebook criado ainda</h3>
                  <p className="text-gray-400 mb-4">Crie seu primeiro ebook para configurar os botões de compra</p>
                  <button
                    onClick={createNewEbook}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    Criar Primeiro Ebook
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sections Control Tab */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">🎛️ Controle de Seções</h2>
              <p className="text-lg">Ative ou desative seções do seu site conforme necessário</p>
            </div>

            {/* Instructions */}
            <div className="bg-gray-800 rounded-lg p-6 border border-blue-500">
              <h3 className="text-xl font-bold text-blue-400 mb-4">📋 COMO FUNCIONA</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-white mb-3">✅ Seções Ativas</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-green-400">✅</span>
                      <span className="text-gray-300">Aparecem no site para os visitantes</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-400">✅</span>
                      <span className="text-gray-300">Contam para o funil de vendas</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-400">✅</span>
                      <span className="text-gray-300">Incluídas no sistema de analytics</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-white mb-3">❌ Seções Inativas</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-red-400">❌</span>
                      <span className="text-gray-300">Ocultas completamente do site</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-red-400">❌</span>
                      <span className="text-gray-300">Não ocupam espaço na página</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-red-400">❌</span>
                      <span className="text-gray-300">Podem ser reativadas a qualquer momento</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sections Configuration */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">⚙️ Configurar Visibilidade das Seções</h3>
              
              <div className="space-y-6">
                {/* Header Section */}
                <SectionToggle
                  title="🏠 Cabeçalho (Header)"
                  description="Logo, menu de navegação e seletor de idiomas"
                  isActive={sections?.header !== false}
                  onToggle={(value) => handleSectionToggle('header', value)}
                  canDisable={false}
                  warning="⚠️ Seção obrigatória - não pode ser desativada"
                />

                {/* Hero Section */}
                <SectionToggle
                  title="🚀 Seção Hero"
                  description="Título principal, subtítulo e call-to-action inicial"
                  isActive={sections?.hero !== false}
                  onToggle={(value) => handleSectionToggle('hero', value)}
                  canDisable={false}
                  warning="⚠️ Seção obrigatória - primeira impressão do visitante"
                />

                {/* VSL Section */}
                <SectionToggle
                  title="🎬 Seção VSL (Video Sales Letter)"
                  description="Vídeo de vendas principal do funil"
                  isActive={sections?.vsl !== false}
                  onToggle={(value) => handleSectionToggle('vsl', value)}
                  canDisable={true}
                  stats="📊 Impacto: +70% nas conversões quando ativo"
                />

                {/* Features Section */}
                <SectionToggle
                  title="⭐ Seção de Benefícios"
                  description="Cards com os principais benefícios do ebook"
                  isActive={sections?.features !== false}
                  onToggle={(value) => handleSectionToggle('features', value)}
                  canDisable={true}
                  stats="📊 Impacto: +50% no tempo de permanência"
                />

                {/* Proofs of Gains Section */}
                <SectionToggle
                  title="📊 Seção de Provas de Ganhos"
                  description="Imagens e resultados comprovados do método"
                  isActive={sections?.proofs_of_gains !== false}
                  onToggle={(value) => handleSectionToggle('proofs_of_gains', value)}
                  canDisable={true}
                  stats="📊 Impacto: +80% na credibilidade e conversões"
                />

                {/* Testimonials Section */}
                <SectionToggle
                  title="💬 Seção de Depoimentos"
                  description="Depoimentos de clientes e resultados"
                  isActive={sections?.testimonials !== false}
                  onToggle={(value) => handleSectionToggle('testimonials', value)}
                  canDisable={true}
                  stats="📊 Impacto: +40% na credibilidade"
                />

                {/* Pricing Section */}
                <SectionToggle
                  title="💰 Seção de Preços"
                  description="Preços e botões de compra"
                  isActive={sections?.pricing !== false}
                  onToggle={(value) => handleSectionToggle('pricing', value)}
                  canDisable={false}
                  warning="⚠️ Seção obrigatória - necessária para vendas"
                />

                {/* FAQ Section */}
                <SectionToggle
                  title="❓ Seção de FAQ"
                  description="Perguntas frequentes e respostas"
                  isActive={sections?.faq !== false}
                  onToggle={(value) => handleSectionToggle('faq', value)}
                  canDisable={true}
                  stats="📊 Impacto: -30% nas objeções de compra"
                />

                {/* Footer Section */}
                <SectionToggle
                  title="🔻 Rodapé (Footer)"
                  description="Links legais, avisos e informações da empresa"
                  isActive={sections?.footer !== false}
                  onToggle={(value) => handleSectionToggle('footer', value)}
                  canDisable={false}
                  warning="⚠️ Seção obrigatória - avisos legais necessários"
                />
              </div>
            </div>

            {/* Live Preview */}
            <div className="bg-gray-800 rounded-lg p-6 border border-green-500">
              <h3 className="text-xl font-bold text-green-400 mb-4">👁️ PREVIEW AO VIVO</h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-300 mb-4">
                  As alterações são aplicadas imediatamente no site. Visite seu site para ver o resultado:
                </div>
                <div className="flex items-center space-x-4">
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    🔗 Visualizar Site
                  </a>
                  <span className="text-gray-400">
                    Abrir em nova aba para ver as mudanças
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">📊 Resumo das Seções</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {sections ? Object.values(sections).filter(s => s !== false).length : 8}
                  </div>
                  <div className="text-sm text-gray-400">Seções Ativas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">
                    {sections ? Object.values(sections).filter(s => s === false).length : 0}
                  </div>
                  <div className="text-sm text-gray-400">Seções Inativas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {sections ? Math.round((Object.values(sections).filter(s => s !== false).length / 8) * 100) : 100}%
                  </div>
                  <div className="text-sm text-gray-400">Site Completo</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Languages Management Tab */}
        {activeTab === 'languages' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">🌍 Gerenciamento de Idiomas</h2>
              <p className="text-lg">Configure as traduções para aumentar o alcance global</p>
            </div>

            {/* Language Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { code: 'pt', name: 'Português', flag: '🇧🇷', completion: 100 },
                { code: 'en', name: 'English', flag: '🇺🇸', completion: 100 },
                { code: 'es', name: 'Español', flag: '🇪🇸', completion: 100 },
                { code: 'it', name: 'Italiano', flag: '🇮🇹', completion: 100 },
                { code: 'fr', name: 'Français', flag: '🇫🇷', completion: 100 }
              ].map((lang) => (
                <div key={lang.code} className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-3xl mb-2">{lang.flag}</div>
                  <div className="text-white font-bold">{lang.name}</div>
                  <div className="text-sm text-gray-400 mb-2">{lang.code.toUpperCase()}</div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${lang.completion}%` }}
                    />
                  </div>
                  <div className="text-xs text-green-400 mt-1">{lang.completion}%</div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="bg-gray-800 rounded-lg p-6 border border-green-500">
              <h3 className="text-xl font-bold text-green-400 mb-4">✅ SISTEMA DE IDIOMAS ATIVO</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-white mb-3">🌟 Funcionalidades Ativas</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-green-400">✅</span>
                      <span className="text-gray-300">Sistema completo de 5 idiomas</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-400">✅</span>
                      <span className="text-gray-300">Seletor de idioma no cabeçalho</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-400">✅</span>
                      <span className="text-gray-300">Detecção automática do navegador</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-400">✅</span>
                      <span className="text-gray-300">Persistência da escolha do usuário</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-400">✅</span>
                      <span className="text-gray-300">Traduções específicas por país</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-white mb-3">🎯 Como Funciona</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-400">1.</span>
                      <span className="text-gray-300">Visitante chega no site</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-400">2.</span>
                      <span className="text-gray-300">Sistema detecta idioma do navegador</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-400">3.</span>
                      <span className="text-gray-300">Site carrega no idioma correto</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-400">4.</span>
                      <span className="text-gray-300">Usuário pode trocar via seletor</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-400">5.</span>
                      <span className="text-gray-300">Preferência é salva automaticamente</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Language Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-blue-500">
                <h4 className="text-lg font-bold text-blue-400 mb-3">🇧🇷 Português (Brasil)</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Moeda: Real (R$)</li>
                  <li>• Mercado: Brasil</li>
                  <li>• Tons: Informal e próximo</li>
                  <li>• Foco: Trading brasileiro</li>
                </ul>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-red-500">
                <h4 className="text-lg font-bold text-red-400 mb-3">🇺🇸 English (USA)</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Currency: Dollar ($)</li>
                  <li>• Market: Global/USA</li>
                  <li>• Tone: Professional</li>
                  <li>• Focus: International trading</li>
                </ul>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-yellow-500">
                <h4 className="text-lg font-bold text-yellow-400 mb-3">🇪🇸 Español</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Moneda: Dólar ($)</li>
                  <li>• Mercado: Hispanoamérica</li>
                  <li>• Tono: Motivacional</li>
                  <li>• Enfoque: Trading en español</li>
                </ul>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-green-500">
                <h4 className="text-lg font-bold text-green-400 mb-3">🇮🇹 Italiano</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Valuta: Euro (€)</li>
                  <li>• Mercato: Italia/Europa</li>
                  <li>• Tono: Elegante</li>
                  <li>• Focus: Trading europeo</li>
                </ul>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500">
                <h4 className="text-lg font-bold text-purple-400 mb-3">🇫🇷 Français</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Devise: Euro (€)</li>
                  <li>• Marché: France/Francophonie</li>
                  <li>• Ton: Sophistiqué</li>
                  <li>• Focus: Trading européen</li>
                </ul>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-500">
                <h4 className="text-lg font-bold text-gray-400 mb-3">➕ Expandir</h4>
                <p className="text-sm text-gray-400 mb-3">Idiomas futuros:</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• 🇩🇪 Alemão</li>
                  <li>• 🇯🇵 Japonês</li>
                  <li>• 🇰🇷 Coreano</li>
                  <li>• 🇷🇺 Russo</li>
                </ul>
              </div>
            </div>

            {/* Impact Metrics */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">📊 Impacto dos Múltiplos Idiomas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">+300%</div>
                  <div className="text-sm text-gray-400">Aumento do alcance global</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">5</div>
                  <div className="text-sm text-gray-400">Idiomas principais cobertos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">🌍</div>
                  <div className="text-sm text-gray-400">Presença mundial</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Componente para gerenciar provas de ganhos
const ProofsOfGainsManager = ({ onSave, saving }) => {
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    fetchProofs();
  }, []);

  const fetchProofs = async () => {
    try {
      const response = await axios.get(`${API_URL}/proofs-of-gains`);
      setProofs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching proofs:', error);
      setLoading(false);
    }
  };

  const handleAddProof = () => {
    const newProof = {
      id: 'new',
      title: 'Nova Prova de Ganhos',
      description: 'Descreva o resultado obtido',
      amount: 'R$ 0,00',
      date: new Date().toLocaleDateString('pt-BR'),
      image_base64: null,
      image_alt: '',
      enabled: true
    };
    setSelectedProof(newProof);
    setShowModal(true);
  };

  const handleEditProof = (proof) => {
    setSelectedProof(proof);
    setShowModal(true);
  };

  const handleSaveProof = async (proofData) => {
    try {
      if (proofData.id === 'new') {
        await axios.post(`${API_URL}/proofs-of-gains`, proofData);
      } else {
        await axios.put(`${API_URL}/proofs-of-gains/${proofData.id}`, proofData);
      }
      await fetchProofs();
      setShowModal(false);
      setSelectedProof(null);
    } catch (error) {
      console.error('Error saving proof:', error);
      alert('Erro ao salvar prova de ganhos');
    }
  };

  const handleDeleteProof = async (proofId) => {
    if (window.confirm('Tem certeza que deseja excluir esta prova de ganhos?')) {
      try {
        await axios.delete(`${API_URL}/proofs-of-gains/${proofId}`);
        await fetchProofs();
      } catch (error) {
        console.error('Error deleting proof:', error);
        alert('Erro ao excluir prova de ganhos');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-white text-xl">Carregando provas de ganhos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🏆 Gerenciar Provas de Ganhos</h2>
        <p className="text-lg">Adicione imagens e resultados comprovados para aumentar a credibilidade</p>
      </div>

      {/* Instructions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-blue-500">
        <h3 className="text-xl font-bold text-blue-400 mb-4">📋 GUIA PARA PROVAS DE GANHOS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-white mb-3">✅ Imagens Ideais</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">Screenshots de ganhos reais</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">Telas de broker ou exchange</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">Gráficos de performance</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">Formato JPG/PNG (máx 2MB)</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-3">🎯 Dicas Importantes</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400">💡</span>
                <span className="text-gray-300">Use títulos descritivos</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400">💡</span>
                <span className="text-gray-300">Inclua valores específicos</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400">💡</span>
                <span className="text-gray-300">Adicione datas para autenticidade</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400">💡</span>
                <span className="text-gray-300">Layout 3x2 no site (6 imagens)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Proof Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Provas de Ganhos Cadastradas</h3>
        <button
          onClick={handleAddProof}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          + Adicionar Nova Prova
        </button>
      </div>

      {/* Proofs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proofs.map((proof) => (
          <div key={proof.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
            {/* Image Preview */}
            {proof.image_base64 && (
              <div className="relative">
                <img
                  src={`data:image/jpeg;base64,${proof.image_base64}`}
                  alt={proof.image_alt || proof.title}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                  <div className="text-yellow-400 text-lg font-bold">
                    {proof.amount}
                  </div>
                </div>
              </div>
            )}
            
            {/* Content */}
            <div className="p-4">
              <h4 className="text-white font-bold mb-2">{proof.title}</h4>
              <p className="text-gray-300 text-sm mb-3">{proof.description}</p>
              
              <div className="flex justify-between items-center text-xs mb-3">
                <span className="text-gray-400">{proof.date}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  proof.enabled ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {proof.enabled ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditProof(proof)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-3 rounded transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteProof(proof.id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-3 rounded transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {proofs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-white mb-2">Nenhuma prova de ganhos cadastrada</h3>
          <p className="text-gray-400 mb-4">Adicione suas primeiras provas de ganhos para aumentar a credibilidade</p>
          <button
            onClick={handleAddProof}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Adicionar Primeira Prova
          </button>
        </div>
      )}

      {/* Modal for Add/Edit Proof */}
      {showModal && (
        <ProofModal
          proof={selectedProof}
          onSave={handleSaveProof}
          onClose={() => {
            setShowModal(false);
            setSelectedProof(null);
          }}
        />
      )}
    </div>
  );
};

// Modal para adicionar/editar provas de ganhos
const ProofModal = ({ proof, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: proof?.title || '',
    description: proof?.description || '',
    amount: proof?.amount || '',
    date: proof?.date || new Date().toLocaleDateString('pt-BR'),
    image_base64: proof?.image_base64 || null,
    image_alt: proof?.image_alt || '',
    enabled: proof?.enabled !== false
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (proof?.image_base64) {
      setImagePreview(`data:image/jpeg;base64,${proof.image_base64}`);
    }
  }, [proof]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamanho do arquivo
      if (file.size > 2 * 1024 * 1024) { // 2MB
        alert('Arquivo muito grande! Máximo 2MB.');
        return;
      }

      // Validar tipo do arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      setUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result.split(',')[1];
        setFormData(prev => ({
          ...prev,
          image_base64: base64String,
          image_alt: formData.image_alt || formData.title
        }));
        setImagePreview(event.target.result);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.amount) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    const proofData = {
      ...proof,
      ...formData,
      id: proof?.id || 'new'
    };
    
    onSave(proofData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">
            {proof?.id === 'new' ? 'Adicionar Nova Prova' : 'Editar Prova de Ganhos'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Upload de Imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              📸 Imagem da Prova *
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
              {imagePreview ? (
                <div className="text-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg mb-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, image_base64: null }));
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remover Imagem
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-gray-400 mb-2">
                    {uploading ? 'Processando...' : 'Clique para selecionar uma imagem'}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors"
                  >
                    {uploading ? 'Processando...' : 'Selecionar Imagem'}
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              📝 Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              placeholder="Ex: Lucro de R$ 15.420 em um dia"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              📄 Descrição *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              rows="3"
              placeholder="Descreva o resultado obtido..."
              required
            />
          </div>

          {/* Valor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                💰 Valor/Porcentagem *
              </label>
              <input
                type="text"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="Ex: R$ 15.420 ou +76.23%"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                📅 Data
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="Ex: 07/10/2024"
              />
            </div>
          </div>

          {/* Texto Alternativo */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              🏷️ Texto Alternativo (acessibilidade)
            </label>
            <input
              type="text"
              value={formData.image_alt}
              onChange={(e) => setFormData(prev => ({ ...prev, image_alt: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              placeholder="Descrição da imagem para leitores de tela"
            />
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-white">Ativo (visível no site)</span>
            </label>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              {proof?.id === 'new' ? 'Adicionar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente para controle de visibilidade das seções
const SectionToggle = ({ title, description, isActive, onToggle, canDisable, warning, stats }) => {
  return (
    <div className={`rounded-lg p-4 border-2 transition-all ${
      isActive ? 'bg-gray-700 border-green-500' : 'bg-gray-800 border-red-500'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="text-lg font-bold text-white">{title}</h4>
            <span className={`px-2 py-1 rounded text-xs font-bold ${
              isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}>
              {isActive ? '✅ ATIVO' : '❌ INATIVO'}
            </span>
          </div>
          <p className="text-gray-300 text-sm mb-2">{description}</p>
          {stats && (
            <p className="text-blue-400 text-xs">{stats}</p>
          )}
          {warning && (
            <p className="text-yellow-400 text-xs">{warning}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {canDisable ? (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => onToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-300">
                {isActive ? 'Ativo' : 'Inativo'}
              </span>
            </label>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-11 h-6 bg-green-600 rounded-full relative">
                <div className="absolute top-[2px] right-[2px] bg-white rounded-full h-5 w-5"></div>
              </div>
              <span className="text-sm font-medium text-gray-400">Obrigatório</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente para configurar cada botão de compra
const BuyButtonConfig = ({ button, buttonIndex, ebook, onUpdate }) => {
  const [editingButton, setEditingButton] = useState(button);
  const [isValidUrl, setIsValidUrl] = useState(true);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return url.includes('hotmart.com') || url.includes('monetizze.com') || url.includes('eduzz.com') || url.includes('kiwify.com');
    } catch {
      return false;
    }
  };

  const handleUrlChange = (url) => {
    setEditingButton({...editingButton, url});
    setIsValidUrl(validateUrl(url));
  };

  const handleSave = () => {
    if (!isValidUrl) {
      alert('Por favor, insira uma URL válida da plataforma de afiliação');
      return;
    }
    
    const updatedButtons = [...ebook.buy_buttons];
    updatedButtons[buttonIndex] = editingButton;
    const updatedEbook = {...ebook, buy_buttons: updatedButtons};
    onUpdate(updatedEbook);
  };

  const platformInfo = {
    'Hotmart': { 
      color: 'bg-orange-500 hover:bg-orange-600', 
      icon: '🟠',
      example: 'https://hotmart.com/product/seu-produto/...'
    },
    'Monetizze': { 
      color: 'bg-blue-500 hover:bg-blue-600', 
      icon: '🔵',
      example: 'https://monetizze.com.br/checkout/...'
    },
    'Eduzz': { 
      color: 'bg-purple-500 hover:bg-purple-600', 
      icon: '🟣',
      example: 'https://eduzz.com/checkout/...'
    },
    'Kiwify': { 
      color: 'bg-green-500 hover:bg-green-600', 
      icon: '🟢',
      example: 'https://kiwify.com.br/checkout/...'
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Plataforma */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            🏪 Plataforma de Afiliação
          </label>
          <select
            value={editingButton.platform}
            onChange={(e) => {
              const platform = e.target.value;
              setEditingButton({
                ...editingButton, 
                platform,
                color: platformInfo[platform]?.color || 'bg-gray-500 hover:bg-gray-600'
              });
            }}
            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
          >
            {Object.entries(platformInfo).map(([key, info]) => (
              <option key={key} value={key}>{info.icon} {key}</option>
            ))}
          </select>
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            🔗 URL do Produto (Link de Checkout)
          </label>
          <input
            type="url"
            value={editingButton.url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className={`w-full px-3 py-2 bg-gray-600 border rounded text-white ${
              isValidUrl ? 'border-gray-500' : 'border-red-500'
            }`}
            placeholder={platformInfo[editingButton.platform]?.example || 'https://...'}
          />
          {!isValidUrl && (
            <p className="text-red-400 text-xs mt-1">
              ⚠️ URL inválida. Use o link direto da plataforma de afiliação.
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            ⚡ Status
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={editingButton.enabled}
                onChange={(e) => setEditingButton({...editingButton, enabled: e.target.checked})}
                className="form-checkbox mr-2"
              />
              <span className="text-white">Ativo</span>
            </label>
            <span className={`px-2 py-1 rounded text-xs ${
              editingButton.enabled ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}>
              {editingButton.enabled ? '✅ Ativo' : '❌ Inativo'}
            </span>
          </div>
        </div>
      </div>

      {/* Preview do Botão */}
      <div className="mt-4 border-t border-gray-600 pt-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          👁️ Preview do Botão
        </label>
        <button
          disabled
          className={`${editingButton.color} text-white font-bold py-2 px-4 rounded-lg opacity-80 cursor-not-allowed`}
        >
          COMPRAR AGORA - {editingButton.platform}
        </button>
      </div>

      {/* Ações */}
      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={handleSave}
          disabled={!isValidUrl}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          💾 Salvar
        </button>
        <button
          onClick={() => {
            const updatedButtons = ebook.buy_buttons.filter((_, i) => i !== buttonIndex);
            const updatedEbook = {...ebook, buy_buttons: updatedButtons};
            onUpdate(updatedEbook);
          }}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          🗑️ Remover
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;