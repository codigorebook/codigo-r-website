import React from 'react';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const EbookEditor = ({ ebook, onSave, onCancel }) => {
  const [editingEbook, setEditingEbook] = React.useState(ebook);

  const handleSave = async () => {
    try {
      if (editingEbook.id && editingEbook.id !== 'new') {
        await axios.put(`${API_URL}/ebooks/${editingEbook.id}`, editingEbook);
      } else {
        await axios.post(`${API_URL}/ebooks`, editingEbook);
      }
      onSave();
      alert('Ebook salvo com sucesso!');
    } catch (error) {
      console.error('Error saving ebook:', error);
      alert('Erro ao salvar ebook');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {editingEbook.id === 'new' ? 'Novo Ebook' : 'Editar Ebook'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕ Fechar
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="border-b border-gray-700 pb-6">
          <h3 className="text-lg font-bold text-yellow-400 mb-4">📝 Informações Básicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Título do Ebook</label>
              <input
                type="text"
                value={editingEbook.title}
                onChange={(e) => setEditingEbook({...editingEbook, title: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="Ex: Codigo R - Trading Setup Completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subtítulo</label>
              <input
                type="text"
                value={editingEbook.subtitle}
                onChange={(e) => setEditingEbook({...editingEbook, subtitle: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="Ex: O método completo para dominar o trading"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Descrição Detalhada</label>
            <textarea
              value={editingEbook.description}
              onChange={(e) => setEditingEbook({...editingEbook, description: e.target.value})}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white h-32"
              placeholder="Descrição completa do ebook, benefícios, conteúdo..."
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="border-b border-gray-700 pb-6">
          <h3 className="text-lg font-bold text-yellow-400 mb-4">💰 Preços</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Preço Atual (R$)</label>
              <input
                type="number"
                value={editingEbook.price}
                onChange={(e) => setEditingEbook({...editingEbook, price: parseFloat(e.target.value) || 0})}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="197"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Preço Original (R$)</label>
              <input
                type="number"
                value={editingEbook.original_price || ''}
                onChange={(e) => setEditingEbook({...editingEbook, original_price: parseFloat(e.target.value) || null})}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="497"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="border-b border-gray-700 pb-6">
          <h3 className="text-lg font-bold text-yellow-400 mb-4">✅ Funcionalidades/Benefícios</h3>
          <div className="space-y-2">
            {editingEbook.features?.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => {
                    const updated = [...editingEbook.features];
                    updated[index] = e.target.value;
                    setEditingEbook({...editingEbook, features: updated});
                  }}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  placeholder="Ex: Ebook Completo (150+ páginas)"
                />
                <button
                  onClick={() => {
                    const updated = editingEbook.features.filter((_, i) => i !== index);
                    setEditingEbook({...editingEbook, features: updated});
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const updated = [...(editingEbook.features || []), 'Nova funcionalidade'];
                setEditingEbook({...editingEbook, features: updated});
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              + Adicionar Funcionalidade
            </button>
          </div>
        </div>

        {/* Bonuses */}
        <div className="border-b border-gray-700 pb-6">
          <h3 className="text-lg font-bold text-yellow-400 mb-4">🎁 Bônus Exclusivos</h3>
          <div className="space-y-2">
            {editingEbook.bonuses?.map((bonus, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={bonus}
                  onChange={(e) => {
                    const updated = [...editingEbook.bonuses];
                    updated[index] = e.target.value;
                    setEditingEbook({...editingEbook, bonuses: updated});
                  }}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  placeholder="Ex: Planilha de Controle de Trades"
                />
                <button
                  onClick={() => {
                    const updated = editingEbook.bonuses.filter((_, i) => i !== index);
                    setEditingEbook({...editingEbook, bonuses: updated});
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const updated = [...(editingEbook.bonuses || []), 'Novo bônus'];
                setEditingEbook({...editingEbook, bonuses: updated});
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              + Adicionar Bônus
            </button>
          </div>
        </div>

        {/* Buy Buttons */}
        <div className="border-b border-gray-700 pb-6">
          <h3 className="text-lg font-bold text-yellow-400 mb-4">🛒 Botões de Compra</h3>
          <div className="space-y-4">
            {editingEbook.buy_buttons?.map((button, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Plataforma</label>
                    <select
                      value={button.platform}
                      onChange={(e) => {
                        const updated = [...editingEbook.buy_buttons];
                        updated[index] = {...button, platform: e.target.value};
                        setEditingEbook({...editingEbook, buy_buttons: updated});
                      }}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                    >
                      <option value="Hotmart">Hotmart</option>
                      <option value="Monetizze">Monetizze</option>
                      <option value="Eduzz">Eduzz</option>
                      <option value="Kiwify">Kiwify</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">URL do Produto</label>
                    <input
                      type="url"
                      value={button.url}
                      onChange={(e) => {
                        const updated = [...editingEbook.buy_buttons];
                        updated[index] = {...button, url: e.target.value};
                        setEditingEbook({...editingEbook, buy_buttons: updated});
                      }}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cor do Botão</label>
                    <select
                      value={button.color}
                      onChange={(e) => {
                        const updated = [...editingEbook.buy_buttons];
                        updated[index] = {...button, color: e.target.value};
                        setEditingEbook({...editingEbook, buy_buttons: updated});
                      }}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                    >
                      <option value="bg-orange-500 hover:bg-orange-600">Laranja</option>
                      <option value="bg-blue-500 hover:bg-blue-600">Azul</option>
                      <option value="bg-green-500 hover:bg-green-600">Verde</option>
                      <option value="bg-red-500 hover:bg-red-600">Vermelho</option>
                      <option value="bg-purple-500 hover:bg-purple-600">Roxo</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const updated = editingEbook.buy_buttons.filter((_, i) => i !== index);
                    setEditingEbook({...editingEbook, buy_buttons: updated});
                  }}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Remover Botão
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const updated = [...(editingEbook.buy_buttons || []), {
                  platform: 'Hotmart',
                  url: 'https://hotmart.com/seu-produto',
                  color: 'bg-orange-500 hover:bg-orange-600'
                }];
                setEditingEbook({...editingEbook, buy_buttons: updated});
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              + Adicionar Botão de Compra
            </button>
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enabled"
              checked={editingEbook.enabled}
              onChange={(e) => setEditingEbook({...editingEbook, enabled: e.target.checked})}
              className="form-checkbox"
            />
            <label htmlFor="enabled" className="text-gray-300">Ebook ativo no site</label>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold px-6 py-2 rounded transition-all"
            >
              Salvar Ebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VSLConfig = ({ vslConfig, onSave }) => {
  const [config, setConfig] = React.useState(vslConfig);

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/vsl-config`, config);
      onSave();
      alert('Configuração VSL salva com sucesso!');
    } catch (error) {
      console.error('Error saving VSL config:', error);
      alert('Erro ao salvar configuração VSL');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">🎬 Configurar VSL (Video Sales Letter)</h2>
      
      <div className="space-y-6">
        {/* Enable/Disable */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="vsl-enabled"
            checked={config.enabled}
            onChange={(e) => setConfig({...config, enabled: e.target.checked})}
            className="form-checkbox"
          />
          <label htmlFor="vsl-enabled" className="text-lg text-white">Habilitar seção VSL</label>
        </div>

        {config.enabled && (
          <>
            {/* Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Título da Seção</label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig({...config, title: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  placeholder="Ex: Assista ao Vídeo..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subtítulo</label>
                <input
                  type="text"
                  value={config.subtitle}
                  onChange={(e) => setConfig({...config, subtitle: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  placeholder="Ex: Veja como transformei..."
                />
              </div>
            </div>

            {/* Video */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">URL do Vídeo</label>
              <input
                type="url"
                value={config.video_url}
                onChange={(e) => setConfig({...config, video_url: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="https://www.youtube.com/embed/... ou https://player.vimeo.com/video/..."
              />
              <p className="text-xs text-gray-400 mt-1">
                Use URLs de embed do YouTube, Vimeo ou outros players de vídeo
              </p>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Thumbnail do Vídeo (URL)</label>
              <input
                type="url"
                value={config.video_thumbnail}
                onChange={(e) => setConfig({...config, video_thumbnail: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>

            {/* Call to Action */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Texto do Botão</label>
              <input
                type="text"
                value={config.call_to_action}
                onChange={(e) => setConfig({...config, call_to_action: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="Ex: Assista Agora"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Descrição Adicional</label>
              <textarea
                value={config.description}
                onChange={(e) => setConfig({...config, description: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white h-20"
                placeholder="Ex: Este vídeo contém informações confidenciais..."
              />
            </div>
          </>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold px-6 py-2 rounded transition-all"
          >
            Salvar Configuração VSL
          </button>
        </div>
      </div>
    </div>
  );
};

export const SectionsControl = ({ sections, onToggle }) => {
  const sectionsInfo = {
    hero: { name: 'Seção Principal (Hero)', icon: '🎯', description: 'Título principal, subtítulo e botões de ação' },
    vsl: { name: 'Seção VSL', icon: '🎬', description: 'Video Sales Letter' },
    features: { name: 'Benefícios', icon: '📋', description: 'Lista de funcionalidades e benefícios' },
    testimonials: { name: 'Depoimentos', icon: '⭐', description: 'Depoimentos de clientes satisfeitos' },
    pricing: { name: 'Preços', icon: '💰', description: 'Seção de preços e botões de compra' },
    footer: { name: 'Rodapé', icon: '📄', description: 'Informações de contato e links' }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">🎛️ Controle de Seções</h2>
      <p className="text-gray-400 mb-6">Ative ou desative seções do seu site conforme necessário</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(sectionsInfo).map(([key, info]) => (
          <div key={key} className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{info.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">{info.name}</h3>
                  <p className="text-sm text-gray-400">{info.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sections[key]}
                  onChange={(e) => onToggle(key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
              </label>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                sections[key] 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {sections[key] ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};