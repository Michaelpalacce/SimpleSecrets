FROM node:gallium-alpine

WORKDIR /app

COPY . .

RUN npm i && npm run build

EXPOSE 80
CMD ["node", "dist/index.js"]

