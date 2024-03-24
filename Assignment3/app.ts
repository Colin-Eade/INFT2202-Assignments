import createError from 'http-errors';
import express, {NextFunction} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import usersRouter from './routes/users';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "./client")));          // serve static files from 'client' directory
app.use(express.static(path.join(__dirname, "./node_modules")));    // serve static files from 'node_modules' directory

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next): void {
  next(createError(404));
});

// error handler
app.use(function(err: createError.HttpError, req: express.Request, res: express.Response, next: NextFunction): void {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Route to handle "like" updates


export default app;
