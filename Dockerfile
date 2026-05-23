FROM ubuntu:22.04

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
    wget \
    curl \
    python3 \
    nodejs \
    npm

# Скачиваем TDLib
RUN git clone https://github.com/tdlib/td.git /tdlib

# Собираем TDLib
RUN mkdir /tdlib/build
WORKDIR /tdlib/build
RUN cmake -DCMAKE_BUILD_TYPE=Release ..
RUN cmake --build . --target install -j4

# Создаём рабочую директорию
WORKDIR /app

# Копируем package.json
COPY package*.json ./

# Устанавливаем зависимости Node.js
RUN npm install

# Копируем весь проект
COPY . .

# Указываем путь к собранной библиотеке TDLib
ENV LD_LIBRARY_PATH=/usr/local/lib

# Запускаем бота
CMD ["node", "client.js"]
