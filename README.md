# Vueling Crew App - Portfolio Angular

Proyecto de practica personal para reforzar habilidades frontend con Angular Standalone.

La app simula un flujo real de autenticacion y gestion de vuelos, con enfoque en:

- CRUD (en esta version: Create y Read implementados)
- Login con JWT
- Validaciones de formularios
- Componentizacion y reutilizacion de UI

## Que practique en este proyecto

### 1) CRUD

- Create: registro de nuevos usuarios (via API o en localStorage, segun entorno).
- Read: listado y busqueda/filtrado de vuelos (via API o en localStorage, segun entorno).
- Nota: la base del proyecto permite extender facilmente Update y Delete.

### 2) Autenticacion con JWT

- Login por entorno:
	- modo API: login real contra backend
	- modo local: validacion en localStorage y JWT simulado
- Persistencia del token en localStorage.
- Lectura y validacion basica del payload (incluida expiracion).
- Http Interceptor para adjuntar Authorization: Bearer token en cada request.
- Guard de rutas para proteger pantallas privadas.
- Logout con limpieza de estado y redireccion a login.

### 3) Validaciones de inputs (frontend + backend)

- Reactive Forms con validaciones nativas:
	- required
	- minLength
	- validacion de email
- Validaciones custom:
	- fuerza de password
	- nombres prohibidos
	- confirmacion de password (match entre campos)
- Mapeo de errores de backend a mensajes claros por campo.

### 4) Componentizacion

- Componentes reutilizables para formularios:
	- input reutilizable
	- boton submit reutilizable
- Componentes desacoplados por responsabilidad:
	- login
	- register
	- flights
	- flight-search
	- flight-card
	- modal de logout

## Stack tecnico

- Angular 21 (Standalone API)
- TypeScript
- RxJS
- Angular Router + Guards
- Interceptors + Signals
- Signals para estado de autenticacion
- Configuracion por entorno (API y local)

## Estructura principal

```text
src/
	app/
		auth/
		components/
		guards/
		services/
		shared/
		utils/
	interceptor/
```

## Como ejecutar el proyecto

### 1) Instalar dependencias

```bash
npm install
```

### 2) Levantar frontend Angular

```bash
npm run start
```

Aplicacion en:

http://localhost:4200

### 3) Modos de ejecucion por entorno

Modo API:

```bash
npm run start:api
```

Modo local (sin backend):

```bash
npm run start:local
```

Build API:

```bash
npm run build:api
```

Build local:

```bash
npm run build:local
```

### 4) Modo sin API

Esta version funciona sin backend externo:

- Usuarios y token se guardan en localStorage.
- El listado de vuelos se inicializa desde datos semilla locales.
- El flujo de login, register y rutas protegidas funciona en local.

## Objetivo profesional

Este proyecto forma parte de mi portfolio para demostrar competencias de nivel junior en Angular, especialmente en:

- arquitectura por componentes
- autenticacion con JWT
- manejo de formularios y validaciones
- simulacion de backend en local para demos funcionales
- buenas practicas de organizacion de codigo

## Proximas mejoras

- Completar Update/Delete en vuelos para cerrar CRUD completo.
- Agregar tests unitarios adicionales en servicios, guards y formularios.
- Añadir manejo de refresh token y roles/permisos.
- Mejorar experiencia visual y estados de carga/empty/error.
