FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Обновляем систему
RUN apt update && apt upgrade -y

# Устанавливаем зависимости для сборки TDLib
RUN apt install -y \
    git \
    cmake \
    g++ \
    make \
    zlib1g-dev \
    libssl-dev \
    libreadline-dev \
    libconfig++-dev \
    libc++-dev \
    libc++abi-dev \
    gperf \
    php-cli \
    php-mbstring \
    php-xml \
    wget \
    curl \
    python3 \
    pkg-config \
    libtool \
    autoconf \
    automake

# Устанавливаем Node.js 18 (поддерживает optional chaining)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt install -y nodejs

# Скачиваем TDLib
RUN git clone https://github.com/tdlib/td.git /tdlib

# Собираем TDLib
RUN mkdir /tdlib/build
WORKDIR /tdlib/build
RUN cmake -DCMAKE_BUILD_TYPE=Release ..
RUN cmake --build . --target install -j4

# Переходим к приложению
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV LD_LIBRARY_PATH=/usr/local/lib

CMD ["node", "client.js"]
