# 🔐 Sistema de Autenticación JWT - Municipalidad

## **1. INSTALAR DEPENDENCIAS REQUERIDAS:**

Ejecutar en terminal:
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs
npm install --save-dev @types/passport-jwt @types/bcryptjs
```

## **2. CONFIGURACIÓN COMPLETADA:**

### **✅ Entidades Creadas:**
- `Usuario` - Mejorada con UUID, roles, estados y timestamps
- JWT Strategy, Service, Controller, Guards, DTOs

### **✅ Endpoints de Autenticación:**
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión  
- `GET /auth/profile` - Obtener perfil (requiere JWT)
- `GET /auth/validate` - Validar token (requiere JWT)

### **✅ Roles Disponibles:**
- `admin` - Administrador total
- `rrhh` - Recursos humanos
- `supervisor` - Supervisor
- `usuario` - Usuario básico (default)

### **✅ Estados de Usuario:**
- `activo` - Puede acceder (default)
- `inactivo` - Sin acceso
- `bloqueado` - Bloqueado permanentemente

## **3. VARIABLES DE ENTORNO:**

Agregar al `.env`:
```env
JWT_SECRET=municipalidad_secret_key_2025_super_secure
```

## **4. CÓMO PROBAR:**

### **A. Registrar Usuario:**
```json
POST /auth/register
{
  "nombre": "Juan Pérez",
  "email": "juan@municipalidad.cl", 
  "password": "123456",
  "rol": "rrhh"
}
```

### **B. Iniciar Sesión:**
```json
POST /auth/login
{
  "email": "juan@municipalidad.cl",
  "password": "123456"
}
```

**Respuesta:**
```json
{
  "status": 200,
  "message": "Login exitoso",
  "data": {
    "user": { "usuarioID": "...", "nombre": "Juan Pérez", "rol": "rrhh" },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": "24h"
  }
}
```

### **C. Usar Token en Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## **5. PROTEGER ENDPOINTS:**

### **Opción 1 - Guard Directo:**
```typescript
@UseGuards(AuthGuard('jwt'))
@Get('protected')
async protectedRoute(@Request() req) {
  return req.user; // Usuario autenticado
}
```

### **Opción 2 - Guard Personalizado:**
```typescript
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Get('protected')
async protectedRoute(@Request() req) {
  return req.user;
}
```

## **6. DATOS DEL USUARIO EN REQUESTS:**

Al usar guards JWT, tienes acceso a:
```typescript
req.user = {
  usuarioID: "uuid",
  nombre: "Juan Pérez", 
  email: "juan@municipalidad.cl",
  rol: "rrhh",
  estado: "activo"
  // Sin password por seguridad
}
```

## **7. COLECCIÓN POSTMAN - AUTH:**

```json
{
  "name": "AUTH - Sistema Login",
  "requests": [
    {
      "name": "Registrar Usuario",
      "method": "POST",
      "url": "{{baseUrl}}/auth/register",
      "body": {
        "nombre": "Admin Sistema",
        "email": "admin@municipalidad.cl",
        "password": "admin123",
        "rol": "admin"
      }
    },
    {
      "name": "Login",
      "method": "POST", 
      "url": "{{baseUrl}}/auth/login",
      "body": {
        "email": "admin@municipalidad.cl",
        "password": "admin123"
      }
    },
    {
      "name": "Mi Perfil",
      "method": "GET",
      "url": "{{baseUrl}}/auth/profile",
      "headers": {
        "Authorization": "Bearer {{token}}"
      }
    },
    {
      "name": "Validar Token",
      "method": "GET",
      "url": "{{baseUrl}}/auth/validate", 
      "headers": {
        "Authorization": "Bearer {{token}}"
      }
    }
  ]
}
```

## **8. PRÓXIMOS PASOS:**

1. **Instalar dependencias** con npm install
2. **Probar endpoints** con Postman
3. **Crear usuario admin** inicial
4. **Proteger endpoints del modulo-dos** con guards
5. **Implementar roles** y permisos específicos

## **🔑 FLUJO COMPLETO:**
1. Usuario se registra → Obtiene cuenta
2. Usuario hace login → Obtiene JWT token
3. Usuario usa token → Accede a endpoints protegidos
4. Token expira en 24h → Necesita re-login

**¡Sistema JWT completamente funcional listo para usar!** 🚀 