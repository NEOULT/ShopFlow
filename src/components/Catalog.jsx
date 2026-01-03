import React, { useState, useEffect } from 'react'
import './Catalog.css'
import ProductCard from './ProductCard'
import productsData from '../data/products.json'

const Catalog = ({ onNavigateToAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name-asc')
  const [products, setProducts] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('Todas')

  useEffect(() => {
    setProducts(productsData)
  }, [])

  // Obtener todas las categorías únicas
  const allCategories = React.useMemo(() => {
    const cats = productsData.map(p => p.category).filter(Boolean)
    return ['Todas', ...Array.from(new Set(cats))]
  }, [productsData])

  return (
    <div className="catalog">
      <header className="catalog-header">
        <div className="catalog-nav">
          <div className="catalog-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="4" y="4" width="24" height="24" rx="4" fill="#ff4757"/>
              <rect x="8" y="8" width="16" height="16" rx="2" fill="white"/>
              <circle cx="16" cy="16" r="4" fill="#ff4757"/>
            </svg>
            <span className="brand-name">SHOPFLOW</span>
          </div>
          
          <nav className="nav-links">
            <a href="#" className="nav-link active">Inicio</a>
            <a href="#" className="nav-link">Quiénes somos</a>
            <button className="nav-link admin-link" onClick={onNavigateToAdmin}>
              Panel Admin
            </button>
            <button className="share-btn">
              Compartir
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16,6 12,2 8,6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <main className="catalog-main">
        <div className="catalog-hero">
          <h1 className="catalog-title">CATÁLOGO DIGITAL</h1>
          <p className="catalog-subtitle">Gestión de productos y ventas</p>
        </div>

        <div className="catalog-controls">
          <div className="search-container">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre o código de barras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="sort-container">
            <svg className="sort-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M7 12h10m-7 6h4"/>
            </svg>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name-asc">Nombre del producto: A-Z</option>
              <option value="name-desc">Nombre del producto: Z-A</option>
              <option value="price-asc">Precio: Menor a mayor</option>
              <option value="price-desc">Precio: Mayor a menor</option>
            </select>
          </div>

          <div className="category-filter-container">
            <svg className="category-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M6 10h12M8 14h8M10 18h4"/>
            </svg>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="category-filter-select"
            >
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>


        {/* Agrupar productos por categoría y renderizar un carrusel por cada una */}
        {(() => {
          // Filtrar y ordenar productos según búsqueda, orden y filtro de categoría
          let filtered = products.filter(product =>
            (categoryFilter === 'Todas' || product.category === categoryFilter) &&
            (
              product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
            )
          );
          switch (sortBy) {
            case 'name-asc':
              filtered.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case 'name-desc':
              filtered.sort((a, b) => b.name.localeCompare(a.name));
              break;
            case 'price-asc':
              filtered.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              filtered.sort((a, b) => b.price - a.price);
              break;
            default:
              break;
          }
          // Agrupar por categoría
          const categories = {};
          filtered.forEach(product => {
            if (!categories[product.category]) categories[product.category] = [];
            categories[product.category].push(product);
          });
          // Renderizar cada categoría con su carrusel
          return Object.entries(categories).map(([category, prods]) => (
            <div key={category} className="category-section">
              <h2 className="category-title">{category}</h2>
              <div className="products-carousel">
                {prods.map(product => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    image={product.image}
                    badge={product.badge}
                    badgeType={product.badgeType}
                  />
                ))}
              </div>
            </div>
          ));
        })()}

        <div className="load-more-container">
          <button className="load-more-btn">Cargar más productos</button>
        </div>
      </main>

      <footer className="catalog-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>MÉTODOS DE PAGO</h4>
            <div className="payment-methods">
              <div className="payment-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                <span>Transferencia bancaria</span>
              </div>
              <div className="payment-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                <span>Efectivo</span>
              </div>
              <div className="payment-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                <span>Tarjetas de crédito y débito</span>
              </div>
              <div className="payment-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
                <span>Enlace de pago</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4>MÉTODO DE ENVÍO</h4>
            <div className="shipping-info">
              <p><strong>Por acordar</strong></p>
              <p>Coordinaremos la entrega tras la compra.</p>
            </div>
          </div>

          <div className="footer-section">
            <h4>CONTACTO</h4>
            <div className="contact-info">
              <div className="contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>juan.3090209@uru.edu</span>
              </div>
              <div className="contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>+34 123456</span>
              </div>
              <button className="whatsapp-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.108"/>
                </svg>
                Contactar por WhatsApp
              </button>
            </div>
          </div>

          <div className="footer-section">
            <h4>SEGURIDAD</h4>
            <div className="security-info">
              <div className="security-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>SSL 256 bits Encription</span>
              </div>
              <div className="security-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                <span>Google Safe Browsing</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>©2025. <strong>shopflow</strong>. Todos los derechos reservados.</p>
          <p>Catálogo digital generado automáticamente.</p>
        </div>
      </footer>
    </div>
  )
}

export default Catalog
