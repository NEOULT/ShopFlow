import { useCallback, useEffect, useMemo, useState } from 'react';
import { labelsService } from '../services/labels.service.js';

function normalizeLabel(apiLabel) {
  return {
    id: apiLabel._id ?? apiLabel.id,
    text: apiLabel.label_te ?? '',
    bg: apiLabel.label_bg ?? '#eeeeee',
    color: apiLabel.label_tc ?? '#222222',
    raw: apiLabel,
  };
}

export function useLabels() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await labelsService.list();
      const list = Array.isArray(data) ? data : (data?.items || data?.data || []);
      setItems(list.map(normalizeLabel));
    } catch (err) {
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
    return () => { cancelled = true; };
  }, [refresh]);

  const create = useCallback(async ({ text, bg, color }) => {
    const payload = { label_te: text, label_bg: bg, label_tc: color };
    await labelsService.create(payload);
    await refresh();
  }, [refresh]);

  const update = useCallback(async (id, { text, bg, color }) => {
    const payload = { label_te: text, label_bg: bg, label_tc: color };
    await labelsService.update(id, payload);
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id) => {
    await labelsService.remove(id);
    await refresh();
  }, [refresh]);

  const byId = useMemo(() => {
    const map = new Map();
    for (const l of items) map.set(l.id, l);
    return map;
  }, [items]);

  return { items, byId, loading, error, refresh, create, update, remove };
}
