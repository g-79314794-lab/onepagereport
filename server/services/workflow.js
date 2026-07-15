export const approvalFlow = ['Guru', 'Penolong Kanan', 'Guru Besar'];
export const workflowStatuses = ['Draft', 'Waiting for Review', 'Approved', 'Rejected', 'Archived'];
export function nextApprovalStatus(current) { if (current === 'Draft') return 'Waiting for Review'; if (current === 'Waiting for Review') return 'Approved'; return current || 'Draft'; }
export function signApproval({ user, role, signature }) { return { user, role, signature, signedAt: new Date().toISOString() }; }
