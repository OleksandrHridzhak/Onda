# Onda Sync Server

Легкий сервер синхронізації для додатку Onda.

## Встановлення

```bash
cd sync-server
npm install
```

## Запуск

```bash
npm start
```

Сервер запуститься на порті 3001 (можна змінити через змінну оточення PORT).

## API Endpoints

### Health Check
```
GET /health
```

### Отримати дані (Pull)
```
GET /sync/data
Headers: x-secret-key: YOUR_SECRET_KEY
```

### Відправити дані (Push)
```
POST /sync/push
Headers: x-secret-key: YOUR_SECRET_KEY
Body: {
  "data": {...},
  "clientVersion": 1
}
```

### Синхронізувати (Pull з перевіркою конфліктів)
```
POST /sync/pull
Headers: x-secret-key: YOUR_SECRET_KEY
Body: {
  "clientVersion": 1,
  "clientLastSync": "2024-01-01T00:00:00.000Z"
}
```

### Видалити дані
```
DELETE /sync/data
Headers: x-secret-key: YOUR_SECRET_KEY
```

## Деплой

Сервер можна задеплоїти на будь-якому безкоштовному хостингу:
- **Render.com** (рекомендовано)
- **Railway.app**
- **Fly.io**
- **Heroku** (безкоштовний план)

### Приклад деплою на Render:
1. Створіть новий Web Service
2. Підключіть репозиторій
3. Встановіть:
   - Build Command: `cd sync-server && npm install`
   - Start Command: `cd sync-server && npm start`
4. Додайте змінну оточення PORT (Render встановить автоматично)

## Безпека

- Секретний ключ повинен бути мінімум 8 символів
- Дані зберігаються окремо для кожного ключа
- Використовуйте HTTPS в production
