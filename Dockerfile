FROM node:18-slim

# Устанавливаем Python и инструменты сборки для node-gyp
RUN apt update && apt install -y \
    python3 \
    make \
    g++ \
    curl \
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код
COPY . .

CMD ["node", "client.js"]
