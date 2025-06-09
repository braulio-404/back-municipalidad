# 📋 **POSTMAN - Módulo Postulante**

## **🏠 URL Base**
```
http://localhost:3000/postulante
```

---

## **📑 ENDPOINTS DISPONIBLES**

### **1. ✅ Crear Postulante**
- **Método:** `POST`
- **URL:** `http://localhost:3000/postulante/crear-postulante`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON):**
```json
{
  "nombres": "Juan Carlos",
  "apellidoPaterno": "González",
  "apellidoMaterno": "Pérez",
  "rut": "12345678-9",
  "email": "juan.gonzalez@gmail.com",
  "telefono": "+56912345678",
  "fechaNacimiento": "1990-05-15",
  "genero": "masculino",
  "nacionalidad": "Chilena",
  "region": "Metropolitana",
  "comuna": "Santiago",
  "direccion": "Av. Libertador 1234, Depto 45",
  "nivelEducacion": "universitario",
  "profesion": "Ingeniero Civil",
  "experienciaLaboral": "3-5 años",
  "habilidades": "JavaScript, Node.js, React, SQL, Trabajo en equipo, Liderazgo",
  "idiomas": "Español nativo, Inglés avanzado",
  "pretensionSalarial": 1500000,
  "disponibilidad": "inmediata",
  "modalidadPreferida": "híbrido",
  "jornadaPreferida": "completa",
  "estado": "activo",
  "sobreMi": "Soy un profesional proactivo con experiencia en desarrollo de software y gestión de proyectos. Me gusta trabajar en equipo y estoy siempre dispuesto a aprender nuevas tecnologías.",
  "servicioMilitarCompleto": true
}
```

### **2. 📋 Obtener Todos los Postulantes**
- **Método:** `GET`
- **URL:** `http://localhost:3000/postulante`
- **Headers:** Ninguno
- **Body:** Ninguno

### **3. 🔍 Obtener Postulante por ID**
- **Método:** `GET`
- **URL:** `http://localhost:3000/postulante/{postulanteID}`
- **Ejemplo:** `http://localhost:3000/postulante/550e8400-e29b-41d4-a716-446655440000`
- **Headers:** Ninguno
- **Body:** Ninguno

### **4. 🆔 Buscar Postulante por RUT**
- **Método:** `GET`
- **URL:** `http://localhost:3000/postulante/rut/{rut}`
- **Ejemplo:** `http://localhost:3000/postulante/rut/12345678-9`
- **Headers:** Ninguno
- **Body:** Ninguno

### **5. 📧 Buscar Postulante por Email**
- **Método:** `GET`
- **URL:** `http://localhost:3000/postulante/email/{email}`
- **Ejemplo:** `http://localhost:3000/postulante/email/juan.gonzalez@gmail.com`
- **Headers:** Ninguno
- **Body:** Ninguno

### **6. 🔄 Buscar Postulantes por Estado**
- **Método:** `GET`
- **URL:** `http://localhost:3000/postulante/estado/{estado}`
- **Ejemplos:**
  - `http://localhost:3000/postulante/estado/activo`
  - `http://localhost:3000/postulante/estado/inactivo`
  - `http://localhost:3000/postulante/estado/pausado`
- **Headers:** Ninguno
- **Body:** Ninguno

### **7. 💼 Buscar Postulantes por Profesión**
- **Método:** `GET`
- **URL:** `http://localhost:3000/postulante/profesion/{profesion}`
- **Ejemplo:** `http://localhost:3000/postulante/profesion/Ingeniero Civil`
- **Headers:** Ninguno
- **Body:** Ninguno

### **8. ✏️ Actualizar Postulante**
- **Método:** `PATCH`
- **URL:** `http://localhost:3000/postulante/{postulanteID}`
- **Ejemplo:** `http://localhost:3000/postulante/550e8400-e29b-41d4-a716-446655440000`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON) - Ejemplo actualización parcial:**
```json
{
  "telefono": "+56987654321",
  "profesion": "Ingeniero de Software",
  "experienciaLaboral": "5+ años",
  "pretensionSalarial": 1800000,
  "modalidadPreferida": "remoto",
  "habilidades": "JavaScript, Node.js, React, Vue.js, Docker, AWS, Liderazgo de equipos"
}
```

### **9. 🗑️ Eliminar Postulante**
- **Método:** `DELETE`
- **URL:** `http://localhost:3000/postulante/{postulanteID}`
- **Ejemplo:** `http://localhost:3000/postulante/550e8400-e29b-41d4-a716-446655440000`
- **Headers:** Ninguno
- **Body:** Ninguno

---

## **📊 RESPUESTAS ESPERADAS**

### **✅ Respuesta Exitosa (200)**
```json
{
  "status": 200,
  "message": "Postulante creado exitosamente",
  "data": {
    "postulanteID": "550e8400-e29b-41d4-a716-446655440000",
    "nombres": "Juan Carlos",
    "apellidoPaterno": "González",
    "apellidoMaterno": "Pérez",
    "rut": "12345678-9",
    "email": "juan.gonzalez@gmail.com",
    "telefono": "+56912345678",
    "fechaNacimiento": "1990-05-15T00:00:00.000Z",
    "genero": "masculino",
    "nacionalidad": "Chilena",
    "region": "Metropolitana",
    "comuna": "Santiago",
    "direccion": "Av. Libertador 1234, Depto 45",
    "nivelEducacion": "universitario",
    "profesion": "Ingeniero Civil",
    "experienciaLaboral": "3-5 años",
    "habilidades": "JavaScript, Node.js, React, SQL, Trabajo en equipo, Liderazgo",
    "idiomas": "Español nativo, Inglés avanzado",
    "pretensionSalarial": 1500000,
    "disponibilidad": "inmediata",
    "modalidadPreferida": "híbrido",
    "jornadaPreferida": "completa",
    "estado": "activo",
    "sobreMi": "Soy un profesional proactivo...",
    "servicioMilitarCompleto": true,
    "fechaRegistro": "2025-01-06T10:30:00.000Z"
  }
}
```

### **📋 Respuesta FindAll (200)**
```json
{
  "status": 200,
  "message": "Postulantes obtenidos exitosamente",
  "count": 2,
  "data": [
    {
      "postulanteID": "550e8400-e29b-41d4-a716-446655440000",
      "nombres": "Juan Carlos",
      "apellidoPaterno": "González",
      "apellidoMaterno": "Pérez",
      "rut": "12345678-9",
      "email": "juan.gonzalez@gmail.com",
      "telefono": "+56912345678",
      "profesion": "Ingeniero Civil",
      "estado": "activo",
      "fechaRegistro": "2025-01-06T10:30:00.000Z",
      "documentos": [],
      "postulaciones": []
    }
  ]
}
```

### **❌ Error 404 - No Encontrado**
```json
{
  "message": "Postulante no encontrado",
  "error": "Not Found",
  "statusCode": 404
}
```

### **❌ Error 409 - Conflicto (RUT/Email Duplicado)**
```json
{
  "message": "El RUT ya está registrado",
  "error": "Conflict",
  "statusCode": 409
}
```

---

## **🧪 CASOS DE PRUEBA RECOMENDADOS**

### **Test 1: Crear Postulante Completo**
1. Usar el JSON completo del ejemplo
2. Verificar respuesta 200
3. Guardar el `postulanteID` para pruebas siguientes

### **Test 2: Validar RUT Único**
1. Intentar crear otro postulante con el mismo RUT
2. Verificar error 409

### **Test 3: Validar Email Único**
1. Intentar crear postulante con email duplicado
2. Verificar error 409

### **Test 4: Buscar por RUT**
1. Usar RUT del postulante creado
2. Verificar que retorna el postulante correcto

### **Test 5: Actualización Parcial**
1. Actualizar solo algunos campos (ej: teléfono, profesión)
2. Verificar que solo esos campos cambiaron

### **Test 6: Filtros**
1. Crear varios postulantes con diferentes estados/profesiones
2. Probar filtros por estado y profesión
3. Verificar que retorna solo los filtrados

---

## **💡 TIPS PARA POSTMAN**

### **Variables de Entorno:**
```
baseUrl = http://localhost:3000
postulanteId = 550e8400-e29b-41d4-a716-446655440000
```

### **Scripts Pre-request:**
```javascript
// Generar RUT aleatorio para testing
function generarRUT() {
    const numero = Math.floor(Math.random() * 20000000) + 5000000;
    return numero + '-' + (numero % 10);
}

pm.environment.set("rutAleatorio", generarRUT());
```

### **Scripts Post-response:**
```javascript
// Guardar ID del postulante creado
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.data && response.data.postulanteID) {
        pm.environment.set("postulanteId", response.data.postulanteID);
    }
}
```

---

## **📝 CAMPOS OBLIGATORIOS vs OPCIONALES**

### **✅ Obligatorios:**
- `nombres`
- `apellidoPaterno`
- `apellidoMaterno`
- `rut`
- `email`

### **🔧 Opcionales:**
- Todos los demás campos pueden omitirse
- `estado` por defecto será "activo"
- `servicioMilitarCompleto` por defecto será `false`

---

## **🎯 VALORES ENUM VÁLIDOS**

### **Género:**
- `masculino`
- `femenino`
- `otro`

### **Nivel Educación:**
- `básica`
- `media`
- `técnico`
- `universitario`
- `postgrado`

### **Experiencia Laboral:**
- `sin experiencia`
- `1-2 años`
- `3-5 años`
- `5+ años`

### **Disponibilidad:**
- `inmediata`
- `1 semana`
- `2 semanas`
- `1 mes`

### **Modalidad Preferida:**
- `presencial`
- `remoto`
- `híbrido`
- `cualquiera`

### **Jornada Preferida:**
- `completa`
- `media jornada`
- `por turnos`
- `cualquiera`

### **Estado:**
- `activo`
- `inactivo`
- `pausado`

¡Listo para testing! 🚀 