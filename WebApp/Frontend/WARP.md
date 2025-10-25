# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Framework: Angular 20 (standalone APIs) with CoreUI 5.
- Package manager: npm (see package-lock.json). Engines require Node ^20.19.0 || ^22.12.0 || ^24.0.0 and npm >= 9.
- Single app defined in angular.json as coreui-free-angular-admin-template; strict TS config enabled.

Common commands
- Install deps: npm install
- Start dev server (opens browser): npm start  (alias for ng serve -o)
- Build (prod by default): npm run build  → dist/coreui-free-angular-admin-template
- Build (dev watch): npm run watch  (ng build --watch --configuration development)
- Run all unit tests (Karma + Jasmine): npm test  (ng test)
- Run a single spec file: ng test --include=src/app/<path>/<file>.spec.ts
- CI-friendly test with coverage: ng test --watch=false --code-coverage
- Angular CLI availability: npm i -g @angular/cli

Notes on linting
- No lint configuration or npm script is present in this repo.

Architecture and structure (big picture)
- Entry/bootstrap
  - src/main.ts bootstraps using ApplicationConfig from src/app/app.config.ts.
  - app.config.ts wires providers: provideRouter, provideHttpClient (with interceptors), CoreUI modules, ngx-translate, animations. HashLocationStrategy is enabled (withHashLocation()).
- Routing and layout
  - src/app/app.routes.ts defines top-level routes. The default path loads the CoreUI DefaultLayout as a shell and is protected by authGuard.
  - Feature areas are lazy-loaded via routes files: patients, doctors, appointments, medical-records, and dashboard (each exposes routes in routes.ts under its folder).
  - CoreUI navigation items live in src/app/layout/default-layout/_nav.ts.
- Domain and services
  - Core services under src/app/core: guards (auth, role), interceptors (auth, error, mock-api), and ApiService (typed HTTP wrapper using environment.apiBaseUrl).
  - Models under src/app/core/models: patient, doctor, appointment, medical-record, auth, common.
- Mock API behavior (development)
  - Controlled by src/environments/environment.development.ts (useMockApi: true by default). When enabled, mock-api.interceptor.ts intercepts requests to environment.apiBaseUrl and serves data from localStorage, with optional seeding and artificial latency.
  - Production environment (src/environments/environment.ts) disables the mock API by default.
- Internationalization
  - ngx-translate is configured in app.config.ts. Default and supported languages come from environment.*. Translation files are expected under assets/i18n/*.json.
- UI and styling
  - CoreUI components and layout provide the shell (sidebar, header, etc.). Global styles at src/scss/styles.scss; static assets under src/assets.
- TypeScript and tooling
  - Strict compiler options enabled in tsconfig.json. Path alias @docs-components/* → src/components/* (see tsconfig.app.json).
- Testing
  - Unit tests use Karma (karma.conf.js) with Jasmine and Chrome launcher. Specs are colocated next to components (*.spec.ts).

Important from README
- Dev server at http://localhost:4200 (auto-reloads on file changes).
- This project was generated using Angular CLI; refer to Angular CLI docs for additional commands.
