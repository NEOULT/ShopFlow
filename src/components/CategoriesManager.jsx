import React, { useMemo, useState } from 'react';
import { useCategories } from '../hooks/useCategories.js';
import './CategoriesManager.css';

function CategoriesManager() {
  const { items, loading, error, create, update, remove } = useCategories();

  const [mode, setMode] = useState('create'); // create | edit
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [items]);

  function resetForm() {
    setMode('create');
    setEditingId(null);
    setName('');
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      if (mode === 'edit' && editingId) {
        await update(editingId, { name: name });
      } else {
        await create({ name: name });
      }
      resetForm();
    } finally {
      setSaving(false);
    }
  }

  function startEdit(category) {
    setMode('edit');
    setEditingId(category.id);
    setName(category.name || '');
  }

  async function onDelete(category) {
    const ok = window.confirm(`¿Eliminar la categoría "${category.name}"?`);
    if (!ok) return;

    setSaving(true);
    try {
      await remove(category.id);
      if (editingId === category.id) resetForm();
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="categories">
      <div className="categories__header">
        <div>
          <h2 className="categories__title">Gestión de categorías</h2>
          <p className="categories__subtitle">Crea, edita y elimina categorías para tus productos.</p>
        </div>
      </div>

      <form className="categories__form" onSubmit={onSubmit}>
        <div className="categories__formRow">
          <label className="categories__label">
            Nombre
            <input
              className="categories__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Hogar y Cocina"
              required
            />
          </label>
        </div>

        <div className="categories__actions">
          <button className="categories__btn categories__btn--primary" type="submit" disabled={saving}>
            {mode === 'edit' ? 'Guardar cambios' : 'Crear categoría'}
          </button>
          {mode === 'edit' && (
            <button className="categories__btn" type="button" onClick={resetForm} disabled={saving}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="categories__list">
        {loading && <div className="categories__state">Cargando categorías...</div>}
        {!loading && error && (
          <div className="categories__state categories__state--error">
            Error cargando categorías.
          </div>
        )}
        {!loading && !error && sorted.length === 0 && (
          <div className="categories__state">No hay categorías todavía.</div>
        )}

        {!loading && !error && sorted.length > 0 && (
          <table className="categories__table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th className="categories__colActions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td className="categories__colActions">
                    <button
                      type="button"
                      className="categories__btn categories__btn--small"
                      onClick={() => startEdit(c)}
                      disabled={saving}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="categories__btn categories__btn--small categories__btn--danger"
                      onClick={() => onDelete(c)}
                      disabled={saving}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default CategoriesManager;
