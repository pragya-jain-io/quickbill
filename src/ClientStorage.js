
const STORAGE_KEY = 'quickbill.clients.v1';

export const MAX_CLIENTS = 10;

const CUSTOMER_FIELDS = [
  'name',
  'phone',
  'gstNumber',
  'addressLine1',
  'addressLine2',
];

export function createClient(customer) {
  return {
    id: globalThis.crypto?.randomUUID?.() ??
      `client-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,

    ...Object.fromEntries(
      CUSTOMER_FIELDS.map(field => [
        field,
        String(customer?.[field] ?? ''),
      ])
    ),
  };
}

export function loadClients() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .slice(0, MAX_CLIENTS)
      .filter(client => client && typeof client.id === 'string')
      .map(client => ({
        id: client.id,
        ...Object.fromEntries(
          CUSTOMER_FIELDS.map(field => [
            field,
            String(client[field] ?? ''),
          ])
        ),
      }));
  } catch (error) {
    console.error('Could not load clients:', error);
    return [];
  }
}

export function saveClients(clients) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export function parseClientsBackup(fileText) {
  const backup = JSON.parse(fileText);

  if (
    backup.app !== 'QuickBill' ||
    backup.version !== 1 ||
    !Array.isArray(backup.clients)
  ) {
    throw new Error('This is not a valid QuickBill client backup.');
  }

  if (backup.clients.length > MAX_CLIENTS) {
    throw new Error(`A maximum of ${MAX_CLIENTS} clients can be restored.`);
  }

  const seenIds = new Set();

  const clients = backup.clients.map(client => {
    if (
      !client ||
      typeof client.id !== 'string' ||
      !client.id.trim() ||
      typeof client.name !== 'string' ||
      !client.name.trim()
    ) {
      throw new Error('A client record is missing its ID or name.');
    }

    if (seenIds.has(client.id)) {
      throw new Error('The backup contains duplicate client IDs.');
    }

    seenIds.add(client.id);

    return {
      id: client.id,
      ...Object.fromEntries(
        CUSTOMER_FIELDS.map(field => [
          field,
          String(client[field] ?? ''),
        ])
      ),
    };
  });

  return clients;
}
