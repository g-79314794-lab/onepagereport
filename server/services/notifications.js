const notifications = [];
export function notify(type, message, payload = {}) { const item = { id: crypto.randomUUID(), type, message, payload, createdAt: new Date().toISOString(), read: false }; notifications.unshift(item); return item; }
export function listNotifications() { return notifications; }
