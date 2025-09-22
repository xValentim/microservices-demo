import React, { useState } from 'react';
import { Product } from '../types/Product';
import { formatPrice } from '../utils/formatters';
import { useFashion } from '../hooks/useFashion';
import ImageUpload from './ImageUpload';
import LoadingSpinner from './LoadingSpinner';

interface FashionAssistantProps {
  onClose: () => void;
  product: Product;
}

const FashionAssistant: React.FC<FashionAssistantProps> = ({
  onClose,
  product
}) => {
  const [userImage, setUserImage] = useState<File | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const {
    isLoading,
    error,
    result,
    getFashionAdvice,
    reset,
  } = useFashion();

  const handleGetAdvice = async () => {
    if (!userImage) {
      alert('Por favor, envie uma foto sua usando o produto primeiro');
      return;
    }

    try {
      await getFashionAdvice({ image: userImage });
    } catch (error) {
      console.error('Fashion advice failed:', error);
    }
  };

  const handleCopyAdvice = async () => {
    if (!result?.description) return;

    try {
      await navigator.clipboard.writeText(result.description);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy advice:', err);
    }
  };

  const handleStartOver = () => {
    reset();
    setUserImage(null);
  };

  const formatAdviceText = (text: string) => {
    // Converter markdown simples para HTML
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/###\s(.*?)(\n|$)/g, '<h3>$1</h3>')
      .replace(/##\s(.*?)(\n|$)/g, '<h2>$1</h2>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="fashion-assistant-modal">
      <div className="fashion-overlay" onClick={onClose}></div>
      <div className="fashion-content">
        <div className="fashion-header">
          <h2>✨ Fashion Assistant AI</h2>
          <p>Receba dicas personalizadas de moda usando este produto</p>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="fashion-body">
          {!result ? (
            <div className="fashion-setup">
              {/* Product Info */}
              <div className="fashion-product-info">
                <h3>📦 Produto Analisado</h3>
                <div className="fashion-product-card">
                  <img src={product.picture} alt={product.name} className="fashion-product-image" />
                  <div className="fashion-product-details">
                    <h4>{product.name}</h4>
                    <p className="fashion-product-price">{formatPrice(product.price)}</p>
                    <p className="fashion-product-desc">{product.description}</p>
                  </div>
                </div>
              </div>

              {/* User Image Upload */}
              <div className="fashion-upload-section">
                <h3>📸 Sua Foto com o Produto</h3>
                <p className="fashion-upload-description">
                  Envie uma foto sua usando este produto (ou um similar) para receber dicas personalizadas de moda e combinações.
                </p>
                <ImageUpload
                  label="Enviar Sua Foto"
                  description="Foto sua usando o produto para análise de estilo"
                  onImageSelect={setUserImage}
                  maxSize={10}
                />
              </div>

              {/* Action Buttons */}
              <div className="fashion-actions">
                {isLoading ? (
                  <LoadingSpinner message="Analisando seu estilo com IA..." />
                ) : (
                  <button
                    className="btn btn-primary fashion-analyze-btn"
                    onClick={handleGetAdvice}
                    disabled={!userImage}
                  >
                    ✨ Analisar Meu Estilo
                  </button>
                )}

                {error && (
                  <div className="fashion-error">
                    <p>❌ Erro: {error}</p>
                    <button className="btn btn-secondary" onClick={reset}>
                      Tentar Novamente
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="fashion-results">
              {/* Results Header */}
              <div className="fashion-results-header">
                <h3>🎉 Sua Análise de Estilo Personalizada</h3>
                <p>Aqui estão as dicas exclusivas para você!</p>
              </div>

              {/* Fashion Advice */}
              <div className="fashion-advice-container">
                <div
                  className="fashion-advice-text"
                  dangerouslySetInnerHTML={{
                    __html: formatAdviceText(result.description)
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="fashion-results-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleCopyAdvice}
                >
                  {copySuccess ? '✅ Copiado!' : '📋 Copiar Dicas'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleStartOver}
                >
                  🔄 Nova Análise
                </button>
              </div>

              {/* Metadata */}
              <div className="fashion-metadata">
                <small>ID da Análise: {result.image_id}</small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FashionAssistant;
