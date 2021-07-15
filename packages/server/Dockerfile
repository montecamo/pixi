FROM node:latest as build

WORKDIR /app

COPY . .

RUN npm i
RUN npm run build

EXPOSE 3000
EXPOSE 3001

ENTRYPOINT ["node", "dist/main"]