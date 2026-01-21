import React, { useState } from 'react';
import { useLabels } from '../hooks/useLabels';
import { useCategories } from '../hooks/useCategories';
import './ProductFilterModal.css';

const defaultFilters = {
  label: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  inStock: false,
  inDiscount: false,
  outOfStock: false,
  minStock: '',
  page: 1,
  limit: 20,
};

export default function ProductFilterModal({ open, onClose, onApply, initialFilters = {} }) {
  const [filters, setFilters] = useState({ ...defaultFilters, ...initialFilters });
  const { items: labels, loading: loadingLabels } = useLabels();
  const { items: categories, loading: loadingCategories } = useCategories();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFilters(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters({ ...defaultFilters });
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button onClick={onClose} style={{position:'absolute',top:16,right:20,background:'none',border:'none',fontSize:'1.5rem',color:'#64748b',cursor:'pointer',zIndex:2}} title="Cerrar">&times;</button>
        <h2 style={{marginRight:'2rem'}}>Filtrar Productos</h2>
        <form onSubmit={handleSubmit} className="filter-form">
          <label>
            Etiqueta:
            <select name="label" value={filters.label} onChange={handleChange} disabled={loadingLabels}>
              <option value="">Todas</option>
              {labels.map(label => (
                <option key={label.id} value={label.id}>{label.text}</option>
              ))}
            </select>
          </label>
          <label>
            Categoría:
            <select name="category" value={filters.category || ''} onChange={handleChange} disabled={loadingCategories}>
              <option value="">Todas</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </label>
          <label>
            Precio mínimo:
            <input name="minPrice" type="number" value={filters.minPrice} onChange={handleChange} />
          </label>
          <label>
            Precio máximo:
            <input name="maxPrice" type="number" value={filters.maxPrice} onChange={handleChange} />
          </label>
          <label>
            Stock mínimo:
            <input name="minStock" type="number" value={filters.minStock} onChange={handleChange} />
          </label>
          <label className="checkbox-label">
            <input name="inStock" type="checkbox" checked={filters.inStock} onChange={handleChange} /> En stock
          </label>
          <label className="checkbox-label">
            <input name="inDiscount" type="checkbox" checked={filters.inDiscount} onChange={handleChange} /> En descuento
          </label>
          <label className="checkbox-label">
            <input name="outOfStock" type="checkbox" checked={filters.outOfStock} onChange={handleChange} /> Sin stock
          </label>
          <div className="modal-actions">
            <button type="submit" className="btn-primary">Aplicar</button>
            <button type="button" className="btn-secondary" onClick={handleClear} style={{marginLeft: 'auto'}}>Limpiar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
