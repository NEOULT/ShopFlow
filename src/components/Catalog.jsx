import React, { useState, useMemo } from 'react'
import './Catalog.css'
import ProductCard from './ProductCard'
import { useProducts } from '../hooks/useProducts'


const Catalog = ({ onNavigateToAdmin, onComprar }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name-asc')
  const [categoryFilter, setCategoryFilter] = useState('Todas')
  const { items: products, loading, error } = useProducts({ limit: 10 });


  // Obtener todas las categorías únicas
  const allCategories = useMemo(() => {
    const cats = products.map(p => p.product_ca?.name || p.category || '').filter(Boolean)
    return ['Todas', ...Array.from(new Set(cats))]
  }, [products])


  // Filtrar y ordenar productos según búsqueda, orden y filtro de categoría
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const name = product.product_na || product.name || '';
      const description = product.product_de || product.description || '';
      const category = product.product_ca?.name || product.category || '';
      return (
        (categoryFilter === 'Todas' || category === categoryFilter) &&
        (
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (description && description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    });
    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => (a.product_na || a.name || '').localeCompare(b.product_na || b.name || ''));
        break;
      case 'name-desc':
        filtered.sort((a, b) => (b.product_na || b.name || '').localeCompare(a.product_na || a.name || ''));
        break;
      case 'price-asc':
        filtered.sort((a, b) => (a.product_pr || a.price || 0) - (b.product_pr || b.price || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.product_pr || b.price || 0) - (a.product_pr || a.price || 0));
        break;
      default:
        break;
    }
    return filtered;
  }, [products, searchTerm, sortBy, categoryFilter]);

  return (
    <div className="catalog">
      <header className="catalog-header">
        <div className="catalog-nav">
          <div className="catalog-logo" style={{cursor: 'pointer'}} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="4" y="4" width="24" height="24" rx="4" fill="#ff4757"/>
              <rect x="8" y="8" width="16" height="16" rx="2" fill="white"/>
              <circle cx="16" cy="16" r="4" fill="#ff4757"/>
            </svg>
            <span className="brand-name">SHOPFLOW</span>
          </div>
          
          <nav className="nav-links">
            <button className="nav-link admin-link" onClick={onNavigateToAdmin}>
              Panel Admin
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
              placeholder="Buscar por nombre"
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



        {/* Renderizado vertical: solo una categoría o todos los productos */}

        <div className="products-vertical-list">
          {loading && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Cargando productos...</div>
          )}
          {error && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>Error al cargar productos.</div>
          )}
          {!loading && !error && filteredProducts.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No hay productos para mostrar.
            </div>
          )}
          {filteredProducts.map(product => (
            console.log(product._id),
            
            <ProductCard
              id={product._id || product.id}
              name={product.product_na || product.name}
              description={product.product_de || product.description}
              price={product.product_pr || product.price}
              originalPrice={product.product_or || product.originalPrice}
              discount={typeof product.product_di !== 'undefined' ? product.product_di : product.discount}
              image={product.product_im || product.image}
              label={product.product_label}
              onComprar={onComprar}
            />
          ))}
        </div>

        <div className="load-more-container">
          <button className="load-more-btn">Cargar más productos</button>
        </div>
      </main>

      <footer className="catalog-footer">
        <div className="footer-bottom">
          <p>©2025. <strong>shopflow</strong>. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default Catalog
