import React, { useMemo, useRef, useState, useCallback } from 'react'
import ProductFilterModal from './ProductFilterModal';
import ProductModal from './ProductModal'
import { useCategories } from '../hooks/useCategories'
import { useLabels } from '../hooks/useLabels'
import './ProductTable.css'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useProducts } from '../hooks/useProducts';
// Removed ProductModal and related imports

function ProductTable() {
  const { items: products, loading, error, create, update, remove, pagination, setProductFilters } = useProducts();
  const { items: categories } = useCategories();
  const { items: labels } = useLabels();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  // Filtros avanzados
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [lastFilters, setLastFilters] = useState({});
  // Search bar state
  const [searchValue, setSearchValue] = useState(lastFilters.search ?? '');

  // Aplica los filtros avanzados al backend
  const handleApplyFilters = (filters) => {
    // Siempre incluir search aunque sea vacío
    setProductFilters({
      ...filters,
      q: (filters.search ?? '').trim(),
      page: 1,
    });
    setLastFilters(filters);
    setSearchValue(filters.search ?? '');
  };

  // Debounce para el search
  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  // Actualiza el filtro search con debounce
  const updateSearch = useCallback(
    debounce((value) => {
      // Solo actualiza search y resetea página; el hook mezcla con el resto
      setProductFilters({
        q: (value ?? '').trim(),
        page: 1,
      });
    }, 400),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    updateSearch(value);
  };

  const getStockBadge = (status, stock) => {
    switch (status) {
      case 'low':
        return <span className="stock-badge stock-badge--low">{stock}</span>
      case 'medium':
        return <span className="stock-badge stock-badge--medium">{stock}</span>
      case 'good':
        return <span className="stock-badge stock-badge--good">{stock}</span>
      default:
        return <span className="stock-badge">{stock}</span>
    }
  }

  // Virtualización de filas
  const parentRef = useRef(null)
  const ROW_HEIGHT = 72
  const rowVirtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  })
  const virtualItems = rowVirtualizer.getVirtualItems()
  const paddingTop = virtualItems.length ? virtualItems[0].start : 0
  const paddingBottom = virtualItems.length
    ? rowVirtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end
    : 0

  const handleEdit = (product) => {
    setEditProduct(product);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (data) => {
    if (editProduct) {
      await update(editProduct._id || editProduct.id, data);
      setEditModalOpen(false);
      setEditProduct(null);
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm(`¿Seguro que deseas eliminar el producto "${product.product_na}"?`)) {
      await remove(product._id || product.id);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setProductFilters({ page: newPage });
    }
  };

  const handleLimitChange = (e) => {
    setProductFilters({ limit: Number(e.target.value), page: 1 });
  };

  return (
    <div className="product-table-container">
      {error && (
        <div className="table-state table-state--error">Error al cargar productos.</div>
      )}
      <div className="table-controls">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre, descripción..."
              value={searchValue}
              onChange={handleSearchChange}
              autoComplete="off"
            />
          </div>
          <div>
            <select value={pagination.limit} onChange={handleLimitChange} style={{ padding: '2px 8px', fontSize: 14 }}>
              {[5, 10, 15, 20].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="filter-controls">
          <button className="filters-btn" type="button" onClick={() => setFilterModalOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            Filtros
          </button>
        </div>
      </div>

      <ProductFilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={lastFilters}
      />

      <div className="table-wrapper" ref={parentRef} style={{ height: 480, overflow: 'auto' }}>
        {loading && !products.length && (
          <div className="table-state">Cargando productos...</div>
        )}
        <table className="product-table">
          <thead>
            <tr>
              <th>PRODUCTO</th>
              <th>CATEGORÍA</th>
              <th>PRECIO</th>
              <th>EXISTENCIAS</th>
              <th>ACTUALIZADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td colSpan={6} style={{ height: paddingTop }} />
              </tr>
            )}
            {virtualItems.map((v) => {
              const product = products[v.index];
              return (
                <tr key={product._id || product.id} style={{ height: ROW_HEIGHT }}>
                  <td>
                    <div className="product-info">
                      <div className="product-image" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '8px', flexShrink: 0, padding: 0, margin: 0 }}>
                        <img 
                          src={product.product_im} 
                          alt={product.product_na} 
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', display: 'block', padding: 0, margin: 0 }}
                        />
                      </div>
                      <div className="product-details">
                        <div className="product-name">{product.product_na}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="category-info">
                      <div className="category-main">{product.product_ca?.name || ''}</div>
                      {/* Puedes mostrar subcategoría si existe */}
                    </div>
                  </td>
                  <td className="price">COP${product.product_pr?.toFixed(2)}</td>
                  <td>{getStockBadge('good', product.product_st)}</td>
                  <td className="updated">{new Date(product.updatedAt || product.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="actions">
                      <button
                        type="button"
                        className="categories__btn categories__btn--small"
                        onClick={() => handleEdit(product)}
                        title="Editar"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="categories__btn categories__btn--small categories__btn--danger"
                        onClick={() => handleDelete(product)}
                        title="Eliminar"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {paddingBottom > 0 && (
              <tr>
                <td colSpan={6} style={{ height: paddingBottom }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '16px 0' }}>
        <button
          className="categories__btn categories__btn--small"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
        >
          Anterior
        </button>
        <span style={{ margin: '0 12px' }}>
          Página {pagination.page} de {pagination.pages}
        </span>
        <button
          className="categories__btn categories__btn--small"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.pages}
        >
          Siguiente
        </button>
      </div>

      <ProductModal
        open={editModalOpen}
        onClose={() => { setEditModalOpen(false); setEditProduct(null); }}
        onSubmit={handleEditSubmit}
        categories={categories}
        labels={labels}
        {...(editProduct ? { initialData: editProduct } : {})}
      />
    </div>
  );
}

export default ProductTable
