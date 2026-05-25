FROM node:18-slim

# Устанавливаем необходимые системные пакеты для установки npm-зависимостей
# (libc6, libstdc++6, ca-certificates уже есть; добавляем curl и wget для скачивания бинарников tdl-tdlib-addon)
RUN apt update && apt install -y \
    curl \
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости (без --production)
RUN npm install

# Копируем исходный код
COPY . .

# Запускаем бота
CMD ["node", "client.js"]
