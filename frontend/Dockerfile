# Этап 1: Сборка
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Прокидываем переменную API при сборке (если нужно)
RUN npm run build

# Этап 2: Раздача статики через Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Копируем конфиг Nginx (опционально, для работы React Router)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]