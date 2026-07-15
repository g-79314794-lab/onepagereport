export const cloudProviders = ['google-drive', 'onedrive', 'dropbox', 'aws-s3', 'local-nas'];
export function buildFolderPath({ year, monthName, programme }) { return [String(year), monthName, programme].filter(Boolean).join('/'); }
export async function uploadToCloud({ provider, fileName, buffer, metadata = {} }) {
  if (!cloudProviders.includes(provider)) throw new Error('Penyedia awan tidak disokong.');
  return { provider, fileName, size: buffer?.length || 0, folder: buildFolderPath(metadata), url: `https://cloud.example/${provider}/${encodeURIComponent(fileName)}`, status: 'simulated' };
}
export async function restoreBackup({ provider, backupId }) { return { provider, backupId, status: 'restore-queued' }; }
