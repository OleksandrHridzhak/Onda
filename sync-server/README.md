# Onda Sync Server

Легкий сервер синхронізації для додатку Onda з підтримкою MongoDB Atlas.

## Встановлення

```bash
cd sync-server
npm install
```

## Налаштування MongoDB Atlas

### 1. Створіть безкоштовний кластер на MongoDB Atlas

1. Перейдіть на [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Зареєструйтеся або увійдіть
3. Створіть новий безкоштовний кластер (M0)
4. Додайте користувача бази даних (Database Access)
5. Додайте IP адресу `0.0.0.0/0` для доступу з будь-якого місця (Network Access)

### 2. Отримайте Connection String

1. Натисніть "Connect" на вашому кластері
2. Виберіть "Connect your application"
3. Скопіюйте connection string (починається з `mongodb+srv://...`)
4. Замініть `<password>` на ваш пароль

Приклад connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/onda-sync?retryWrites=true&w=majority
```

### 3. Встановіть змінну оточення

```bash
export MONGODB_URI="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/onda-sync?retryWrites=true&w=majority"
```

## Запуск локально

```bash
# Встановіть MONGODB_URI
export MONGODB_URI="your-connection-string-here"

# Запустіть сервер
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

## Деплой на Render.com

### Швидкий деплой (рекомендовано)

1. Створіть новий **Web Service** на [render.com](https://render.com)
2. Підключіть репозиторій GitHub
3. Встановіть налаштування:
   - **Name**: `onda-sync`
   - **Region**: Виберіть найближчий
   - **Branch**: `main` (або ваша гілка)
   - **Root Directory**: `sync-server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Додайте змінну оточення**:
   - Клік на "Environment"
   - Додайте змінну:
     - Key: `MONGODB_URI`
     - Value: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/onda-sync?retryWrites=true&w=majority`

5. Клік "Create Web Service"

Ваш сервер буде доступний за адресою: `https://your-app-name.onrender.com`

### Важливо ⚠️

- **MongoDB Atlas безкоштовний навіть коли сервер "спить"** - дані не видаляються!
- Render.com може "усипити" безкоштовний сервер після 15 хвилин неактивності
- Перший запит після сну може зайняти 30-60 секунд (cold start)
- Для виробництва рекомендується платний план ($7/міс) для постійної роботи

## Деплой на інших платформах

### Railway.app

```bash
# Встановіть Railway CLI
npm i -g @railway/cli

# Увійдіть
railway login

# Створіть проект
railway init

# Додайте змінну оточення
railway variables set MONGODB_URI="your-connection-string"

# Задеплойте
railway up
```

### Fly.io

```bash
# Встановіть Fly CLI
curl -L https://fly.io/install.sh | sh

# Увійдіть
fly auth login

# Запустіть з директорії sync-server
fly launch

# Встановіть secret
fly secrets set MONGODB_URI="your-connection-string"
```

## Тестування

```bash
npm test
```

## Переваги MongoDB Atlas

✅ **Безкоштовний план** - 512 MB сховища  
✅ **Дані не видаляються** - навіть коли сервер спить  
✅ **Автоматичні backup**  
✅ **Швидкий** - розподілені сервери по всьому світу  
✅ **Надійний** - 99.99% uptime  
✅ **Масштабується** - легко збільшити при необхідності  

## Безпека

- Секретний ключ повинен бути мінімум 8 символів
- Дані зберігаються окремо для кожного ключа
- Використовуйте HTTPS в production (автоматично на Render/Railway/Fly)
- Ніколи не публікуйте ваш MONGODB_URI connection string!

