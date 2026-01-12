import { useEffect, useState } from 'react';
import { productsService } from '../services/products.service';

export function useProducts(initialFilters = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 });

  const fetch = async (overrideFilters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsService.list(overrideFilters || filters);
      if (res.products && Array.isArray(res.products)) {
        setItems(res.products);
        setPagination({
          total: res.total,
          page: res.page,
          limit: res.limit,
          pages: res.pages,
        });
      } else {
        setItems(res);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const create = async (data) => {
    await productsService.create(data);
    fetch();
  };

  const update = async (id, data) => {
    await productsService.update(id, data);
    fetch();
  };

  const remove = async (id) => {
    await productsService.remove(id);
    fetch();
  };

  const setProductFilters = (newFilters) => {
    setFilters(f => ({ ...f, ...newFilters }));
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, [filters]);

  return { items, loading, error, fetch, create, update, remove, filters, setProductFilters, pagination };
}
