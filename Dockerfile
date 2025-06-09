# Usar Node.js 18 como imagen base
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies para el build)
RUN npm install

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Limpiar devDependencies después del build para reducir tamaño
RUN npm prune --production

# Exponer el puerto
EXPOSE 3000

# Ejecutar la aplicación
CMD ["npm", "run", "start:prod"] 