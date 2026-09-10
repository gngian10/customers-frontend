# AGENTS.md

## Project

Customers frontend application built with Angular 21 and npm.

The application consumes the Customers REST API provided by the backend service.

## Technology

* Angular 21
* TypeScript
* npm
* Standalone components
* Reactive Forms
* HttpClient
* Vitest
* SCSS

## Architecture

Use a simple feature-based structure.

Main folders:

```text
src/app/
├── core/
│   └── services/
├── models/
├── features/
│   ├── customers/
│   └── indicators/
```

Do not introduce unnecessary architectural complexity such as:

* NgRx
* hexagonal architecture
* ports and adapters
* custom state management libraries
* unnecessary abstractions

Keep the solution appropriate for the scope of the technical test.

## Angular Conventions

Use modern Angular 21 conventions:

* standalone components
* `inject()` for dependency injection
* Reactive Forms
* `provideHttpClient()`
* `@if`
* `@for`
* strict TypeScript
* signals only when they provide a clear benefit

Do not create NgModules unless explicitly required.

## Domain Language

Keep the backend API contract in Spanish.

Customer fields:

* `id`
* `nombre`
* `apellido`
* `email`
* `dni`
* `fechaCreacion`
* `fechaNacimiento`

Do not rename API properties to English.

`dni` must remain a string.

## API

Backend base URL:

```text
http://localhost:8080/api/customers
```

Available operations:

```text
POST /api/customers
GET  /api/customers
GET  /api/customers?dni={dni}
GET  /api/customers?email={email}
GET  /api/customers?dni={dni}&email={email}
GET  /api/customers/indicadores
```

The frontend must not send `id` or `fechaCreacion` when creating a customer.

The backend generates `fechaCreacion`.

## Responsibilities

Components should handle:

* presentation
* user interaction
* form state
* loading states
* displaying validation and API errors

Services should handle:

* HTTP communication
* query parameters
* API calls

Do not place direct `HttpClient` calls inside feature components.

## Forms

Use Reactive Forms.

Customer creation validations must reflect the backend rules:

* `nombre`: required
* `apellido`: required
* `email`: required and valid email
* `dni`: required and exactly 8 numeric digits
* `fechaNacimiento`: required and cannot be in the future

Backend validation remains authoritative.

## Error Handling

Support the backend error contract:

```text
status
message
errors
timestamp
```

Validation errors may contain field-specific messages in `errors`.

HTTP 409 responses should display the backend duplicate message.

Empty customer searches return:

```text
[]
```

with HTTP 200 and must not be treated as errors.

## Testing

Use Vitest through Angular CLI.

For every task:

1. Explain briefly what files will be changed.
2. Implement only the requested scope.
3. Do not create new tests unless the task explicitly requests tests.
4. Run relevant tests or compilation after changes.
5. Report what was changed.
6. Report any assumptions.
7. Do not create a Git commit unless explicitly requested.

## Styling

Use SCSS.

Keep the interface clean, responsive, and simple.

Do not add UI libraries unless explicitly requested.

## Commands

Install dependencies:

```bash
npm install
```

Run application:

```bash
npm start
```

Run tests:

```bash
npm test
```

Build:

```bash
npm run build
```
