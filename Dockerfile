# Utilizar a imagem base do Node.js
FROM node:18-alpine

# Criar o diretório de trabalho
WORKDIR /app

# Copiar o package.json e o package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código da aplicação
COPY . .

# Build da aplicação
RUN npm run build

# Expor a porta que o NestJS vai rodar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "run", "start:prod"]
