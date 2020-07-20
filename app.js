const {
  express, helmet, bodyParser, colors, mongoose, cookieParser,
} = require('./appdata/imports');
const {
  dbOptions, DB_HOST, PORT, WEB_HOST,
} = require('./appdata/appdata');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
mongoose
  .connect(DB_HOST, dbOptions)
  .then(() => console.log('Соединение с БД установлено:', colors.blue(DB_HOST)))
  .catch((err) => console.log('Ошибка соединения с БД:'.red, err.message));

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`Веб сервер работает по адресу: ${WEB_HOST}:${PORT}`);
});
