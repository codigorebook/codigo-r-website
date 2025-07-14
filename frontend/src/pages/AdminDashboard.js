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