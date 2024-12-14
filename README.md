<div align = center>
<h1>🤖 DO-Multifunctional Discord Assistant</h1>

**DO-Multifunctional Discord Assistant** — это многофункциональный бот для **Discord**, разработанный для автоматизации задач, улучшения взаимодействия пользователей и расширения возможностей вашего сервера.


![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Discord.js](https://img.shields.io/badge/discord.js-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Axios](https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Spotify](https://img.shields.io/badge/Spotify-1DB954?style=for-the-badge&logo=spotify&logoColor=white)
![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)
![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)

</div>

---

## 🚀 Функционал проекта

- 🔧 **Администрирование сервера**  
  Удобные команды для управления ролями, пользователями и каналами.  

- 🎮 **Интерактивные команды**  
  Игровые и развлекательные функции для поднятия активности на сервере.  

- 📊 **Сбор статистики**  
  Отслеживание активности пользователей и предоставление аналитики.  

- 🔔 **Уведомления и напоминания**  
  Настраиваемые напоминания и автоматические сообщения для важных событий.  

- 🌐 **Интеграции**  
  Поддержка сторонних API для расширенного функционала.  

---

## 🛠️ Стек технологий

- **Node.js**  
- **TypeScript**  
- **Discord.js** — библиотека для взаимодействия с API Discord  
- **Axios** — HTTP-клиент для работы с API  
- **MongoDB** — база данных для хранения информации о пользователях и командах  

---

## 📥 Установка и запуск проекта

1. **Склонируйте репозиторий:**
   ```bash
   git clone https://github.com/KirioA/DO-Multifunctional-Discord-Assisant.git
   cd DO-Multifunctional-Discord-Assisant
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Настройте переменные окружения:**
   Создайте файл `.env` в корневой директории и добавьте следующие переменные:
   ```env
   {
    "token": "text here",
    "clientID": "text here",
    "token_youtube": "text here",
    "token_telegram": "text here",
    "youtubeCookie": "text here",
    "spotifyId": "text here",
    "spotifySecret": "text here",
    "OPEN_AI": "text here (api key)",
    "adminTgChatId": "text here (you telegram chat id)",
    "adminId": "text here (your discord user id)",
    "prefix": "!"
}
   ```

4. **Запустите бота:**
   ```bash
   npm run start
   ```

5. **Добавьте бота на свой сервер:**
   Используйте OAuth2 URL для приглашения бота на ваш Discord сервер с нужными правами.  

---

## 📝 Структура проекта

```bash
DO-Multifunctional-Discord-Assisant/
│
├── src/
│   ├── commands/        # Папка с командами бота
│   ├── events/          # Обработчики событий Discord
│   ├── models/          # Модели для работы с базой данных
│   ├── services/        # Логика интеграций и работы бота
│   └── index.ts         # Точка входа для запуска бота
│
├── .env                 # Переменные окружения
├── package.json         # Информация о проекте и зависимостях
└── README.md            # Описание проекта
```

---

## 🔧 Примеры команд

1. **Административные команды:**
   - `!kick @user` — кикнуть пользователя.  
   - `!ban @user` — заблокировать пользователя.  
   - `!clear 10` — удалить последние 10 сообщений.  

2. **Развлекательные команды:**
   - `!joke` — рассказать шутку.  
   - `!meme` — показать мем.  

3. **Напоминания и уведомления:**
   - `!remind 10m Написать сообщение` — создать напоминание через 10 минут.  

---

## 🔗 Ссылки

- **Репозиторий:** [GitHub](https://github.com/KirioA/DO-Multifunctional-Discord-Assisant)

---

## 🤝 Контрибьютинг

Буду рад вашим предложениям и улучшениям. Открывайте **issue** или отправляйте **pull request**!  

---

## 📄 Лицензия

Этот проект распространяется под лицензией **MIT**.
