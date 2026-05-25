FROM node:18-slim

# Устанавливаем зависимости для работы TDLib
RUN apt update && apt install -y \
    libc6 \
    libstdc++6 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем package.json отдельно для кэширования зависимостей
COPY package*.json ./

# Устанавливаем npm зависимости
RUN npm install

# Копируем весь код приложения
COPY . .

# Запускаем бота
CMD ["node", "client.js"]
