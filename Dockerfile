FROM node:gallium-slim as builder

WORKDIR /app

RUN apt update && apt install -y python3 make g++ && ln -sf /usr/bin/python3 /usr/bin/python

COPY . .

RUN npm i && npm i -g sqlite3 && npm rebuild && npm run build \
	&& rm -rf api charts utils index.ts \
	&& cp -R dist/* /app

FROM node:gallium-slim

WORKDIR /app

EXPOSE 80

COPY --from=builder /app /app

CMD [ "node", "index.js" ]