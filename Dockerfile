FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# --- Аргументы для переменных окружения (самое важное!) ---
# Объявляем переменные, которые мы хотим получить извне (из Railway)
ARG TELEGRAM_API_ID
ARG TELEGRAM_API_HASH
ARG RESET_SESSION

# --- Превращаем ARG в ENV, чтобы они были видны запущенному приложению ---
ENV TELEGRAM_API_ID=$TELEGRAM_API_ID
ENV TELEGRAM_API_HASH=$TELEGRAM_API_HASH
ENV RESET_SESSION=$RESET_SESSION

# --- Системные зависимости ---
RUN apt update && apt install -y \
    git cmake g++ make zlib1g-dev libssl-dev gperf \
    pkg-config libreadline-dev libconfig++-dev \
    libtool autoconf automake python3 curl wget

# --- Node.js 18 ---
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt install -y nodejs

# --- TDLib ---
RUN rm -rf /tdlib
RUN git clone https://github.com/tdlib/td.git /tdlib

RUN mkdir /tdlib/build && \
    cd /tdlib/build && \
    cmake -DCMAKE_BUILD_TYPE=Release \
          -DTD_ENABLE_JSON=ON \
          -DTD_ENABLE_JNI=OFF \
          -DTD_ENABLE_TESTS=OFF \
          .. && \
    cmake --build . --target tdjson -j4 && \
    cmake --build . --target install -j4 && \
    echo "/usr/local/lib" >> /etc/ld.so.conf.d/tdlib.conf && \
    ldconfig

# --- Приложение ---
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "client.js"]
