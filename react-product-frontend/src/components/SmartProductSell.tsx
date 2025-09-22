import React, { useState } from 'react';
import { useSmartSell } from '../hooks/useSmartSell';
import ImageUpload from './ImageUpload';
import LoadingSpinner from './LoadingSpinner';

interface SmartProductSellProps {
  onClose: () => void;
}

const SmartProductSell: React.FC<SmartProductSellProps> = ({ onClose }) => {
  const [userImage, setUserImage] = useState<File | null>(null);
  const [queryText, setQueryText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const {
    isLoading,
    error,
    result,
    getRecommendation,
    reset,
    copyRecommendation,
  } = useSmartSell();

  // Sugestões de query predefinidas
  const querySuggestions = [
    "Gostaria de um óculos de sol para usar no verão",
    "Preciso de uma camisa elegante para o trabalho",
    "Quero um tênis confortável para praticar esportes",
    "Busco um acessório moderno para completar meu look",
    "Preciso de algo casual para o dia a dia",
    "Quero uma peça statement para uma ocasião especial"
  ];

  const handleGetRecommendation = async () => {
    if (!userImage) {
      alert('Por favor, envie uma foto sua primeiro');
      return;
    }

    if (!queryText.trim()) {
      alert('Por favor, descreva o que você está procurando');
      return;
    }

    try {
      await getRecommendation({
        image: userImage,
        text: queryText.trim(),
        model_name: 'gemini-1.5-pro',
        stream: false,
      });
    } catch (error) {
      console.error('Recommendation failed:', error);
    }
  };

  const handleCopyRecommendation = async () => {
    const success = await copyRecommendation();
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQueryText(suggestion);
  };

  const handleStartOver = () => {
    reset();
    setUserImage(null);
    setQueryText('');
  };

  const formatSellText = (text: string) => {
    // Converter quebras de linha em HTML
    return text
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br />')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  };

  return (
    <div className="smart-sell-modal">
      <div className="smart-sell-overlay" onClick={onClose}></div>
      <div className="smart-sell-content">
        <div className="smart-sell-header">
          <h2>🛍️ Smart Product Recommender</h2>
          <p>Envie sua foto + descrição e descubra o produto perfeito para você!</p>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="smart-sell-body">
          {!result ? (
            <div className="smart-sell-setup">
              {/* User Image Upload */}
              <div className="smart-sell-image-section">
                <h3>📸 Sua Foto</h3>
                <p className="smart-sell-image-description">
                  Envie uma foto sua para que possamos personalizar as recomendações baseadas no seu estilo.
                </p>
                <ImageUpload
                  label="Enviar Sua Foto"
                  description="Foto para análise de estilo personalizada"
                  onImageSelect={setUserImage}
                  maxSize={10}
                />
              </div>

              {/* Query Text Input */}
              <div className="smart-sell-query-section">
                <h3>💭 O que você está procurando?</h3>
                <p className="smart-sell-query-description">
                  Descreva detalhadamente o produto que você gostaria de encontrar. Seja específico sobre ocasião, estilo, cores, etc.
                </p>

                <textarea
                  className="smart-sell-query-input"
                  placeholder="Ex: Gostaria de um óculos de sol para usar no verão, algo moderno e elegante..."
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  rows={4}
                />

                {/* Quick Suggestions */}
                <div className="smart-sell-suggestions">
                  <h4>💡 Sugestões rápidas:</h4>
                  <div className="suggestion-buttons">
                    {querySuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="suggestion-btn"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="smart-sell-actions">
                {isLoading ? (
                  <LoadingSpinner message="Analisando e buscando produtos perfeitos..." />
                ) : (
                  <button
                    className="btn btn-primary smart-sell-btn"
                    onClick={handleGetRecommendation}
                    disabled={!userImage || !queryText.trim()}
                  >
                    🚀 Encontrar Produto Perfeito
                  </button>
                )}

                {error && (
                  <div className="smart-sell-error">
                    <p>❌ Erro: {error}</p>
                    <button className="btn btn-secondary" onClick={reset}>
                      Tentar Novamente
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="smart-sell-results">
              {/* Results Header */}
              <div className="smart-sell-results-header">
                <h3>🎯 Produto Recomendado Especialmente Para Você!</h3>
                <p>Baseado na sua foto e preferências, encontramos o produto perfeito:</p>
              </div>

              {/* Product Recommendation */}
              <div className="smart-sell-recommendation">
                {/* Recommended Product Image */}
                <div className="smart-sell-product-image">
                  <h4>📦 Produto Recomendado</h4>
                  <img
                    src={`data:image/jpeg;base64,${result.image_base64}`}
                    alt="Produto recomendado"
                    className="recommended-product-img"
                  />
                </div>

                {/* Sell Text */}
                <div className="smart-sell-text-container">
                  <h4>✨ Por que esse produto é perfeito para você:</h4>
                  <div
                    className="smart-sell-text"
                    dangerouslySetInnerHTML={{
                      __html: formatSellText(result.sell_text)
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="smart-sell-results-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleCopyRecommendation}
                >
                  {copySuccess ? '✅ Copiado!' : '📋 Copiar Recomendação'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleStartOver}
                >
                  🔄 Nova Busca
                </button>
              </div>

              {/* Metadata */}
              <div className="smart-sell-metadata">
                <small>ID da Recomendação: {result.image_id}</small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartProductSell;
