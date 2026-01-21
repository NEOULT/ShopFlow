
const isProd = import.meta.env.MODE === 'production';
const DEFAULT_BASE_URL = isProd
  ? 'https://backend-shopflow.onrender.com/api'
  : '/api';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');

function isDebugApiEnabled() {
  const envFlag = import.meta?.env?.VITE_DEBUG_API;
  if (envFlag === 'true') return true;
  if (typeof window === 'undefined') return false;
  return window.localStorage?.getItem('debugApi') === '1';
}

async function parseResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

/**
 * apiRequest(path, options)
 * options puede incluir:
 *   - method, body, headers
 *   - backends: arreglo de URLs base (opcional)
 * Si recibe error 402, prueba el siguiente backend.
 */
export async function apiRequest(path, { method = 'GET', body, headers, backends } = {}) {
  const backendList = Array.isArray(backends) && backends.length > 0
    ? backends
    : [API_BASE_URL];

  let lastError;
  for (let i = 0; i < backendList.length; i++) {
    const baseUrl = backendList[i].replace(/\/$/, '');
    const url = `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    const debug = isDebugApiEnabled();
    if (debug) {
      console.log('[api] request', { method, url, body });
    }
    let res;
    try {
      res = await fetch(url, {
        method,
        headers: {
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...(headers || {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (cause) {
      if (debug) {
        console.error('[api] fetch error', { method, url, cause });
      }
      lastError = new Error('Network error: Failed to fetch');
      lastError.url = url;
      lastError.method = method;
      lastError.cause = cause;
      continue; // intenta siguiente backend
    }

    const data = await parseResponse(res);

    if (debug) {
      console.log('[api] response', { method, url, status: res.status, ok: res.ok, data });
    }

    if (!res.ok) {
      const message =
        typeof data === 'string' && data
          ? data
          : (data && typeof data === 'object' && 'message' in data ? data.message : 'Request failed');

      const err = new Error(message);
      err.status = res.status;
      err.data = data;
      err.url = url;
      err.method = method;

      if (debug) {
        console.error('[api] error', { method, url, status: res.status, data });
      }
      // Si es 402, intenta siguiente backend
      if (res.status === 402 && i < backendList.length - 1) {
        lastError = err;
        continue;
      }
      throw err;
    }

    return data;
  }
  // Si llegamos aquí, todos los backends fallaron
  throw lastError || new Error('No backend available');
}
