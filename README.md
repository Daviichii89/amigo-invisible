# 🎁 Amigo Invisible 2026

> Aplicación web moderna para gestionar grupos de amigo invisible con Firebase y React

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.7-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Características

- 🔐 **Autenticación con Google** - Login seguro y rápido
- 👥 **Gestión de grupos** - Crea y únete a múltiples grupos
- 🎯 **Sistema de roles** - Administradores y participantes con permisos diferenciados
- 💝 **Listas de regalos** - Añade productos con imagen, precio y enlace
- 💰 **Control de presupuesto** - Personaliza el límite por grupo
- 🔄 **Tiempo real** - Sincronización automática con Firestore
- 🌐 **Multiidioma** - Español e Inglés con cambio en vivo
- 📱 **Responsive** - Diseño adaptado a móvil, tablet y desktop
- 🎨 **Design System** - Componentes reutilizables y consistentes

## 🚀 Demo rápida

1. **Administrador** crea un grupo → Se genera código de invitación (ej: `ABC123`)
2. **Comparte el código** → WhatsApp, email, etc.
3. **Participantes se unen** → Con el código y su cuenta Google
4. **Cada uno añade su lista** → Solo pueden editar su propia lista
5. **Todos ven todas las listas** → Para saber qué regalar

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **React** | 19.2 | Framework UI |
| **TypeScript** | 5.9 | Type safety |
| **Vite** | 7.2 | Build tool & dev server |
| **Firebase** | 12.7 | Auth + Firestore |
| **Tailwind CSS** | 4.1 | Styling |
| **React Router** | 7.11 | SPA navigation |
| **pnpm** | 10.6 | Package manager |

## 📦 Instalación

### Prerrequisitos

- Node.js 18+
- pnpm 10+
- Cuenta de Firebase

### 1. Clonar el repositorio

```bash
git clone https://github.com/Daviichii89/amigo-invisible.git
cd amigo-invisible
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar Firebase

Sigue las instrucciones en [QUICKSTART.md](./QUICKSTART.md) para:
- Crear proyecto en Firebase
- Habilitar Authentication (Google)
- Crear base de datos Firestore
- Configurar reglas de seguridad

### 4. Variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Firebase:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 5. Ejecutar en desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Design System (Button, Input, Modal, etc.)
│   ├── LoginPage.tsx
│   ├── HomePage.tsx
│   ├── CreateGroupPage.tsx
│   ├── JoinGroupPage.tsx
│   ├── GroupViewPage.tsx
│   ├── ParticipantCard.tsx
│   └── AddGiftForm.tsx
├── contexts/           # React Contexts
│   ├── AuthContext.tsx
│   └── I18nContext.tsx
├── hooks/             # Custom Hooks
│   ├── useFirestore.ts
│   ├── useModal.ts
│   └── useCopyToClipboard.ts
├── i18n/              # Traducciones
│   ├── es.ts
│   └── en.ts
├── lib/               # Configuración
│   └── firebase.ts
└── types.ts           # TypeScript types
```

## 🏗️ Arquitectura de Datos

### Firestore Structure

```
groups/{groupId}
  ├── name: string
  ├── adminUserId: string
  ├── maxBudget: number
  ├── inviteCode: string
  ├── createdAt: timestamp
  │
  ├── participants/{participantId}
  │   ├── name: string
  │   ├── email: string
  │   ├── userId?: string
  │   ├── createdAt: timestamp
  │   │
  │   └── gifts/{giftId}
  │       ├── title: string
  │       ├── price: number
  │       ├── url?: string
  │       └── imageUrl?: string
  │
  └── members/{memberId}
      ├── userId: string
      ├── role: 'admin' | 'member'
      ├── participantId?: string
      └── joinedAt: timestamp
```

### Reglas de Seguridad

- **Administradores**: Control total del grupo (CRUD participantes y regalos)
- **Miembros**: Solo editan su propia lista de regalos
- **Lectura**: Todos los miembros pueden ver todas las listas

Ver [QUICKSTART.md](./QUICKSTART.md) para reglas completas de Firestore.

## 🎨 Design System

Componentes UI reutilizables en `src/components/ui/`:

- **Button** - 5 variantes (primary, secondary, danger, success, ghost)
- **Input** - Con label y manejo de errores
- **Modal** - Para alertas, confirmaciones y errores
- **BackButton** - Navegación consistente
- **InfoBox** - Cajas informativas
- **Skeleton** - Placeholders de carga
- **Accordion** - Contenido colapsable

## 🌐 Internacionalización (i18n)

Cambio de idioma en tiempo real entre Español e Inglés:
- Persistencia en `localStorage`
- Detección automática del idioma del navegador
- +100 claves de traducción
- Función `tReplace()` para interpolación de variables

## 🚀 Deployment

### Build de producción

```bash
pnpm build
```

Los archivos estáticos se generan en `dist/`

### Deploy en Vercel

```bash
vercel --prod
```

El proyecto incluye `vercel.json` para SPA routing correcto.

## 📝 Scripts Disponibles

```bash
pnpm dev        # Servidor de desarrollo
pnpm build      # Build para producción
pnpm preview    # Preview del build
pnpm lint       # Linter ESLint
```

## 🔐 Seguridad

- ✅ Autenticación obligatoria
- ✅ Reglas de Firestore basadas en roles
- ✅ Variables de entorno no versionadas
- ✅ Validación client-side y server-side
- ✅ CORS configurado en Firebase

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 📚 Documentación

- [QUICKSTART.md](./QUICKSTART.md) - Guía completa de configuración y setup de Firebase

## 🙏 Agradecimientos

Desarrollado con ❤️ para facilitar la organización del amigo invisible.

---

**¿Preguntas o sugerencias?** Abre un [issue](https://github.com/Daviichii89/amigo-invisible/issues) o contáctame.