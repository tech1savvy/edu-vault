const express = require('express');
const morgan = require('morgan');
const logger = require('./config/logger');
const app = express();
const routes = require('./routes');

app.use(morgan('dev', { stream: logger.stream }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', routes);

module.exports = app;