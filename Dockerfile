FROM node:18-slim

# Устанавливаем минимальные системные библиотеки для работы готового TDLib
RUN apt update && apt install -y \
    libc6 \
    libstdc++6 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install --production

# Копируем исходный код
COPY . .

# Запускаем бота
CMD ["node", "client.js"]
