const QUEUE_KEY = 'laporan-sync-queue';
export const offlineStore = {
  list() { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); },
  add(item) { const next = [{ ...item, queuedAt: new Date().toISOString() }, ...offlineStore.list()]; localStorage.setItem(QUEUE_KEY, JSON.stringify(next)); return next; },
  clear() { localStorage.removeItem(QUEUE_KEY); }
};
export async function syncQueuedReports(api) {
  const queue = offlineStore.list();
  const synced = [];
  for (const item of queue) synced.push(await api('/api/reports', { method: 'POST', body: JSON.stringify(item.payload) }));
  offlineStore.clear();
  return synced;
}
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
}
