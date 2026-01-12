import React, { useState } from 'react';
import { useLabels } from '../hooks/useLabels';
import ProductCard from './ProductCard';
import './LabelsManager.css';
import './CategoriesManager.css';

export default function LabelsManager() {
  const { items, loading, error, create, update, remove } = useLabels();
  const [form, setForm] = useState({ text: '', bg: '#eeeeee', color: '#222222' });
  const [editing, setEditing] = useState(null);

  const previewLabel = form.text?.trim()
    ? { label_te: form.text.trim(), label_bg: form.bg, label_tc: form.color }
    : null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await update(editing, form);
      setEditing(null);
    } else {
      await create(form);
    }
    setForm({ text: '', bg: '#eeeeee', color: '#222222' });
  };

  const handleEdit = label => {
    setEditing(label.id);
    setForm({ text: label.text, bg: label.bg, color: label.color });
  };

  return (
    <section className="categories labels-manager">
      <div className="labels__editorGrid">
        <div className="labels__previewWrap">
          <div className="labels__previewTitle">Preview en targeta de producto</div>
          <div className="labels__previewCard">
            <div className="labels__previewCardInner">
              <ProductCard
                name="Producto de ejemplo"
                description="Así se verá tu etiqueta en una tarjeta de producto real."
                price={99}
                originalPrice={129}
                image="https://images.pexels.com/photos/6862450/pexels-photo-6862450.jpeg?auto=compress&cs=tinysrgb&h=350"
                label={previewLabel}
                onComprar={() => {}}
              />
            </div>
          </div>
        </div>

        <div className="labels__formWrap">
          <form className="categories__form" onSubmit={handleSubmit}>
            <div className="labels__formRow">
              <label className="categories__label">
                Texto
                <input
                  className="categories__input"
                  name="text"
                  value={form.text}
                  onChange={handleChange}
                  placeholder="Ej: Nuevo"
                  required
                />
              </label>

              <label className="categories__label">
                Fondo
                <input
                  className="categories__input labels__color"
                  name="bg"
                  value={form.bg}
                  onChange={handleChange}
                  type="color"
                  title="Color de fondo"
                />
              </label>

              <label className="categories__label">
                Texto
                <input
                  className="categories__input labels__color"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  type="color"
                  title="Color del texto"
                />
              </label>
            </div>

            <div className="categories__actions">
              <button className="categories__btn categories__btn--primary" type="submit">
                {editing ? 'Guardar cambios' : 'Crear etiqueta'}
              </button>
              {editing && (
                <button
                  className="categories__btn"
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm({ text: '', bg: '#eeeeee', color: '#222222' });
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
          {loading ? (
            <div className="categories__state">Cargando etiquetas...</div>
          ) : error ? (
            <div className="categories__state categories__state--error">Error cargando etiquetas.</div>
          ) : (
            <div className="labels__tableWrap">
              <table className="categories__table">
                <thead>
                  <tr>
                    <th>Texto</th>
                    <th className="categories__colActions">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(label => (
                    <tr key={label.id}>
                      <td>{label.text}</td>
                      <td className="categories__colActions">
                        <button
                          type="button"
                          className="categories__btn categories__btn--small"
                          onClick={() => handleEdit(label)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="categories__btn categories__btn--small categories__btn--danger"
                          onClick={() => remove(label.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}