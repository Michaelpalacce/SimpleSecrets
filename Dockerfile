ARG TAG_VERSION

FROM stefangenov/simplesecretsbuild:$TAG_VERSION as builder

FROM node:gallium-slim

EXPOSE 80
ENV DB_PATH=/data
WORKDIR /app

COPY --from=builder /app /app

CMD [ "node", "index.js" ]