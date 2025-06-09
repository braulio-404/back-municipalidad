# Usar Node.js 18 como imagen base
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Ejecutar la aplicación
CMD ["npm", "run", "start:prod"] 