FROM node:gallium-slim

WORKDIR /app

COPY . .

# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apt update -y  \
    && apt install -y python3 g++ make libsqlite3-dev &&  \
    ln -sf python3 /usr/bin/python && \
    npm i --build-from-source --sqlite=/usr/local &&  \
    npm rebuild &&  \
    npm run build && \
    npm prune --production && \
    rm -rf api charts utils index.ts &&  \
    cp -R dist/* /app && \
    apt purge -y python3 g++ make && \
    apt autoremove -y

ENV DB_PATH=/data
EXPOSE 80

CMD [ "node", "index.js" ]
