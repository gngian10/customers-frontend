# Customers Frontend

La aplicación consume el microservicio REST `customers` desarrollado previamente en Spring Boot y permite consultar clientes, aplicar filtros por DNI y email, registrar nuevos clientes y visualizar indicadores relacionados con la fecha de nacimiento.

## Tecnologías

- Angular 21
- TypeScript
- npm
- Standalone Components
- Reactive Forms
- HttpClient
- Angular Material
- SCSS
- Chart.js
- ng2-charts
- RxJS
- Vitest

## Funcionalidades

La aplicación incluye las siguientes funcionalidades:

- Consulta de clientes en tabla.
- Filtro de clientes por DNI.
- Filtro de clientes por email.
- Filtro combinado por DNI y email.
- Formulario de creación de clientes.
- Validaciones de formulario en frontend.
- Manejo de errores provenientes del backend.
- Visualización de indicadores de natalidad.
- Visualización del mes/año con mayor cantidad de clientes nacidos.
- Visualización del mes/año con menor cantidad de clientes nacidos.
- Visualización de tasa de natalidad por mes/año.
- Gráfico de barras con cantidad de clientes nacidos por mes/año.
- Manejo visual de estados de carga, vacío, éxito y error.
- Diseño responsive con Angular Material y SCSS.

## Requisitos

Para ejecutar el proyecto se necesita:

- Node.js compatible con Angular 21.
- npm.
- Backend `customers` ejecutándose localmente.

## Instalación

Clonar el repositorio y ubicarse en la carpeta del proyecto.

Instalar dependencias:

```bash
npm install
```

## Ejecución

Ejecutar la aplicación con:

```bash
npm start
```

La aplicación estará disponible normalmente en:

```
http://localhost:4200
```

## Backend requerido

El frontend consume el backend en:

```
http://localhost:8080
```

La URL base utilizada para clientes es:

```
http://localhost:8080/api/customers
```

El backend debe estar levantado antes de utilizar las operaciones que requieren comunicación con la API.

## Endpoints consumidos

### Crear cliente

```
POST /api/customers
```

Ejemplo de request:

```json
{
  "nombre": "John",
  "apellido": "Doe",
  "email": "john.doe@email.com",
  "dni": "12345678",
  "fechaNacimiento": "1995-04-15"
}
```

El frontend no envía `id` ni `fechaCreacion`, ya que ambos son gestionados por el backend.

### Consultar todos los clientes

```
GET /api/customers
```

### Consultar por DNI

```
GET /api/customers?dni={dni}
```

### Consultar por email

```
GET /api/customers?email={email}
```

### Consultar por DNI y email

```
GET /api/customers?dni={dni}&email={email}
```

### Consultar indicadores

```
GET /api/customers/indicadores
```

## Rutas de la aplicación

La aplicación utiliza las siguientes rutas:

```text
/customers
/indicadores
```

La ruta raíz redirige al listado de clientes.

## Validaciones

El formulario de creación utiliza Reactive Forms.

Las validaciones implementadas son:

- Nombre obligatorio.
- Apellido obligatorio.
- Email obligatorio.
- Email con formato válido.
- DNI obligatorio.
- DNI de exactamente 8 dígitos numéricos.
- Fecha de nacimiento obligatoria.
- Fecha de nacimiento no futura.

El frontend realiza validaciones para mejorar la experiencia del usuario, pero el backend sigue siendo la fuente autoritativa para las reglas de negocio.

También se manejan errores devueltos por el backend, incluyendo:

- Errores de validación `400 Bad Request`.
- Clientes duplicados mediante `409 Conflict`.
- Errores inesperados de comunicación.

## Indicadores

La aplicación consume los indicadores calculados por el backend.

Se visualizan:

- Cantidad de clientes nacidos por mes/año.
- Mes/año con mayor cantidad de clientes nacidos.
- Mes/año con menor cantidad de clientes nacidos.
- Tasa de natalidad de cada mes/año.

El frontend no calcula estos valores, únicamente los consume y presenta.

## Gráfico

Se utiliza Chart.js mediante ng2-charts.

El gráfico utilizado es de barras:

- **Eje X:** mes/año
- **Eje Y:** cantidad de clientes

La información del gráfico proviene de `natalidadPorMesAnio`.

El detalle completo también se mantiene visible en una tabla.

## Manejo de estados

La aplicación contempla los principales estados de interacción.

### Loading

Ejemplos:

- Cargando clientes...
- Cargando indicadores...
- Guardando...

### Empty

Ejemplos:

- No se encontraron clientes.
- No hay datos de indicadores disponibles.

### Error

Ejemplos:

- No se pudo cargar la lista de clientes.
- No se pudieron cargar los indicadores.
- No se pudo crear el cliente.

Cuando el backend devuelve un mensaje específico, por ejemplo por DNI o email duplicado, dicho mensaje se muestra al usuario.

### Success

Luego de crear correctamente un cliente se muestra:

- Cliente creado correctamente.

## Estructura del proyecto

La aplicación sigue una estructura basada en funcionalidades.

```
src/app/
├── core/
│   └── services/
│       └── customer.service.ts
│
├── models/
│   ├── api-error.model.ts
│   ├── create-customer-request.model.ts
│   ├── customer-indicators.model.ts
│   └── customer.model.ts
│
├── features/
│   ├── customers/
│   │   ├── customer-list/
│   │   │   ├── customer-list.ts
│   │   │   ├── customer-list.html
│   │   │   └── customer-list.scss
│   │   │
│   │   └── customer-form/
│   │       ├── customer-form.ts
│   │       ├── customer-form.html
│   │       └── customer-form.scss
│   │
│   └── indicators/
│       └── indicators-dashboard/
│           ├── indicators-dashboard.ts
│           ├── indicators-dashboard.html
│           └── indicators-dashboard.scss
│
├── app.config.ts
├── app.routes.ts
├── app.ts
├── app.html
└── app.scss
```

## Arquitectura

Se utilizó una arquitectura basada en features.

### core/services

Contiene los servicios encargados de la comunicación con el backend.

Actualmente incluye:

- `CustomerService`

Este servicio centraliza las llamadas HTTP relacionadas con clientes e indicadores.

Los componentes no realizan llamadas directas con `HttpClient`.

### models

Contiene las interfaces TypeScript utilizadas para representar el contrato de la API.

Se mantienen los nombres de propiedades en español para respetar directamente el contrato del backend.

### features

Contiene las funcionalidades principales de la aplicación:

- customers
- indicators

La estructura evita agregar capas o abstracciones innecesarias para el alcance del proyecto.

## CustomerService

El servicio expone operaciones equivalentes a:

- `createCustomer(...)`
- `getCustomers()`
- `getCustomersByDni(...)`
- `getCustomersByEmail(...)`
- `getCustomersByDniAndEmail(...)`
- `getIndicators()`

Los filtros se envían al backend mediante query parameters usando `HttpParams`.

El filtrado no se realiza localmente sobre el array de clientes.

## Angular Material

Angular Material se utiliza para mejorar la consistencia visual de la aplicación.

Entre los componentes utilizados se encuentran elementos como:

- Cards.
- Form fields.
- Inputs.
- Buttons.
- Tables.
- Progress indicators.

## SCSS

SCSS continúa siendo el sistema de estilos del proyecto.

Se utiliza principalmente para:

- Layout.
- Espaciado.
- Responsive design.
- Contenedores.
- Ajustes visuales sobre Angular Material.
- Estados de éxito y error.

La interfaz está adaptada para funcionar tanto en escritorio como en mobile.

## Tests

Los tests unitarios utilizan Vitest junto con las herramientas de testing HTTP de Angular.

Ejecutar:

```bash
npm test
```

Se implementaron pruebas sobre `CustomerService` equivalentes a los principales casos probados en el backend.

### Creación exitosa

Verifica que:

- Se realice una petición POST.
- Se utilice el endpoint correcto.
- Se envíe correctamente `CreateCustomerRequest`.
- No se envíen `id` ni `fechaCreacion`.
- Se reciba correctamente la respuesta del backend.

### DNI duplicado

Verifica que:

- Se realice la petición de creación.
- Una respuesta `409 Conflict` sea propagada correctamente.
- Se preserve el mensaje enviado por el backend.

La detección de duplicados sigue siendo responsabilidad del backend.

### Consulta de indicadores

Verifica que:

- Se realice una petición GET.
- Se utilice `/api/customers/indicadores`.
- La respuesta sea recibida correctamente.

El frontend no recalcula los indicadores.

## Build

Para generar el build de producción:

```bash
npm run build
```

Angular generará los archivos optimizados de acuerdo con la configuración definida en `angular.json`.

## Consideraciones

El frontend utiliza por defecto:

```
http://localhost:4200
```

y el backend:

```
http://localhost:8080
```

Por este motivo, el backend debe permitir las solicitudes realizadas desde el origen del frontend mediante la configuración correspondiente de CORS.