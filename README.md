# Проект Mesto

## Sprint-14 
- [] Аутентификация и авторизация и  пользователя в проекте  Mesto.

## Sprint-13
 -[x] Работа с БД: 
  
  Стек: NodeJS, Express, MongoDB

## Развертывание

- Установить [Node.JS](https://nodejs.org/en/)
- Скопировать репозиторий: `git clone git@github.com:i386net/mesto-project.git`
- Установить зависимости `npm install`

## Запуск

- В режиме разработки: `npm run dev` запускает сервер на `localhost:3000` с `hot realod`
- В режиме сервера: `npm run start` запускает сервер на `localhost:3000`

## Работа с API

| ЗАПРОС | ОТВЕТ | 
| :---         |     :---       |  
| POST `localhost:3000/signup`   | Регистрация нового пользователя     |
| GET `localhost:3000/signin`   | Логин     |
| PATCH `http://localhost:3000/users/me`   | Изменение информации о пользователе     |
| PATCH `http://localhost:3000/users/me/avatar`   | Изменение аватара пользователя     |
| GET `localhost:3000/users`   | JSON-список всех пользователей     |
| GET `localhost:3000/cards`     | JSON-список всех карточек       | 
| GET `localhost:3000/users/8340d0ec33270a25f2413b69`     | JSON-пользователя с переданным после /users идентификатором. Если такого нет, API должно возвращать 404 статус ответа и JSON:`{ "message": "Пользователь с таким id не найден" }`       | 
| POST `localhost:3000/cards`     | Создание карточки. В ответ API должно возвращать 200 статус ответа и JSON с данными созданой карточки       | 
| DELETE `localhost:3000/cards/5f0179c9602fb4280b465bd6`     | Удаление карточки. В ответ API должно возвращать 200 статус ответа и JSON с данными удаленной карточки       | 
| Несуществующий адрес     | `{ "message": "Запрашиваемый ресурс не найден" }`       | 
