# Usar Node.js 18 Alpine como imagen base (más liviana y segura)
FROM node:18-alpine

# Instalar dependencias del sistema necesarias para PostgreSQL y otras herramientas
RUN apk add --no-cache postgresql-client curl

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias primero (para mejor caching)
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Crear un usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Cambiar la propiedad de los archivos al usuario nestjs
RUN chown -R nestjs:nodejs /app
USER nestjs

# Exponer el puerto que usará la aplicación
EXPOSE 3000

# Comando de salud para verificar que la aplicación esté funcionando
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/ || exit 1

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start:prod"] 