import React, { useState } from 'react';
import './ProductModal.css';

export default function ProductModal({ open, onClose, onSubmit, categories = [], labels = [] }) {
  const [form, setForm] = useState({
    product_na: '',
    product_de: '',
    product_pr: '',
    product_di: 0,
    product_st: '',
    product_label: '',
    product_im: '',
    product_th: [],
    product_ca: '',
    product_de_obj: ''
  });

  if (!open) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleArrayChange = e => {
    setForm(f => ({ ...f, product_th: e.target.value.split(',').map(s => s.trim()) }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const payload = {
      ...form,
      product_pr: Number(form.product_pr),
      product_di: Number(form.product_di),
      product_st: Number(form.product_st),
      product_de_obj: form.product_de_obj ? JSON.parse(form.product_de_obj) : {},
    };
    onSubmit(payload);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Crear producto</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <label>
            Nombre
            <input name="product_na" value={form.product_na} onChange={handleChange} required />
          </label>
          <label>
            Descripción
            <textarea name="product_de" value={form.product_de} onChange={handleChange} required />
          </label>
          <label>
            Precio
            <input name="product_pr" type="number" min="0" value={form.product_pr} onChange={handleChange} required />
          </label>
          <label>
            Descuento (%)
            <input name="product_di" type="number" min="0" max="100" value={form.product_di} onChange={handleChange} required />
          </label>
          <label>
            Existencias
            <input name="product_st" type="number" min="0" value={form.product_st} onChange={handleChange} required />
          </label>
          <label>
            Categoría
            <select name="product_ca" value={form.product_ca} onChange={handleChange} required>
              <option value="">Selecciona una categoría</option>
              {categories.map(cat => (
                <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</option>
              ))}
            </select>
          </label>
          <label>
            Etiqueta
            <select name="product_label" value={form.product_label} onChange={handleChange} required>
              <option value="">Selecciona una etiqueta</option>
              {labels.map(lab => (
                <option key={lab.id || lab._id} value={lab.id || lab._id}>{lab.text}</option>
              ))}
            </select>
          </label>
          <label>
            Imagen principal (URL)
            <input name="product_im" value={form.product_im} onChange={handleChange} required />
          </label>
          <label>
            Imágenes adicionales (URLs separadas por coma)
            <input name="product_th" value={form.product_th.join(', ')} onChange={handleArrayChange} />
          </label>
          <label>
            Detalles técnicos (JSON opcional)
            <textarea name="product_de_obj" value={form.product_de_obj} onChange={handleChange} placeholder="{ &quot;color&quot;: &quot;rojo&quot; }" />
          </label>
          <button type="submit" className="btn-primary">Guardar</button>
        </form>
      </div>
    </div>
  );
}
