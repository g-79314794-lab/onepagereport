export async function api(path, options = {}) { const res = await fetch(path, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options }); if (!res.ok) throw new Error(await res.text()); return res.json(); }
export function toMalayDate(value) { if (!value) return '-'; const [y,m,d] = value.slice(0,10).split('-'); return `${d}/${m}/${y}`; }
