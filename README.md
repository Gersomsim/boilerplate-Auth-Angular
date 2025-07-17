# Boilerplate Auth

[![Cobertura de Pruebas](https://img.shields.io/badge/coverage-70.29%25-brightgreen)](./coverage)
[![Angular](https://img.shields.io/badge/Angular-20.0.0-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC.svg)](https://tailwindcss.com/)

## 📋 Descripción

Boilerplate Auth es un boilerplate de Angular que implementa un sistema de autenticación completo utilizando
**Arquitectura Hexagonal** y **Patrón Facade**. El proyecto está diseñado como una base sólida para aplicaciones
empresariales escalables.

## 🏗️ Arquitectura

### Arquitectura Hexagonal (Ports & Adapters)

El proyecto sigue los principios de la Arquitectura Hexagonal, organizando el código en tres capas principales:

```
src/app/
├── core/                    # Dominio y Casos de Uso
│   ├── domain/             # Entidades y Reglas de Negocio
│   │   ├── models/         # Modelos de dominio
│   │   └── repositories/   # Interfaces de repositorios
│   └── application/        # Casos de Uso
│       └── use-cases/      # Lógica de aplicación
├── infrastructure/          # Adaptadores y Implementaciones
│   ├── adapters/           # Implementaciones de repositorios
│   ├── http/               # Servicios HTTP
│   ├── interceptors/       # Interceptores HTTP
│   ├── libraries/          # Librerías externas
│   ├── states/             # Gestión de estado
│   │   ├── facades/        # Patrón Facade
│   │   └── store/          # Store de estado
│   └── di/                 # Inyección de Dependencias
└── utils/                  # Utilidades compartidas
```

### Patrones de Diseño Implementados

- **Arquitectura Hexagonal**: Separación clara entre dominio, aplicación e infraestructura
- **Patrón Facade**: Simplificación de la gestión de estado y servicios
- **Repository Pattern**: Abstracción del acceso a datos
- **Dependency Injection**: Inyección de dependencias con Angular DI
- **Observer Pattern**: Uso de RxJS para programación reactiva

## 🚀 Funcionalidades

### 🔐 Sistema de Autenticación

- **Login**: Autenticación de usuarios con validación de credenciales
- **Registro**: Creación de nuevas cuentas de usuario
- **Recuperación de Contraseña**: Proceso de reset de contraseña
- **Olvidé mi Contraseña**: Solicitud de recuperación por email
- **Gestión de Tokens**: Manejo automático de JWT tokens
- **Protección de Rutas**: Guards para rutas protegidas

### 📊 Dashboard Básico

- **Vista Principal**: Componente dashboard emulando una aplicación ERP
- **Navegación**: Sistema de navegación responsive
- **Notificaciones**: Sistema de notificaciones con Toastr
- **Manejo de Errores**: Gestión centralizada de errores HTTP

## 🛠️ Tecnologías

### Core

- **Angular 20**: Framework principal con standalone components
- **TypeScript 5.8**: Tipado estático y seguridad de tipos
- **RxJS 7.8**: Programación reactiva y manejo de observables

### UI/UX

- **Tailwind CSS 4.1**: Framework de utilidades CSS
- **SCSS**: Preprocesador CSS para estilos personalizados
- **ngx-toastr**: Sistema de notificaciones

### Testing

- **Jest**: Framework de testing
- **@ngneat/spectator**: Utilidades para testing de Angular
- **@faker-js/faker**: Generación de datos de prueba

### Desarrollo

- **ESLint**: Linting de código
- **Prettier**: Formateo de código
- **Angular CLI**: Herramientas de desarrollo

## 📦 Instalación

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Pasos de Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Gersomsim/boilerplate-Auth-Angular
cd boilerplate-Auth-Angular

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar pruebas
npm test

# Linting
npm run lint
npm run lint:fix

# Formateo de código
npm run format
```

## 🔧 Configuración

### Configuración de Tailwind

El proyecto utiliza Tailwind CSS v4 con configuración optimizada para componentes Angular.

## 🏃‍♂️ Uso

### Estructura de Carpetas

```
src/app/
├── core/                    # Lógica de negocio
│   ├── domain/             # Entidades y reglas de dominio
│   └── application/        # Casos de uso
├── infrastructure/          # Implementaciones externas
│   ├── adapters/           # Adaptadores para APIs
│   ├── http/               # Servicios HTTP
│   ├── interceptors/       # Interceptores
│   ├── libraries/          # Librerías externas
│   ├── states/             # Gestión de estado
│   └── di/                 # Inyección de dependencias
└── utils/                  # Utilidades compartidas
```

### Crear un Nuevo Caso de Uso

1. **Definir el modelo en `core/domain/models/`**
2. **Crear la interfaz del repositorio en `core/domain/repositories/`**
3. **Implementar el caso de uso en `core/application/use-cases/`**
4. **Crear el adaptador en `infrastructure/adapters/`**
5. **Implementar el facade en `infrastructure/states/facades/`**

### Ejemplo: Crear un Servicio de Usuario

```typescript
// core/domain/models/user.model.ts
export interface User {
  id: string
  email: string
  name: string
  role: string
}

// core/domain/repositories/user.repository.ts
export interface UserRepository {
  getById(id: string): Observable<User>
  update(user: User): Observable<User>
}

// core/application/use-cases/get-user.usecase.ts
@Injectable()
export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  execute(id: string): Observable<User> {
    return this.userRepository.getById(id)
  }
}
```

## 🧪 Testing

### Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

### Estructura de Pruebas

- **Unit Tests**: Pruebas unitarias para servicios y componentes
- **Integration Tests**: Pruebas de integración para casos de uso
- **E2E Tests**: Pruebas end-to-end (configuración futura)

## 📚 Documentación de APIs

### Interceptores HTTP

- **AddTokenInterceptor**: Agrega automáticamente el token de autenticación
- **LaunchNotificationInterceptor**: Maneja notificaciones de respuestas HTTP

### Servicios Principales

- **HttpService**: Servicio base para peticiones HTTP
- **ErrorHandler**: Manejo centralizado de errores
- **Notification**: Servicio de notificaciones

## 🔒 Seguridad

- **JWT Tokens**: Autenticación basada en tokens
- **Interceptores**: Manejo automático de headers de autorización
- **Validación**: Validación de formularios con Angular Reactive Forms
- **Sanitización**: Prevención de XSS con Angular sanitizer

## 🚀 Despliegue

### Build de Producción

```bash
# Construir para producción
npm run build

# Construir con análisis de bundle
npm run build:analyze
```

### Configuración de Servidor

El proyecto está configurado para funcionar con cualquier servidor web estático (nginx, Apache, etc.).

## 🤝 Contribución

### Convenciones de Commits

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Ejemplos de commits
✨ feat: agregar autenticación con JWT
🐛 fix: corregir validación de formulario de login
📝 docs: actualizar documentación de API
♻️ refactor: optimizar servicio de notificaciones
```

### Estándares de Código

- **ESLint**: Configuración estricta para TypeScript
- **Prettier**: Formateo automático de código
- **Husky**: Hooks de git para validación pre-commit

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas sobre el proyecto:

- Crear un issue en el repositorio
- Revisar la documentación de Angular
- Consultar la guía de Arquitectura Hexagonal

---

**Desarrollado con ❤️ usando Angular, TypeScript y Arquitectura Hexagonal**
