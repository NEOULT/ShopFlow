import React, { useState, useEffect, useMemo } from 'react'
import './Catalog.css'
import ProductCard from './ProductCard'
import productsData from '../data/products.json'
// Eliminamos virtualización horizontal para volver a flex + scroll-snap

const Catalog = ({ onNavigateToAdmin, onComprar }) => {
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

  // Filtrar y ordenar productos según búsqueda, orden y filtro de categoría
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product =>
      (categoryFilter === 'Todas' || product.category === categoryFilter) &&
      (
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    )
    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }
    return filtered
  }, [products, searchTerm, sortBy, categoryFilter])

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
          {filteredProducts.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No hay productos para mostrar.
            </div>
          )}
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              badge={product.badge}
              badgeType={product.badgeType}
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
