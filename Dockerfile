FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -y \
    git cmake g++ make zlib1g-dev libssl-dev gperf \
    pkg-config libreadline-dev libconfig++-dev \
    libtool autoconf automake python3 curl wget

# Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt install -y nodejs

# TDLib
RUN git clone https://github.com/tdlib/td.git /tdlib

RUN mkdir /tdlib/build && \
    cd /tdlib/build && \
    cmake -DCMAKE_BUILD_TYPE=Release .. && \
    cmake --build . --target tdjson -j4 && \
    cmake --build . --target install -j4 && \
    echo "/usr/local/lib" >> /etc/ld.so.conf.d/tdlib.conf && \
    ldconfig

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "client.js"]
