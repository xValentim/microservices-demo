import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import ImageDescribe from './ImageDescribe';
import SmartProductSell from './SmartProductSell';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showDescribe, setShowDescribe] = useState(false);
  const [showSmartSell, setShowSmartSell] = useState(false);

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>🛍️ Product Catalog</h1>
          </Link>
          <div className="header-actions">
            <SearchBar />
            <button
              className="smart-sell-button-header"
              onClick={() => setShowSmartSell(true)}
              title="Find perfect products with AI"
            >
              🛍️ Smart Find
            </button>
            <button
              className="describe-button-header"
              onClick={() => setShowDescribe(true)}
              title="Describe Image with AI"
            >
              🔍 AI Describe
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {children}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>
            © 2024 Product Catalog Demo |
            Powered by React + Vite + gRPC |
            <a
              href="https://github.com/GoogleCloudPlatform/microservices-demo"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source Code
            </a>
          </p>
        </div>
      </footer>

      {/* Modal de Smart Product Sell */}
      {showSmartSell && (
        <SmartProductSell onClose={() => setShowSmartSell(false)} />
      )}

      {/* Modal de Describe */}
      {showDescribe && (
        <ImageDescribe onClose={() => setShowDescribe(false)} />
      )}
    </div>
  );
};

export default Layout;
