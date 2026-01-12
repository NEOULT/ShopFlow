import React from 'react';
import './ProductModal.css';
import { useCategories } from '../hooks/useCategories';
import { useLabels } from '../hooks/useLabels';
import { useProducts } from '../hooks/useProducts';

export default function ProductCreate() {
  const { items: categories } = useCategories();
  const { items: labels } = useLabels();
  const { create } = useProducts();
  const [form, setForm] = React.useState({
    product_na: '',
    product_de: '',
    product_pr: '',
    product_di: 0,
    product_st: '',
    product_label: '',
    product_im: '',
    product_th: [''],
    product_ca: '',
    product_de_obj: [{ key: '', value: '' }]
  });
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(null);

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

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
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
        product_th: form.product_th.filter(url => url.trim() !== '')
      };
      await create(payload);
      setForm({
        product_na: '', product_de: '', product_pr: '', product_di: 0, product_st: '', product_label: '', product_im: '', product_th: [''], product_ca: '', product_de_obj: [{ key: '', value: '' }]
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Error al crear producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="product-create-section">
      <h2>Crear producto</h2>
      <form onSubmit={handleSubmit} className="product-form product-form-grid">
        <div className="product-form-col product-form-main">
          <label>
            Nombre
            <input name="product_na" value={form.product_na} onChange={handleChange} required />
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
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
          {success && <div style={{ color: 'green', marginTop: 8 }}>Producto creado correctamente.</div>}
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </div>
      </form>
    </section>
  );
}
