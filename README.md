# Sprint-13
## Yandex.Praktikum Sprint-13

NodeJS, Express, MongoDB

## Развертывание

- Установить [Node.JS](https://nodejs.org/en/)
- Скопировать репозиторий: `git clone git@github.com:i386net/sprint-13.git`
- Установить зависимости `npm install`
- Создать в корне файл с переменными окружения, выполнив команду:
    ```shell script
    echo "DB_HOST=mongodb://localhost:27017/mestodb\nPORT=3000\nSERVER=http://localhost\nUSER_ID=1111111\n" >> .env
   ```

## Запуск

- В режиме разработки: `npm run dev` запускает сервер на `localhost:3000` с `hot realod`
- В режиме сервера: `npm run start` запускает сервер на `localhost:3000`

## Работа с API

| ЗАПРОС | ОТВЕТ | 
| :---         |     :---       |  
| GET `localhost:3000/users`   | JSON-список всех пользователей     |
| GET `localhost:3000/cards`     | JSON-список всех карточек       | 
| GET `localhost:3000/users/8340d0ec33270a25f2413b69`     | JSON-пользователя с переданным после /users идентификатором. Если такого нет, API должно возвращать 404 статус ответа и JSON:`{ "message": "Нет пользователя с таким id" }`       | 
| Несуществующий адрес     | `{ "message": "Запрашиваемый ресурс не найден" }`       | 
