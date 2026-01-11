# Розробка Onda 🛠️

> Все що потрібно для швидкого старту.

## Швидкий старт

```bash
# 1. Клонувати репо
git clone https://github.com/OleksandrHridzhak/Onda
cd Onda

# 2. Встановити залежності
npm install
cd render && npm install && cd ..

# 3. Запустити (все разом)
npm run start
```

## Команди

### Root (`/`)

| Команда | Що робить |
|---------|-----------|
| `npm run start` | Запускає все: React + Electron + sync-server |
| `npm run lint` | Перевірка коду (ESLint) |
| `npm run lint:fix` | Автофікс ESLint |
| `npm run dist` | Збірка інсталятора Windows |

### Frontend (`/render`)

| Команда | Що робить |
|---------|-----------|
| `npm start` | Dev server на localhost:3000 |
| `npm run build` | Production build |
| `npm run mobile:dev` | Запуск на Android емуляторі |
| `npm run mobile:build` | Збірка APK |

### Sync Server (`/sync-server`)

| Команда | Що робить |
|---------|-----------|
| `npm run dev` | Dev server з hot reload |
| `npm start` | Production mode |
| `npm run build` | TypeScript → JavaScript |

## Змінні оточення

### Root `.env`
```env
NODE_ENV=development
```

### sync-server `.env`
```env
MONGODB_URI=mongodb+srv://...
PORT=3001
```

### render `.env`
```env
REACT_APP_SYNC_SERVER=http://localhost:3001
```

## Git workflow

```bash
# Feature branch
git checkout -b feature/назва-фічі

# Коміт (commitlint перевірить формат)
git commit -m "feat: додати нову фічу"
# або
git commit -m "fix: виправити баг"

# Типи: feat, fix, docs, style, refactor, perf, test, chore, revert, build, ci
```

## Структура компонентів

```
components/
├─ features/     ← Бізнес-логіка (Table, Calendar, Settings)
├─ layout/       ← Layout компоненти (Sidebar, MenuWin)
├─ pages/        ← Сторінки-контейнери
└─ shared/       ← Переиспользовувані UI елементи
```

## Типова задача: додати нову фічу

1. **UI компонент** → `render/src/components/features/НоваФіча/`
2. **Сторінка** → `render/src/components/pages/НоваФічаPage.tsx`
3. **Роут** → `render/src/App.tsx` (додати в Routes)
4. **Стейт** (якщо потрібен) → `render/src/store/slices/`
5. **Дані** (якщо персистентні) → `render/src/services/`

## Debugging tips

- **React DevTools** - для інспекції компонентів
- **Redux DevTools** - для стейту
- **Chrome DevTools** - IndexedDB в Application tab
- **Electron** - `Ctrl+Shift+I` відкриває DevTools
