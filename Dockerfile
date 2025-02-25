# Используем легковесный образ Node.js
FROM node:18-alpine as builder

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем файлы зависимостей и устанавливаем только продакшен-зависимости
COPY package*.json ./
RUN npm install --only=production

# Копируем весь код
COPY . .

# Собираем приложение
RUN npm run build

# Используем минимальный образ для продакшена
FROM node:18-alpine

WORKDIR /usr/src/app

# Копируем только собранные файлы и зависимости
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Указываем порт
EXPOSE 3000

# Переменная окружения (по желанию)
ENV NODE_ENV=production

# Запускаем приложение
CMD ["npm", "run", "start"]
