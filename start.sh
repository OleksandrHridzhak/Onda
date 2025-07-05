#!/bin/bash

# Функція для вбивства процесів на портах
kill_port() {
  local port=$1
  pid=$(netstat -ano | grep ":$port" | grep LISTENING | awk '{print $5}' | tr -d '\r')
  if [ ! -z "$pid" ]; then
    echo "🔪 Вбиваю процес на порту $port (PID $pid)"
    taskkill //PID "$pid" //F > /dev/null 2>&1
  fi
}

# 💥 Чищу порти
kill_port 5173
kill_port 3000

# 🚀 Стартує фронт у новому Git Bash вікні (асинхронно!)
echo "🟢 Відкриваю фронт..."
mintty.exe -h always --title="Frontend" /bin/bash -lc "cd '$(pwd)' && npm start" &

# 🔧 Стартує бек у новому Git Bash вікні (теж асинхронно)
echo "🛠️ Відкриваю бекенд..."
mintty.exe -h always --title="Backend" /bin/bash -lc "cd '$(pwd)/sys3-electron/electron-backend' && npx nodemon electron.js" &

# 🧠 VS Code
echo "🧠 Відкриваю VS Code..."
code .

echo "🌐 Відкриваю проєкт у браузері..."
start "" "https://github.com/users/OleksandrHridzhak/projects/2/views/1"