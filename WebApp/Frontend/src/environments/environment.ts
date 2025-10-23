export const environment = {
  production: true,
  apiBaseUrl: '/api',
  useMockApi: false,
  defaultLang: 'id',
  supportedLangs: ['id', 'en'],
  clinicHours: { start: '17:00', end: '19:00' },
  slotMinutes: 15,
  mock: { seed: false, latencyMs: 0 },
  upload: {
    maxSizeMB: 5,
    allowedMimeTypes: ['image/*', 'application/pdf', 'text/plain']
  }
} as const;