require('dotenv').config();
const {
  express, helmet, bodyParser, colors, mongoose, rateLimit,
} = require('./appdata/imports');
const {
  dbOptions, DB_HOST, PORT, WEB_HOST,
} = require('./appdata/appdata');
const { login, createUser } = require('./controllers/users');

const app = express();
const limiter = rateLimit({
  windowMs: 50 * 60 * 1000,
  max: 100,
});
app.use(limiter);
app.use(helmet());
app.use((req, res, next) => {
  req.user = {
    _id: '5f054f80fdc156787a88ac64', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
}); // todo delete
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose
  .connect(DB_HOST, dbOptions)
  .then(() => console.log('Соединение с БД установлено:', colors.blue(DB_HOST)))
  .catch((err) => console.log('Ошибка соединения с БД:'.red, err.message));

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`Веб сервер работает по адресу: ${WEB_HOST}:${PORT}`);
});
