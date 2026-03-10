const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { apiRouter } = require('./routes/apiRoutes');
const { pageRouter } = require('./routes/pageRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandlers');

function createApp() {
  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '..', 'views'));

  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/static', express.static(path.join(__dirname, '..', 'public')));

  app.use('/', pageRouter);
  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = {
  createApp
};
