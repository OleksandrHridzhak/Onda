#!/bin/bash

kill_port() {
  local port=$1
  pid=$(netstat -ano | grep ":$port" | grep LISTENING | awk '{print $5}' | tr -d '\r')
  if [ ! -z "$pid" ]; then
    echo "🛑 Вбиваю процес на порту $port (PID $pid)"
    taskkill //PID "$pid" //F > /dev/null 2>&1
  else
    echo "✅ На порту $port нічого не запущено"
  fi
}

# Закриваємо фронт і бек
kill_port 5173  # фронт
kill_port 3000  # бек або заміни на свій порт
