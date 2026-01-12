
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

export async function apiRequest(path, { method = 'GET', body, headers } = {}) {
  const url = `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  const debug = isDebugApiEnabled();
  if (debug) {
    console.log('[api] request', { method, url, body });
  }
console.log(url);

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
    const err = new Error('Network error: Failed to fetch');
    err.url = url;
    err.method = method;
    err.cause = cause;
    throw err;
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
    throw err;
  }

  return data;
}
