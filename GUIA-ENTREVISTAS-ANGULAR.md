# Guia de estudio para entrevistas (basada en este proyecto)

## 1. Mapa mental del proyecto

Este proyecto cubre un flujo clasico de autenticacion en Angular:

- `LoginComponent` valida credenciales basicas.
- `AuthService` mantiene el estado de sesion.
- `authGuard` protege rutas privadas.
- `FlightsComponent` representa zona privada.
- `app.routes.ts` define navegacion y control de acceso.
- `main.ts` + `app.config.ts` arrancan la app con API moderna (standalone).

Objetivo de entrevista que puedes vender:
"Implemente autenticacion de frontend con rutas protegidas usando Angular standalone, inyeccion con `inject()`, `signals` para estado reactivo y guards para control de acceso".

## 2. Conceptos Angular clave que ya usas

## 2.1 Standalone API

Archivos:
- `src/main.ts`
- `src/app/app.ts`
- `src/app/app.config.ts`

Debes dominar:
- `bootstrapApplication(App, appConfig)` en lugar de `AppModule`.
- `ApplicationConfig` para registrar providers globales.
- `provideRouter(routes)` para habilitar enrutado.
- Ventajas: menos boilerplate, mejor tree-shaking, arquitectura mas simple.

Pregunta tipica:
"Que diferencia hay entre NgModules y standalone components?"

Respuesta corta sugerida:
"Standalone reduce complejidad y dependencias implicitas. Declaro imports por componente y configuro providers en `app.config.ts`, con un arranque mas directo en `main.ts`".

## 2.2 Inyeccion de dependencias moderna

Archivos:
- `src/app/components/login/login.component.ts`
- `src/app/components/flights/flights.component.ts`
- `src/app/guards/auth-guard.ts`

Debes dominar:
- Uso de `inject()` dentro de clases y funciones.
- Diferencia entre `constructor(private svc: Svc)` y `const svc = inject(Svc)`.
- `@Injectable({ providedIn: 'root' })` como singleton global.

Pregunta tipica:
"Cuando prefieres `inject()` sobre constructor injection?"

## 2.3 Estado con Signals

Archivo:
- `src/app/services/auth.ts`

Debes dominar:
- `signal(false)` como estado local reactivo.
- Lectura con `this.isAuthenticated()`.
- Escritura con `set(true/false)`.
- Ventaja sobre patrones antiguos: menos overhead que RxJS para estado simple.

Pregunta tipica:
"Signals o BehaviorSubject para auth state?"

Respuesta equilibrada:
"Para estado simple local, Signals son mas directos. Para flujos async complejos o streaming entre capas, RxJS sigue siendo muy util".

## 2.4 Routing y Guards

Archivos:
- `src/app/app.routes.ts`
- `src/app/guards/auth-guard.ts`

Debes dominar:
- `Routes` y orden de rutas.
- `canActivate` para proteger rutas.
- Retorno de guard: `true`, `false`, `UrlTree`, `Observable`, `Promise`.
- Redireccion con `router.parseUrl('/login')`.

Pregunta tipica:
"Por que devolver `UrlTree` en vez de `navigate()` dentro del guard?"

Respuesta sugerida:
"`UrlTree` hace la navegacion declarativa y evita side effects. Es mas testeable y recomendado por Angular".

## 2.5 Ciclo de autenticacion frontend

Flujo actual:
1. Usuario entra a `/login`.
2. Valida credenciales mock.
3. `AuthService.login()` cambia estado.
4. Navega a `/flights`.
5. Guard verifica `checkStatus()` antes de permitir acceso.
6. En logout se resetea estado y vuelve a login.

Para entrevista, aclara siempre:
- Esto es autenticacion de frontend (demo).
- En produccion agregarias backend, JWT, expiracion, refresh token, interceptor y manejo de roles.

## 3. Temas que suelen preguntarte y como conectarlos a tu proyecto

## 3.1 Seguridad

En este proyecto:
- Credenciales hardcodeadas y estado en memoria.

Como mejorarlo:
- Login real via API HTTPS.
- Guard con validacion de token vigente.
- HTTP interceptor para agregar `Authorization`.
- Manejo de 401 global.
- Nunca guardar secretos en frontend.

## 3.2 Testing

Hay archivo de guard spec en proyecto (`auth-guard.spec.ts`).

Debes dominar:
- Test unitario de `AuthService`.
- Test de `authGuard` en caso autenticado y no autenticado.
- Test de componentes: evento click, navegacion y render.

Preguntas tipicas:
- "Que test haria primero?"
- "Como aislas el Router en pruebas?"

## 3.3 Arquitectura y escalabilidad

Debes explicar:
- Separacion por capas: `components`, `services`, `guards`.
- Unica fuente de verdad para auth state: `AuthService`.
- Reutilizacion de guard en multiples rutas privadas.

Escalado natural:
- `core/` para singletones.
- `shared/` para UI reutilizable.
- Feature folders por dominio (`flights`, `profile`, `admin`).

## 3.4 UX y validaciones

En login actual:
- Inputs simples y `alert`.

Mejoras para entrevista:
- Formularios reactivos.
- Validaciones (`required`, `minLength`, patrones).
- Errores visuales accesibles en UI.
- Deshabilitar boton mientras envia.

## 4. Preguntas de entrevista + respuesta breve (simulador)

1. "Como proteges rutas en Angular?"
"Con guards (`canActivate`) que consultan un servicio de autenticacion y devuelven `true` o `UrlTree` para redirigir".

2. "Que hace `providedIn: 'root'`?"
"Registra el servicio en el injector raiz, creando una instancia singleton para toda la app".

3. "Que ventaja tiene `bootstrapApplication`?"
"Permite arrancar apps standalone sin modulo raiz, con configuracion mas explicita y ligera".

4. "Por que separar auth en servicio?"
"Centraliza estado y reglas de autenticacion, evita duplicacion entre componentes y facilita pruebas".

5. "Que falta para pasar esto a produccion?"
"Backend real, tokens seguros, expiracion/refresh, interceptor HTTP, manejo de errores y testing robusto".

## 5. Checklist de estudio (orden recomendado)

1. Entender al 100% `AuthService` y `signal`.
2. Explicar de memoria el `authGuard` y `UrlTree`.
3. Dominar rutas en `app.routes.ts` y orden de matching.
4. Practicar `inject()` vs constructor injection.
5. Añadir formulario reactivo al login.
6. Añadir tests unitarios para guard y servicio.
7. Simular autenticacion real con `HttpClient`.
8. Implementar interceptor de token.

## 6. Mini ejercicios para destacar en entrevista

1. Agregar rol `admin` y crear `roleGuard`.
2. Persistir sesion en `localStorage` con expiracion.
3. Migrar login a Reactive Forms.
4. Mostrar mensaje de error en template en lugar de `alert`.
5. Crear pruebas de `AuthService` y `authGuard`.

## 7. Guion de 60 segundos para contar el proyecto

"Construi una SPA en Angular standalone con login y rutas protegidas. Modele la autenticacion en un `AuthService` singleton usando signals para estado reactivo, y agregue un `authGuard` funcional con `inject()` para controlar acceso a rutas privadas. Configure enrutado y bootstrap con APIs modernas de Angular (`bootstrapApplication`, `provideRouter`). El flujo cubre login, acceso a pantalla privada y logout. Como siguiente paso de produccion, lo conectaria a backend con JWT, interceptor HTTP y pruebas unitarias de servicio y guard".

## 8. Errores comunes que te conviene evitar en entrevista

- Mezclar responsabilidad de autenticacion dentro de componentes.
- Hacer `navigate()` imperativo en guard cuando puedes devolver `UrlTree`.
- No saber explicar diferencia entre demo frontend y seguridad real.
- No tener estrategia de tests minima.
- No justificar decisiones tecnicas ("porque si").

## 9. Referencias rapidas del propio proyecto

- Rutas: `src/app/app.routes.ts`
- Guard: `src/app/guards/auth-guard.ts`
- Servicio auth: `src/app/services/auth.ts`
- Login component: `src/app/components/login/login.component.ts`
- Flights component: `src/app/components/flights/flights.component.ts`
- Bootstrap/config: `src/main.ts`, `src/app/app.config.ts`
