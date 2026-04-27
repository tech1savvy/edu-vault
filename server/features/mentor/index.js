const router = require('./mentor.routes');
const controller = require('./mentor.controller');
const service = require('./mentor.service');
const repository = require('./mentor.repository');

module.exports = {
  router,
  controller,
  service,
  repository
};
