# Backend Municipalidad - Setup y Uso

## 🚀 Configuración Inicial

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto con:

```env
# Base de datos
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=tu_password
DATABASE_NAME=municipalidad_db

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRES_IN=24h

# Entorno
NODE_ENV=development
```

### 3. Crear la base de datos
```sql
CREATE DATABASE municipalidad_db;
```

### 4. Ejecutar migraciones (si las hay)
```bash
npm run migration:run
```

### 5. Poblar la base de datos con datos iniciales
```bash
npm run seed
```

### 6. Iniciar el servidor
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## 📋 Endpoints Disponibles

### 🔐 Autenticación (`/auth`)
- `POST /auth/login` - Iniciar sesión
- `POST /auth/logout` - Cerrar sesión
- `POST /auth/register` - Registrar usuario
- `POST /auth/refresh` - Refrescar token
- `POST /auth/reset-password` - Solicitar reset de contraseña
- `POST /auth/change-password` - Cambiar contraseña
- `GET /auth/profile` - Obtener perfil del usuario
- `GET /auth/validate` - Validar token

### 📝 Postulaciones (`/postulaciones`)
- `GET /postulaciones` - Listar todas las postulaciones
- `GET /postulaciones?titulo=busqueda&estado=activa` - Filtrar postulaciones
- `GET /postulaciones/:id` - Obtener postulación por ID
- `POST /postulaciones` - Crear nueva postulación
- `PATCH /postulaciones/:id` - Actualizar postulación
- `DELETE /postulaciones/:id` - Eliminar postulación

### 📋 Requisitos (`/requisitos`)
- `GET /requisitos` - Listar todos los requisitos
- `GET /requisitos?nombre=busqueda&tipo=documento&activo=true` - Filtrar requisitos
- `GET /requisitos?termino=busqueda` - Buscar requisitos por término
- `GET /requisitos/:id` - Obtener requisito por ID
- `POST /requisitos` - Crear nuevo requisito
- `PATCH /requisitos/:id` - Actualizar requisito
- `DELETE /requisitos/:id` - Eliminar requisito

### 📄 Formularios (`/formularios`)
- `GET /formularios` - Listar todos los formularios
- `GET /formularios/:id` - Obtener formulario por ID
- `POST /formularios` - Crear nuevo formulario
- `PATCH /formularios/:id` - Actualizar formulario
- `DELETE /formularios/:id` - Eliminar formulario
- `POST /formularios/descargar` - Descargar documentos (enviar `{ids: [1,2,3]}`)

## 🔑 Credenciales por defecto

Después de ejecutar los seeds, puedes usar:
- **Email:** `admin@municipalidad.cl`
- **Contraseña:** `admin123`

## 📊 Estructura de Datos

### Postulación
```json
{
  "id": 1,
  "titulo": "Analista de Sistemas",
  "descripcion": "Se requiere analista...",
  "fechaCreacion": "2024-01-15T00:00:00.000Z",
  "fechaVencimiento": "2024-02-15T00:00:00.000Z",
  "estado": "activa"
}
```

### Requisito
```json
{
  "id": 1,
  "nombre": "Certificado de Antecedentes",
  "descripcion": "Certificado de antecedentes penales...",
  "tipo": "certificado",
  "obligatorio": true,
  "activo": true,
  "fechaCreacion": "2024-01-15T00:00:00.000Z"
}
```

### Formulario
```json
{
  "id": 1,
  "cargo": "Ingeniero Civil Geotécnico",
  "fechaInicio": "2025-05-13T00:00:00.000Z",
  "fechaTermino": "2025-05-20T00:00:00.000Z",
  "estado": "Activo"
}
```

## 🛠️ Scripts Disponibles

- `npm run start:dev` - Iniciar en modo desarrollo
- `npm run build` - Compilar para producción
- `npm run seed` - Poblar base de datos con datos iniciales
- `npm run migration:generate` - Generar nueva migración
- `npm run migration:run` - Ejecutar migraciones
- `npm run test` - Ejecutar tests

## 🌐 Documentación API

Una vez iniciado el servidor, puedes acceder a la documentación Swagger en:
`http://localhost:3000/api`

## 🔧 Configuración del Frontend

Para conectar tu frontend Angular, asegúrate de que el `environment.ts` tenga:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

## 🚨 Notas Importantes

1. **CORS**: El backend está configurado para aceptar requests desde cualquier origen en desarrollo
2. **JWT**: Los tokens expiran en 24 horas por defecto
3. **Base de datos**: Se usa PostgreSQL con sincronización automática en desarrollo
4. **Validación**: Todos los endpoints tienen validación de datos con class-validator

## 🐛 Troubleshooting

### Error de conexión a la base de datos
- Verifica que PostgreSQL esté ejecutándose
- Confirma las credenciales en el archivo `.env`
- Asegúrate de que la base de datos existe

### Error de JWT
- Verifica que `JWT_SECRET` esté configurado en `.env`
- Confirma que el token no haya expirado

### Error de CORS
- Verifica que el frontend esté haciendo requests a `http://localhost:3000`
- Confirma que el backend esté ejecutándose en el puerto correcto 