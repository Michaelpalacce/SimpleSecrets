FROM node:gallium-alpine as builder

WORKDIR /app

# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

RUN apk add make g++

COPY . .

RUN npm i && npm i -g sqlite3 && npm rebuild && npm run build \
	&& rm -rf api charts utils index.ts \
	&& cp -R dist/* /app

FROM node:gallium-alpine

WORKDIR /app

EXPOSE 80

COPY --from=builder /app /app

CMD [ "node", "index.js" ]