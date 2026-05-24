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
