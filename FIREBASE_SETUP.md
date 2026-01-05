# 🎁 Amigo Invisible 2026

Aplicación web para gestionar los regalos del amigo invisible con Firebase Authentication y Firestore.

## 🚀 Características

- ✅ Autenticación con Google
- ✅ Base de datos en tiempo real con Firestore
- ✅ Gestión de participantes
- ✅ Lista de regalos por participante
- ✅ Validación de presupuesto máximo (15€)
- ✅ URLs de productos e imágenes
- ✅ Actualización en tiempo real

## 📦 Tecnologías

- **React 19** + TypeScript
- **Vite** - Build tool
- **Firebase** - Authentication & Firestore
- **pnpm** - Package manager

## 🔧 Configuración

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto (o usa uno existente)
3. Habilita **Authentication** con el proveedor de Google:
   - Ve a Authentication > Sign-in method
   - Habilita "Google"
4. Crea una base de datos **Firestore**:
   - Ve a Firestore Database > Create database
   - Comienza en modo de prueba (o configura reglas personalizadas)

### 3. Reglas de seguridad de Firestore

En Firebase Console > Firestore Database > Rules, configura las siguientes reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leer/escribir participantes solo si el usuario está autenticado
    // y el userId coincide con el usuario autenticado
    match /participants/{participantId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
      
      // Permitir leer/escribir regalos de un participante
      match /gifts/{giftId} {
        allow read, write: if request.auth != null 
          && request.auth.uid == get(/databases/$(database)/documents/participants/$(participantId)).data.userId;
      }
    }
  }
}
```

### 4. Variables de entorno

1. Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

2. En Firebase Console, ve a **Project Settings > General > Your apps**
3. Copia la configuración de Firebase
4. Pega los valores en tu archivo `.env`:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

## 🏃 Ejecutar en desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Build para producción

```bash
pnpm build
```

Los archivos estáticos se generarán en la carpeta `dist/`

## 📊 Estructura de datos en Firestore

### Collection: `participants`

```typescript
{
  id: string (auto-generado),
  name: string,
  userId: string,
  createdAt: timestamp
}
```

### Subcollection: `participants/{participantId}/gifts`

```typescript
{
  id: string (auto-generado),
  title: string,
  price: number,
  url?: string,
  imageUrl?: string
}
```

## 🎯 Uso

1. **Inicia sesión** con tu cuenta de Google
2. **Añade participantes** con el formulario
3. **Añade regalos** haciendo clic en "Añadir regalo"
4. Cada regalo puede tener:
   - Título
   - Precio (con validación de máximo 15€)
   - URL de compra (opcional)
   - URL de imagen (opcional)
5. Los datos se sincronizan automáticamente en tiempo real

## 🔒 Seguridad

- Los usuarios solo pueden ver y editar sus propios participantes
- La autenticación es obligatoria
- Las reglas de Firestore protegen los datos
- Las variables de entorno no se suben al repositorio

## 📝 Notas

- El presupuesto máximo por participante es de **15€**
- Los datos persisten en Firebase
- Múltiples usuarios pueden usar la app simultáneamente
- Cada usuario tiene sus propios participantes aislados

## 🛠️ Desarrollo futuro

Posibles mejoras:

- [ ] Sorteo automático del amigo invisible
- [ ] Compartir lista con otros usuarios
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] Exportar lista a PDF
- [ ] Upload directo de imágenes a Firebase Storage

---

Desarrollado con ❤️ para facilitar tu amigo invisible
