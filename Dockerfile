# ============================================
# ЭТАП 1: СБОРКА TDLib (с инструментами)
# ============================================
FROM ubuntu:22.04 AS tdlib-builder

ENV DEBIAN_FRONTEND=noninteractive

# Устанавливаем только инструменты для сборки
RUN apt update && apt install -y \
    git cmake g++ make zlib1g-dev libssl-dev gperf \
    pkg-config libreadline-dev libconfig++-dev \
    libtool autoconf automake python3 curl wget

# Клонируем и собираем TDLib
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
# ЭТАП 2: ФИНАЛЬНЫЙ ОБРАЗ (только нужные файлы)
# ============================================
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Копируем только скомпилированные библиотеки с этапа сборки
COPY --from=tdlib-builder /usr/local/lib /usr/local/lib
COPY --from=tdlib-builder /usr/local/include /usr/local/include

# Настраиваем динамический линковщик
RUN echo "/usr/local/lib" >> /etc/ld.so.conf.d/tdlib.conf && ldconfig

# Устанавливаем ТОЛЬКО Node.js (без инструментов сборки)
RUN apt update && apt install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt install -y nodejs && \
    apt remove -y curl && apt autoremove -y

# Очищаем кэш apt
RUN rm -rf /var/lib/apt/lists/*

# Копируем приложение
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# Запускаем бота
CMD ["node", "client.js"]
