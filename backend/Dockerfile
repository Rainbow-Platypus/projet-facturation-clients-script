FROM node:14

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run prisma:generate

EXPOSE 5000

CMD ["sh", "-c", "npm run prisma:migrate && npm start"]