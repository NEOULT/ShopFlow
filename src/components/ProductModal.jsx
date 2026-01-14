import React, { useState, useEffect } from 'react';
import './ProductModal.css';


export default function ProductModal({ open, onClose, onSubmit, categories = [], labels = [], initialData }) {
  const getInitialForm = (data) => {
    const getId = (val) => {
      if (!val) return '';
      if (typeof val === 'string') return val;
      if (val._id) return val._id;
      if (val.id) return val.id;
      return '';
    };
    if (data) {
      return {
        product_na: data.product_na || '',
        product_de: data.product_de || '',
        product_pr: data.product_pr || '',
        product_di: data.product_di || 0,
        product_st: data.product_st || '',
        product_label: getId(data.product_label),
        product_im: data.product_im || '',
        product_th: Array.isArray(data.product_th) ? data.product_th : (data.product_th ? [data.product_th] : ['']),
        product_ca: getId(data.product_ca),
        product_de_obj: data.product_de_obj && typeof data.product_de_obj === 'object'
          ? Object.entries(data.product_de_obj).map(([key, value]) => ({ key, value }))
          : [{ key: '', value: '' }],
      };
    }
    return {
      product_na: '',
      product_de: '',
      product_pr: '',
      product_di: 0,
      product_st: '',
      product_label: '',
      product_im: '',
      product_th: [''],
      product_ca: '',
      product_de_obj: [{ key: '', value: '' }],
    };
  };

  const [form, setForm] = useState(getInitialForm(initialData));

  useEffect(() => {
    setForm(getInitialForm(initialData));
  }, [initialData, open]);

  if (!open) return null;


  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Imagenes adicionales
  const handleImageChange = (idx, value) => {
    setForm(f => {
      const arr = [...f.product_th];
      arr[idx] = value;
      return { ...f, product_th: arr };
    });
  };
  const addImageInput = () => setForm(f => ({ ...f, product_th: [...f.product_th, ''] }));
  const removeImageInput = idx => setForm(f => ({ ...f, product_th: f.product_th.filter((_, i) => i !== idx) }));

  // Detalles técnicos
  const handleDetailChange = (idx, field, value) => {
    setForm(f => {
      const arr = [...f.product_de_obj];
      arr[idx][field] = value;
      return { ...f, product_de_obj: arr };
    });
  };
  const addDetailInput = () => setForm(f => ({ ...f, product_de_obj: [...f.product_de_obj, { key: '', value: '' }] }));
  const removeDetailInput = idx => setForm(f => ({ ...f, product_de_obj: f.product_de_obj.filter((_, i) => i !== idx) }));


  const handleSubmit = e => {
    e.preventDefault();
    // Convert details to object
    const detailsObj = {};
    form.product_de_obj.forEach(({ key, value }) => {
      if (key) detailsObj[key] = value;
    });
    const payload = {
      ...form,
      product_pr: Number(form.product_pr),
      product_di: Number(form.product_di),
      product_st: Number(form.product_st),
      product_de_obj: detailsObj,
      product_th: form.product_th.filter(url => url.trim() !== ''),
      product_label: form.product_label,
      product_ca: form.product_ca,
    };
    onSubmit(payload);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>{initialData ? 'Editar producto' : 'Crear producto'}</h2>
        <form onSubmit={handleSubmit} className="product-form product-form-grid">
          <div className="product-form-col product-form-main">
            <label>
              Nombre
              <input name="product_na" value={form.product_na} onChange={handleChange} required />
            </label>
            <label>
              Precio
              <input
                name="product_pr"
                type="text"
                inputMode="decimal"
                pattern="^[0-9]+(\\.[0-9]{0,2})?$"
                value={form.product_pr}
                onChange={e => {
                  // Solo permitir números y punto
                  const val = e.target.value.replace(/[^0-9.]/g, '');
                  setForm(f => ({ ...f, product_pr: val }));
                }}
                required
                autoComplete="off"
              />
            </label>
            <label>
              Descuento (%)
              <input
                name="product_di"
                type="text"
                inputMode="numeric"
                pattern="^(100|[1-9]?\d)$"
                value={form.product_di}
                onChange={e => {
                  // Solo permitir números entre 0 y 100
                  let val = e.target.value.replace(/[^0-9]/g, '');
                  if (val !== '' && Number(val) > 100) val = '100';
                  setForm(f => ({ ...f, product_di: val }));
                }}
                required
                autoComplete="off"
              />
            </label>
            <label>
              Existencias
              <input
                name="product_st"
                type="text"
                inputMode="numeric"
                pattern="^[0-9]*$"
                value={form.product_st}
                onChange={e => {
                  // Solo permitir números
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setForm(f => ({ ...f, product_st: val }));
                }}
                required
                autoComplete="off"
              />
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
          </div>
          <div className="product-form-col product-form-extra">
            <label>
              Imagen principal (URL)
              <input name="product_im" value={form.product_im} onChange={handleChange} required />
            </label>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 500, color: '#334155', marginBottom: 4 }}>Imágenes adicionales</div>
              {form.product_th.map((img, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <input
                    type="text"
                    placeholder={`URL de imagen #${idx + 1}`}
                    value={img}
                    onChange={e => handleImageChange(idx, e.target.value)}
                    style={{ flex: 1 }}
                  />
                  {form.product_th.length > 1 && (
                    <button type="button" onClick={() => removeImageInput(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }} title="Eliminar">×</button>
                  )}
                  {idx === form.product_th.length - 1 && (
                    <button type="button" onClick={addImageInput} style={{ color: '#3b82f6', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }} title="Agregar">+</button>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 500, color: '#334155', marginBottom: 4 }}>Detalles técnicos</div>
              {form.product_de_obj.map((pair, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <input
                    type="text"
                    placeholder="Clave (ej: color)"
                    value={pair.key}
                    onChange={e => handleDetailChange(idx, 'key', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    placeholder="Valor (ej: rojo)"
                    value={pair.value}
                    onChange={e => handleDetailChange(idx, 'value', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  {form.product_de_obj.length > 1 && (
                    <button type="button" onClick={() => removeDetailInput(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }} title="Eliminar">×</button>
                  )}
                  {idx === form.product_de_obj.length - 1 && (
                    <button type="button" onClick={addDetailInput} style={{ color: '#3b82f6', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }} title="Agregar">+</button>
                  )}
                </div>
              ))}
            </div>
            <label>
              Descripción
              <textarea name="product_de" value={form.product_de} onChange={handleChange} required />
            </label>
          </div>
          <div className="product-form-actions">
            <button type="submit" className="btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
