export const environment = {
  production: false,
  apiBaseUrl: '/api',
  useMockApi: true,
  defaultLang: 'id',
  supportedLangs: ['id', 'en'],
  clinicHours: { start: '17:00', end: '19:00' },
  slotMinutes: 15,
  upload: {
    maxSizeMB: 5,
    allowedMimeTypes: ['image/*', 'application/pdf', 'text/plain']
  },
  mock: {
    latencyMs: 250,
    seed: true
  }
} as const;