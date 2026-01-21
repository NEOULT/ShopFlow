import React, { useState, useMemo, useEffect, useRef } from 'react'
import './Catalog.css'
import ProductCard from './ProductCard'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'


const Catalog = ({ onNavigateToAdmin, onComprar }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name-asc')
  const [categoryFilter, setCategoryFilter] = useState('Todas')
  const [debouncedCategoryFilter, setDebouncedCategoryFilter] = useState('Todas')
  const [page, setPage] = useState(1)
  const [productList, setProductList] = useState([])
  const [allLoaded, setAllLoaded] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [debouncedMinPrice, setDebouncedMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState('')
  const [inStock, setInStock] = useState(false)
  const [inDiscount, setInDiscount] = useState(false)
    // Debounce para searchTerm, minPrice, maxPrice, categoryFilter
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm)
      }, 600)
      return () => clearTimeout(handler)
    }, [searchTerm])

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedMinPrice(minPrice)
      }, 600)
      return () => clearTimeout(handler)
    }, [minPrice])

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedMaxPrice(maxPrice)
      }, 600)
      return () => clearTimeout(handler)
    }, [maxPrice])

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedCategoryFilter(categoryFilter)
      }, 600)
      return () => clearTimeout(handler)
    }, [categoryFilter])
  const loaderRef = useRef(null)
  const { items: products, loading, error, pagination, setProductFilters } = useProducts({ limit: 20, page })
  const { items: categories, loading: loadingCats, error: catsError } = useCategories()


  // Opciones de categorías desde la BD
  const categoryOptions = useMemo(() => {
    return [{ id: 'Todas', name: 'Todas las Categorías' }, ...categories]
  }, [categories])

  const normalizeNumber = (value) => {
    if (value === '' || value === null || typeof value === 'undefined') return null
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }

  const baseFilters = useMemo(() => {
    return {
      category: debouncedCategoryFilter === 'Todas' ? null : debouncedCategoryFilter,
      minPrice: normalizeNumber(debouncedMinPrice),
      maxPrice: normalizeNumber(debouncedMaxPrice),
      inStock: inStock ? true : null,
      inDiscount: inDiscount ? true : null,
      q: debouncedSearchTerm ? debouncedSearchTerm.trim() : null,
      limit: 20,
    }
  }, [debouncedCategoryFilter, debouncedMinPrice, debouncedMaxPrice, inStock, inDiscount, debouncedSearchTerm])


  // Filtrar y ordenar productos según búsqueda, orden y filtro de categoría
  const filteredProducts = useMemo(() => {
    const term = debouncedSearchTerm.trim().toLowerCase()
    let filtered = productList.filter(product => {
      const name = product.product_na || product.name || '';
      const description = product.product_de || product.description || '';
      return (
        !term ||
        name.toLowerCase().includes(term) ||
        (description && description.toLowerCase().includes(term))
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
  }, [productList, debouncedSearchTerm, sortBy, debouncedCategoryFilter]);

  // Efecto: sincronizar lista cuando llegan productos o cambia la página
  useEffect(() => {
    if (page === 1) {
      setProductList(products || [])
      setAllLoaded(false)
    } else if (products && products.length > 0) {
      setProductList(prev => {
        const ids = new Set(prev.map(p => p._id || p.id))
        const nuevos = products.filter(p => !ids.has(p._id || p.id))
        return [...prev, ...nuevos]
      })
    }
  }, [products, page, pagination])

  // Fin de lista: decidir sólo cuando no está cargando
  useEffect(() => {
    if (loading) return
    const limit = 20
    const hasNext = typeof pagination?.pages === 'number'
      ? page < pagination.pages
      : (Array.isArray(products) ? products.length === limit : false)
    setAllLoaded(!hasNext)
  }, [loading, pagination, page, products])

  // Resetear al cambiar filtros (búsqueda / categoría / label / precio / stock / descuento)
  useEffect(() => {
    setAllLoaded(false)
    setProductList([])
    setPage(1)
    setProductFilters({ ...baseFilters, page: 1 })
  }, [baseFilters, sortBy])

  // Disparar fetch al cambiar de página
  useEffect(() => {
    setProductFilters({ ...baseFilters, page })
  }, [page, baseFilters])

  // IntersectionObserver para infinite scroll
  useEffect(() => {
    const el = loaderRef.current
    if (!el || allLoaded) return
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry.isIntersecting && !loading && !allLoaded) {
        setPage(prev => prev + 1)
      }
    }, { root: null, rootMargin: '200px', threshold: 0 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [loading, allLoaded, loaderRef])

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
            <button type='button' className="nav-link admin-link" onClick={onNavigateToAdmin}>
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


           <div className="price-stock-container">
               <input
                 type="text"
                 inputMode="numeric"
                 pattern="[0-9]*"
                 placeholder="Precio mínimo"
                 value={minPrice}
                 onChange={e => setMinPrice(e.target.value.replace(/[^0-9]/g, ''))}
                 className="price-input no-spinner"
               />
               <input
                 type="text"
                 inputMode="numeric"
                 pattern="[0-9]*"
                 placeholder="Precio máximo"
                 value={maxPrice}
                 onChange={e => setMaxPrice(e.target.value.replace(/[^0-9]/g, ''))}
                 className="price-input no-spinner"
               />
            <div className="toggles-row">
              <label className="stock-toggle" data-checked={inStock}>
                <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} />
                En stock
              </label>
              <label className="stock-toggle" data-checked={inDiscount}>
                <input type="checkbox" checked={inDiscount} onChange={e => setInDiscount(e.target.checked)} />
                En descuento
              </label>
            </div>
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
              {categoryOptions.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>



        {/* Renderizado vertical: solo una categoría o todos los productos */}

        <div className="products-vertical-list">
          {loading && productList.length === 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', gridColumn: '1 / -1' }}>
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                Cargando productos...
              </div>
            </div>
          )}
          {error && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', gridColumn: '1 / -1' }}>
              <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
                Error al cargar productos.
              </div>
            </div>
          )}
          {!loading && !error && filteredProducts.length === 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', gridColumn: '1 / -1' }}>
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                No hay productos para mostrar.
              </div>
            </div>
          )}
          {filteredProducts.map(product => (
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

        {/* Sentinel + loader inferior para infinite scroll */}
        <div ref={loaderRef} style={{ height: 1 }} />
        {loading && productList.length > 0 && !allLoaded && (
          <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>Cargando más productos…</div>
        )}
        {!loading && allLoaded && productList.length > 0 && (
          <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8' }}>No disponemos de más productos. <br></br>¯\_(ツ)_/¯</div>
        )}
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
