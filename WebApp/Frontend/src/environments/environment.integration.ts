export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api',
  useMockApi: false,
  defaultLang: 'id',
  supportedLangs: ['id', 'en'],
  clinicHours: { start: '17:00', end: '19:00' },
  slotMinutes: 15,
  upload: {
    maxSizeMB: 5,
    allowedMimeTypes: ['image/*', 'application/pdf', 'text/plain']
  },
  mock: {
    latencyMs: 0,
    seed: false
  }
} as const;
