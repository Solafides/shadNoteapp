FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit

COPY . .

RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD npx prisma migrate deploy && npm start
