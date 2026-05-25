# ============================================
# ЭТАП 1: СБОРКА TDLib
# ============================================
FROM ubuntu:22.04 AS tdlib-builder

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -y \
    git cmake g++ make zlib1g-dev libssl-dev gperf \
    pkg-config libreadline-dev libconfig++-dev \
    libtool autoconf automake python3 curl wget \
    && rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/tdlib/td.git /tdlib
RUN mkdir /tdlib/build && cd /tdlib/build && \
    cmake -DCMAKE_BUILD_TYPE=Release \
          -DTD_ENABLE_JSON=ON \
          -DTD_ENABLE_JNI=OFF \
          -DTD_ENABLE_TESTS=OFF \
          .. && \
    cmake --build . --target tdjson -j4 && \
    cmake --build . --target install -j4

# ============================================
# ЭТАП 2: ФИНАЛЬНЫЙ ОБРАЗ
# ============================================
FROM node:18-slim

# Копируем скомпилированные библиотеки TDLib
COPY --from=tdlib-builder /usr/local/lib /usr/local/lib
RUN echo "/usr/local/lib" >> /etc/ld.so.conf.d/tdlib.conf && ldconfig

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код бота
COPY . .

CMD ["node", "client.js"]
