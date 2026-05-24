FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Обновляем систему
RUN apt update && apt upgrade -y

# Устанавливаем зависимости для сборки TDLib
RUN apt install -y \
    git cmake g++ make zlib1g-dev libssl-dev gperf \
    pkg-config libreadline-dev libconfig++-dev \
    libtool autoconf automake python3 curl wget

# Устанавливаем Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt install -y nodejs

# Скачиваем TDLib
RUN git clone https://github.com/tdlib/td.git /tdlib

# Собираем TDLib
RUN mkdir /tdlib/build && \
    cd /tdlib/build && \
    cmake -DCMAKE_BUILD_TYPE=Release .. && \
    cmake --build . --target install -j4

# ОБЯЗАТЕЛЬНО: обновляем кеш библиотек
RUN ldconfig

# Переходим к приложению
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Запускаем клиент
CMD ["node", "client.js"]
