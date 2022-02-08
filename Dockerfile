FROM node:gallium-slim as builder

WORKDIR /app

# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apt update -y && apt install -y python3 g++ make libsqlite3-dev && ln -sf python3 /usr/bin/python

COPY . .

RUN npm i -g sqlite3 --build-from-source --sqlite=/usr/local && \
    npm i &&  \
    npm rebuild &&  \
    npm run build && \
    rm -rf api charts utils index.ts &&  \
    cp -R dist/* /app

FROM node:gallium-slim

EXPOSE 80
ENV DB_PATH=/data

WORKDIR /app

COPY --from=builder /app /app

CMD [ "node", "index.js" ]
