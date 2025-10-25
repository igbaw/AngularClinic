[![@coreui angular](https://img.shields.io/badge/@coreui%20-angular-lightgrey.svg?style=flat-square)](https://github.com/coreui/angular)
[![npm-coreui-angular][npm-coreui-angular-badge]][npm-coreui-angular]
[![npm-coreui-angular][npm-coreui-angular-badge-next]][npm-coreui-angular]
[![NPM downloads][npm-coreui-angular-download]][npm-coreui-angular]  
[![@coreui coreui](https://img.shields.io/badge/@coreui%20-coreui-lightgrey.svg?style=flat-square)](https://github.com/coreui/coreui)
[![npm package][npm-coreui-badge]][npm-coreui]
[![NPM downloads][npm-coreui-download]][npm-coreui]  
![angular](https://img.shields.io/badge/angular-^20.3.0-lightgrey.svg?style=flat-square&logo=angular)

[npm-coreui-angular]: https://www.npmjs.com/package/@coreui/angular

[npm-coreui-angular-badge]: https://img.shields.io/npm/v/@coreui/angular.png?style=flat-square

[npm-coreui-angular-badge-next]: https://img.shields.io/npm/v/@coreui/angular/next?style=flat-square&color=red

[npm-coreui-angular-download]: https://img.shields.io/npm/dm/@coreui/angular.svg?style=flat-square

[npm-coreui]: https://www.npmjs.com/package/@coreui/coreui

[npm-coreui-badge]: https://img.shields.io/npm/v/@coreui/coreui.png?style=flat-square

[npm-coreui-download]: https://img.shields.io/npm/dm/@coreui/coreui.svg?style=flat-square

# AngularClinic - Frontend

AngularClinic is a comprehensive clinic management system for ENT (Ear, Nose, Throat) clinics. This frontend is built with Angular 20 and CoreUI 5, providing a modern, responsive admin interface for managing patients, doctors, appointments, and medical records.

## Features

- 👥 **Patient Management**: Complete CRUD operations with search and medical history
- 👨‍⚕️ **Doctor Management**: Doctor profiles, schedules, and availability
- 📅 **Appointment System**: Calendar view, booking, and status management
- 📋 **Medical Records**: SOAP notes (Subjective, Objective, Assessment, Plan) format
- 🔐 **Authentication**: Secure cookie-based session with role-based access control
- 🌍 **Internationalization**: Multi-language support with ngx-translate
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Framework**: Angular 20 (standalone components)
- **UI Library**: CoreUI 5
- **State Management**: Signals API
- **HTTP Client**: Angular HttpClient with interceptors
- **Calendar**: FullCalendar integration
- **Routing**: Hash-based routing strategy

## Related Links

- [CoreUI Angular Docs](https://coreui.io/angular/docs/)
- [Angular Documentation](https://angular.dev)

## Table of Contents

* [Versions](#versions)
* [CoreUI Pro](#coreui-pro)
* [Quick Start](#quick-start)
* [Installation](#installation)
* [Basic usage](#basic-usage)
* [What's included](#whats-included)
* [Documentation](#documentation)
* [Versioning](#versioning)
* [Creators](#creators)
* [Community](#community)
* [Copyright and License](#copyright-and-license)

## Versions

* [CoreUI Free Bootstrap Admin Template](https://github.com/coreui/coreui-free-bootstrap-admin-template)
* [CoreUI Free Angular Admin Template](https://github.com/coreui/coreui-free-angular-admin-template)
* [CoreUI Free React.js Admin Template](https://github.com/coreui/coreui-free-react-admin-template)
* [CoreUI Free Vue.js Admin Template](https://github.com/coreui/coreui-free-vue-admin-template)

## CoreUI Pro

* 💪  [CoreUI Pro Angular Admin Template](https://coreui.io/product/angular-dashboard-template/)
* 💪  [CoreUI Pro Bootstrap Admin Template](https://coreui.io/product/bootstrap-dashboard-template/)
* 💪  [CoreUI Pro React Admin Template](https://coreui.io/product/react-dashboard-template/)
* 💪  [CoreUI Pro Next.js Admin Template](https://coreui.io/product/next-js-dashboard-template/)
* 💪  [CoreUI Pro Vue Admin Template](https://coreui.io/product/vue-dashboard-template/)

## CoreUI PRO Angular Admin Templates

| Default Theme                                                                                                                                                                      | Light Theme                                                                                                                                                                    |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [![CoreUI PRO Angular Admin Template](https://coreui.io/images/templates/coreui_pro_default_light_dark.webp)](https://coreui.io/product/angular-dashboard-template/?theme=default) | [![CoreUI PRO Angular Admin Template](https://coreui.io/images/templates/coreui_pro_light_light_dark.webp)](https://coreui.io/product/angular-dashboard-template/?theme=light) |

| Modern Theme                                                                                                                                                                             | Bright Theme                                                                                                                                                                    |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [![CoreUI PRO Angular Admin Template](https://coreui.io/images/templates/coreui_pro_default_v3_light_dark.webp)](https://coreui.io/product/angular-dashboard-template/?theme=default-v3) | [![CoreUI PRO React Admin Template](https://coreui.io/images/templates/coreui_pro_light_v3_light_dark.webp)](https://coreui.io/product/angular-dashboard-template/?theme=light) |

## Quick Start

### Prerequisites

Before you begin, make sure your development environment includes:

- **Node.js**: Version `^20.19.0 || ^22.12.0 || ^24.0.0` (LTS recommended)
  - Check version: `node -v`
  - Download: [nodejs.org](https://nodejs.org/)

- **npm**: Version `>= 9`
  - Check version: `npm -v`

- **Angular CLI** (optional but recommended):
  ```powershell
  npm install -g @angular/cli
  ```

### Installation

1. **Install dependencies**:
   ```powershell
   npm install
   ```

2. **Start development server**:
   ```powershell
   npm start
   ```
   Opens browser automatically at http://localhost:4200

3. **Or use the startup script** (from project root):
   ```powershell
   cd ..\..
   .\start-dev.ps1
   ```
   This starts both frontend and backend together.

### Available Commands

```powershell
# Start dev server (with browser auto-open)
npm start

# Build for production
npm run build

# Build for development (watch mode)
npm run watch

# Run unit tests
npm test

# Run specific test file
ng test --include=src/app/<path>/<file>.spec.ts

# Generate new component
ng generate component <name>
```

### Development Modes

#### Mock API Mode (Default)
The app runs with a mock API by default, using localStorage for data persistence. Great for frontend development without backend dependency.

- Configured in: `src/environments/environment.development.ts`
- Setting: `useMockApi: true`

#### Backend Integration Mode
To connect to the real ElysiaJS backend:

1. Set `useMockApi: false` in `src/environments/environment.development.ts`
2. Ensure backend is running at http://localhost:8080
3. Use the startup script for convenience

## What's included

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations.
You'll see something like this:

```
coreui-free-angular-admin-template
├── src/                         # project root
│   ├── app/                     # main app directory
|   │   ├── icons/               # icons set for the app
|   │   ├── layout/              # layout 
|   |   │   └── default-layout/  # layout components
|   |   |       └── _nav.js      # sidebar navigation config
|   │   └── views/               # application views
│   ├── assets/                  # images, icons, etc.
│   ├── components/              # components for demo only
│   ├── scss/                    # scss styles
│   └── index.html               # html template
│
├── angular.json
├── README.md
└── package.json
```

## Documentation

The documentation for the CoreUI Admin Template is hosted at our website [CoreUI for Angular](https://coreui.io/angular/)

---

## Versioning

For transparency into our release cycle and in striving to maintain backward compatibility, CoreUI Free Admin Template is maintained
under [the Semantic Versioning guidelines](http://semver.org/).

See [the Releases section of our project](https://github.com/coreui/coreui-free-angular-admin-template/releases) for changelogs for each release version.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Creators

**Łukasz Holeczek**

* <https://twitter.com/lukaszholeczek>
* <https://github.com/mrholek>
* <https://github.com/coreui>

**CoreUI team**

* https://github.com/orgs/coreui/people

## Community

Get updates on CoreUI's development and chat with the project maintainers and community members.

- Follow [@core_ui on Twitter](https://twitter.com/core_ui).
- Read and subscribe to [CoreUI Blog](https://coreui.io/blog/).

## Support CoreUI Development

CoreUI is an MIT-licensed open source project and is completely free to use. However, the amount of effort needed to maintain and develop new features for the
project is not sustainable without proper financial backing. You can support development by buying the [CoreUI PRO](https://coreui.io/pricing/) or by becoming a
sponsor via [Open Collective](https://opencollective.com/coreui/).

<!--- StartOpenCollectiveBackers -->

### Platinum Sponsors

Support this project by [becoming a Platinum Sponsor](https://opencollective.com/coreui/contribute/platinum-sponsor-40959/). A large company logo will be added
here with a link to your website.

<a href="https://opencollective.com/coreui/contribute/platinum-sponsor-40959/checkout"><img src="https://opencollective.com/coreui/tiers/platinum-sponsor/0/avatar.svg?avatarHeight=100"></a>

### Gold Sponsors

Support this project by [becoming a Gold Sponsor](https://opencollective.com/coreui/contribute/gold-sponsor-40960/). A big company logo will be added here with
a link to your website.

<a href="https://opencollective.com/coreui/contribute/gold-sponsor-40960/checkout"><img src="https://opencollective.com/coreui/tiers/gold-sponsor/0/avatar.svg?avatarHeight=100"></a>

### Silver Sponsors

Support this project by [becoming a Silver Sponsor](https://opencollective.com/coreui/contribute/silver-sponsor-40967/). A medium company logo will be added
here with a link to your website.

<a href="https://opencollective.com/coreui/contribute/silver-sponsor-40967/checkout"><img src="https://opencollective.com/coreui/tiers/gold-sponsor/0/avatar.svg?avatarHeight=100"></a>

### Bronze Sponsors

Support this project by [becoming a Bronze Sponsor](https://opencollective.com/coreui/contribute/bronze-sponsor-40966/). The company avatar will show up here
with a link to your OpenCollective Profile.

<a href="https://opencollective.com/coreui/contribute/bronze-sponsor-40966/checkout"><img src="https://opencollective.com/coreui/tiers/bronze-sponsor/0/avatar.svg?avatarHeight=100"></a>

### Backers

Thanks to all the backers and sponsors! Support this project by [becoming a backer](https://opencollective.com/coreui/contribute/backer-40965/).

<a href="https://opencollective.com/coreui/contribute/backer-40965/checkout" target="_blank" rel="noopener"><img src="https://opencollective.com/coreui/backers.svg?width=890"></a>

<!--- EndOpenCollectiveBackers -->

## Copyright and License

copyright 2025 creativeLabs Łukasz Holeczek.

Code released under [the MIT license](https://github.com/coreui/coreui-free-react-admin-template/blob/master/LICENSE).
There is only one limitation you can't re-distribute the CoreUI as stock. You can’t do this if you modify the CoreUI. In the past, we faced some problems with
persons who tried to sell CoreUI based templates.
