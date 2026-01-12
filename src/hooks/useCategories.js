import { useCallback, useEffect, useMemo, useState } from 'react';
import { categoriesService } from '../services/categories.service.js';

function isDebugCategoriesEnabled() {
  try {
    const envFlag = import.meta?.env?.VITE_DEBUG_CATEGORIES;
    const localFlag = localStorage.getItem('debugCategories');
    return envFlag === 'true' || localFlag === '1';
  } catch {
    return false;
  }
}

function normalizeCategory(apiCategory) {
  return {
    id: apiCategory._id ?? apiCategory.id,
    name: apiCategory.category_na ?? apiCategory.name ?? apiCategory.title ?? '',
    raw: apiCategory,
  };
}

export function useCategories() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (isDebugCategoriesEnabled()) console.log('[categories] refresh:start');
      const data = await categoriesService.list();
      console.log('[categories] data', data);
      if (isDebugCategoriesEnabled()) console.log('[categories] refresh:raw', data);
      const list = Array.isArray(data) ? data : (data?.items || data?.data || []);
      setItems(list.map(normalizeCategory));
    } catch (err) {
      console.error('[categories] error', err);
      if (isDebugCategoriesEnabled()) console.error('[categories] refresh:error', err);
      setItems([]);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await refresh();
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const create = useCallback(async ({ name }) => {
    const payload = { category_na: name };
    if (isDebugCategoriesEnabled()) console.log('[categories] create:start', payload);
    await categoriesService.create(payload);
    if (isDebugCategoriesEnabled()) console.log('[categories] create:success');
    await refresh();
  }, [refresh]);

  const update = useCallback(async (id, { name }) => {
    const payload = { category_na: name };
    if (isDebugCategoriesEnabled()) console.log('[categories] update:start', { id, ...payload });
    await categoriesService.update(id, payload);
    if (isDebugCategoriesEnabled()) console.log('[categories] update:success', { id });
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id) => {
    if (isDebugCategoriesEnabled()) console.log('[categories] remove:start', { id });
    await categoriesService.remove(id);
    if (isDebugCategoriesEnabled()) console.log('[categories] remove:success', { id });
    await refresh();
  }, [refresh]);

  const byId = useMemo(() => {
    const map = new Map();
    for (const c of items) map.set(c.id, c);
    return map;
  }, [items]);

  return { items, byId, loading, error, refresh, create, update, remove };
}
