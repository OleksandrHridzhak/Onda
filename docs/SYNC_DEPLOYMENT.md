# Onda Sync - Deployment Guide

## Overview

Onda Sync використовує **MongoDB Atlas** для зберігання даних. MongoDB Atlas - це безкоштовна хмарна база даних, яка **не видаляє дані**, навіть коли ваш сервер не активний.

## Підготовка: Налаштування MongoDB Atlas

### Крок 1: Створіть безкоштовний кластер

1. Перейдіть на [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Натисніть "Try Free" та створіть акаунт (можна через Google/GitHub)
3. Виберіть:
   - **Cloud Provider**: AWS (рекомендовано)
   - **Region**: Виберіть найближчий (наприклад, Frankfurt для України)
   - **Cluster Tier**: M0 Sandbox (FREE - 512 MB)
   - **Cluster Name**: `onda-sync` або будь-яке ім'я
4. Натисніть "Create"

### Крок 2: Створіть користувача бази даних

1. Після створення кластера, перейдіть до "Database Access" (ліве меню)
2. Натисніть "Add New Database User"
3. Виберіть "Password" authentication
4. Введіть:
   - **Username**: `onda-admin` (або інше ім'я)
   - **Password**: Згенеруйте надійний пароль (збережіть його!)
5. Встановіть права: "Read and write to any database"
6. Натисніть "Add User"

### Крок 3: Дозвольте доступ з будь-якого IP

1. Перейдіть до "Network Access" (ліве меню)
2. Натисніть "Add IP Address"
3. Натисніть "Allow Access From Anywhere"
4. Це додасть `0.0.0.0/0` - доступ з будь-якого місця
5. Натисніть "Confirm"

### Крок 4: Отримайте Connection String

1. Поверніться до "Database" (ліве меню)
2. Натисніть "Connect" на вашому кластері
3. Виберіть "Drivers"
4. Виберіть "Node.js" та версію "4.1 or later"
5. Скопіюйте connection string (починається з `mongodb+srv://`)
6. Замініть `<password>` на ваш пароль з Кроку 2
7. Замініть `<dbname>` на `onda-sync`

**Приклад готового connection string:**

```
mongodb+srv://onda-admin:MySecurePassword123@onda-sync.abc123.mongodb.net/onda-sync?retryWrites=true&w=majority
```

**⚠️ ВАЖЛИВО**: Збережіть цей connection string - він вам знадобиться!

---

## Деплой сервера

### Рекомендовано: Render.com (Безкоштовно)

#### Крок 1: Створіть Web Service

1. Створіть акаунт на [render.com](https://render.com)
2. Натисніть "New +" → "Web Service"
3. Підключіть ваш GitHub репозиторій
4. Налаштуйте:
   - **Name**: `onda-sync-server`
   - **Region**: Виберіть найближчий
   - **Branch**: `main` або ваша гілка
   - **Root Directory**: `sync-server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

#### Крок 2: Додайте змінну оточення

1. Прокрутіть вниз до розділу "Environment Variables"
2. Натисніть "Add Environment Variable"
3. Введіть:
   - **Key**: `MONGODB_URI`
   - **Value**: Ваш connection string з MongoDB Atlas (з Кроку 4 вище)

**Приклад:**

```
Key: MONGODB_URI
Value: mongodb+srv://onda-admin:MySecurePassword123@onda-sync.abc123.mongodb.net/onda-sync?retryWrites=true&w=majority
```

4. Натисніть "Create Web Service"

#### Крок 3: Дочекайтеся деплою

1. Render почне деплой (займе 2-3 хвилини)
2. Коли статус буде "Live" - ваш сервер готовий!
3. Скопіюйте URL сервіса (наприклад, `https://onda-sync-server.onrender.com`)

#### Крок 4: Налаштуйте додаток

1. Відкрийте Onda
2. Перейдіть до Settings → Cloud Sync
3. Введіть:
   - **Server URL**: Ваш URL з Render (наприклад, `https://onda-39t4.onrender.com` або `https://onda-sync-server.onrender.com`)
   - **Secret Key**: Згенеруйте або введіть свій (мінімум 8 символів)
4. Натисніть "Test Connection"
5. Якщо "Connection successful" - натисніть "Save Configuration"
6. Готово! Синхронізація працює автоматично

---

### Альтернатива 1: Railway.app

1. Створіть акаунт на [railway.app](https://railway.app)
2. Натисніть "New Project" → "Deploy from GitHub repo"
3. Виберіть ваш репозиторій
4. Налаштуйте:
   - **Root Directory**: `sync-server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Додайте змінну оточення:
   - Перейдіть до "Variables"
   - Додайте `MONGODB_URI` з вашим connection string
6. Railway автоматично надасть URL

**Ціна**: ~$5/місяць (з $5 безкоштовних кредитів)

### Альтернатива 2: Fly.io

```bash
# Встановіть Fly CLI
curl -L https://fly.io/install.sh | sh

# Увійдіть
fly auth login

# З директорії sync-server
cd sync-server
fly launch

# Встановіть змінну оточення
fly secrets set MONGODB_URI="your-mongodb-connection-string"

# Задеплойте
fly deploy
```

**Ціна**: ~$5/місяць (з $5 безкоштовних кредитів)

---

## Переваги MongoDB Atlas + Render

✅ **Повністю безкоштовно**

- MongoDB Atlas M0 - безкоштовно (512 MB)
- Render Free Tier - безкоштовно

✅ **Дані не видаляються**

- MongoDB Atlas зберігає дані постійно
- Навіть коли Render "усипляє" сервер - дані залишаються

✅ **Автоматичні backup**

- MongoDB Atlas робить backup щодня

✅ **Надійно**

- 99.99% uptime від MongoDB Atlas
- Розподілені сервери по всьому світу

✅ **Швидко налаштувати**

- Лише один connection string потрібно встановити
- Все працює одразу

---

## Перевірка роботи

### Тест 1: Health Check

```bash
curl https://onda-39t4.onrender.com/health
```

Повинно повернути:

```json
{
  "status": "ok",
  "mongodb": "connected",
  "timestamp": "2024-12-26T10:00:00.000Z"
}
```

### Тест 2: Синхронізація в додатку

1. Відкрийте Onda на одному пристрої
2. Змініть щось (додайте завдання, змініть мультичекбокс)
3. Дочекайтеся 1-2 секунди (автоматична синхронізація)
4. Відкрийте Onda на іншому пристрої
5. Зміни повинні з'явитися автоматично

---

## Локальне тестування

Для тестування на локальній машині:

```bash
# Встановіть змінну оточення
export MONGODB_URI="your-mongodb-connection-string"

# Запустіть сервер
cd sync-server
npm install
npm start
```

Сервер буде доступний на `http://localhost:3001`

---

## Troubleshooting

### Помилка: "MONGODB_URI environment variable is not set"

**Рішення**: Встановіть змінну оточення MONGODB_URI в налаштуваннях Render/Railway/Fly

### Помилка: "Failed to connect to MongoDB"

**Можливі причини:**

1. Неправильний connection string - перевірте username, password, cluster URL
2. IP адреса не додана в Network Access - додайте `0.0.0.0/0`
3. Користувач не має прав - встановіть "Read and write to any database"

### Сервер "спить" (Cold Start)

На безкоштовному плані Render сервер засинає після 15 хвилин неактивності. Перший запит після сну займе 30-60 секунд.

**Рішення:**

- Це нормально для безкоштовного плану
- MongoDB Atlas НЕ засинає - дані завжди доступні
- Для production рекомендується платний план Render ($7/міс)

### Синхронізація не працює

1. Перевірте connection в Settings → Sync → "Test Connection"
2. Перевірте в логах Render чи є помилки MongoDB
3. Перевірте що Server URL правильний (HTTPS, без слешу в кінці)
4. Перевірте що Secret Key однаковий на всіх пристроях

---

## Моніторинг

### MongoDB Atlas Dashboard

1. Перейдіть до [cloud.mongodb.com](https://cloud.mongodb.com)
2. Виберіть ваш кластер
3. Подивіться:
   - Використання диску (Storage)
   - Кількість з'єднань (Connections)
   - Операції (Operations)

### Render Dashboard

1. Перейдіть до [dashboard.render.com](https://dashboard.render.com)
2. Виберіть ваш сервіс
3. Подивіться:
   - Logs - всі логи сервера
   - Metrics - використання CPU/RAM
   - Events - історія деплоїв

---

## Масштабування (в майбутньому)

Коли ваше використання зросте:

**MongoDB Atlas:**

- M0 (Free): 512 MB
- M2 ($9/міс): 2 GB
- M5 ($25/міс): 5 GB

**Render:**

- Free: Обмежені ресурси, засинання
- Starter ($7/міс): Завжди активний, більше ресурсів
- Standard ($25/міс): Ще більше ресурсів

---

## Безпека

✅ **Використовуйте HTTPS** - Render/Railway/Fly надають автоматично
✅ **Надійний Secret Key** - мінімум 16 символів, унікальний для кожного користувача
✅ **Не публікуйте MONGODB_URI** - це як пароль до вашої бази даних
✅ **Регулярні backup** - MongoDB Atlas робить автоматично

---

## Підтримка

Якщо виникли питання:

1. Перевірте логи в Render/Railway/Fly
2. Перевірте MongoDB Atlas metrics
3. Переконайтеся що MONGODB_URI правильно встановлено
4. Створіть issue в GitHub репозиторії
