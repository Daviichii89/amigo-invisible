# 🚀 Inicio Rápido - Firebase Setup (Arquitectura de Grupos)

## Pasos para configurar Firebase:

### 1️⃣ Crea tu proyecto en Firebase
```
https://console.firebase.google.com/
→ Crear proyecto nuevo
```

### 2️⃣ Habilita Authentication
```
→ Authentication
→ Sign-in method
→ Google (Habilitar)
```

### 3️⃣ Crea Firestore Database
```
→ Firestore Database
→ Create database
→ Modo de prueba (o configura reglas)
```

### 4️⃣ Configura las reglas de seguridad
En Firestore > Rules, copia el contenido del archivo `firestore.rules` que está en la raíz del proyecto.

O pega esto directamente:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /groups/{groupId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.adminUserId;
      allow update, delete: if request.auth != null 
        && request.auth.uid == resource.data.adminUserId;
      
      match /participants/{participantId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow update: if request.auth != null 
          && (request.auth.uid == get(/databases/$(database)/documents/groups/$(groupId)).data.adminUserId
              || request.auth.uid == resource.data.userId);
        allow delete: if request.auth != null 
          && request.auth.uid == get(/databases/$(database)/documents/groups/$(groupId)).data.adminUserId;
        
        match /gifts/{giftId} {
          allow read: if request.auth != null;
          allow create, update, delete: if request.auth != null 
            && (request.auth.uid == get(/databases/$(database)/documents/groups/$(groupId)).data.adminUserId
                || request.auth.uid == get(/databases/$(database)/documents/groups/$(groupId)/participants/$(participantId)).data.userId);
        }
      }
      
      match /members/{memberId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow update, delete: if request.auth != null 
          && request.auth.uid == get(/databases/$(database)/documents/groups/$(groupId)).data.adminUserId;
      }
    }
  }
}
```

### 5️⃣ Copia tu configuración
```
→ Project Settings (⚙️)
→ General
→ Your apps
→ Web app (</>) o crea una nueva
→ Copia la configuración
```

### 6️⃣ Crea tu archivo .env
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123
```

### 7️⃣ Ejecuta la app
```bash
pnpm dev
```

## 📁 Estructura creada:

```
src/
├── lib/
│   └── firebase.ts              # Configuración de Firebase
├── contexts/
│   └── AuthContext.tsx          # Context de autenticación
├── hooks/
│   └── useFirestore.ts          # Hooks para Firestore (grupos y participantes)
├── components/
│   ├── LoginPage.tsx            # Página de login
│   ├── HomePage.tsx             # Lista de grupos del usuario
│   ├── CreateGroupPage.tsx      # Formulario crear grupo
│   ├── JoinGroupPage.tsx        # Unirse con código
│   ├── GroupViewPage.tsx        # Vista del grupo
│   ├── ParticipantCard.tsx      # Tarjeta de participante con regalos
│   └── AddGiftForm.tsx          # Formulario añadir regalo
└── types.ts                     # Tipos: Group, Participant, Gift, Member
```

## 🎯 Estructura de datos en Firestore:

```
groups (collection)
  └── {groupId} (document)
      ├── name: string
      ├── adminUserId: string
      ├── maxBudget: number
      ├── inviteCode: string (6 caracteres)
      ├── createdAt: timestamp
      │
      ├── participants (subcollection)
      │   └── {participantId} (document)
      │       ├── name: string
      │       ├── email: string
      │       ├── userId?: string (opcional)
      │       ├── createdAt: timestamp
      │       │
      │       └── gifts (subcollection)
      │           └── {giftId} (document)
      │               ├── title: string
      │               ├── price: number
      │               ├── url?: string
      │               └── imageUrl?: string
      │
      └── members (subcollection)
          └── {memberId} (document)
              ├── userId: string
              ├── role: 'admin' | 'member'
              ├── participantId?: string
              └── joinedAt: timestamp
```

## ✅ Lo que ya funciona:

### 👑 **Como Administrador:**
- ✅ Crear grupos de amigo invisible
- ✅ Generar código de invitación automático
- ✅ Ver todos los participantes y sus listas
- ✅ Añadir participantes manualmente (sin cuenta)
- ✅ Editar cualquier lista de regalos
- ✅ Eliminar participantes

### 👥 **Como Participante:**
- ✅ Unirse a grupo con código
- ✅ Se crea automáticamente tu participante
- ✅ Añadir/editar SOLO tu propia lista de regalos
- ✅ Ver las listas de otros participantes (para saber qué regalar)

### 🎁 **Funcionalidades generales:**
- ✅ Autenticación con Google
- ✅ Tiempo real (sincronización automática)
- ✅ Validación de presupuesto personalizable
- ✅ Imágenes y URLs en regalos
- ✅ Seguridad por roles (admin/member)
- ✅ Múltiples grupos por usuario

## 🔐 Seguridad:

- **Administradores** pueden gestionar todo el grupo
- **Participantes** solo editan su propia lista
- Todos pueden ver todas las listas (característica del amigo invisible)
- Las reglas de Firestore validan permisos
- El `.env` está en `.gitignore`

## 📝 Flujo de uso:

1. **Admin crea grupo** → Se genera código (ej: ABC123)
2. **Admin comparte código** → WhatsApp, email, etc.
3. **Participantes se unen** → Automáticamente se crean como participantes
4. **Cada uno añade su lista** → Solo pueden editar la suya
5. **Todos ven todas las listas** → Para saber qué regalar
6. **(Futuro) Sorteo** → Asignar quién regala a quién

## 📝 Siguiente paso:

¡Configura tu Firebase y empieza a probar! 🎉

### Comandos útiles:
```bash
pnpm dev          # Desarrollo
pnpm build        # Producción
pnpm preview      # Preview producción
```
