// Lightweight fetch helpers for the Lopez Travel API (all routes prefixed with /api)

async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }
  if (!res.ok) {
    const message = (data && data.error) || `Erro ${res.status}`
    throw new Error(message)
  }
  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body || {}) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body || {}) }),
  del: (path) => request(path, { method: 'DELETE' }),
}

export function formatBRL(value) {
  const n = Number(value) || 0
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)
}

export function formatDate(value) {
  if (!value) return '—'
  try {
    const d = new Date(value)
    if (isNaN(d.getTime())) return String(value)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return String(value)
  }
}
