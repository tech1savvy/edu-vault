const logger = require('./config/logger');

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

require("dotenv").config();
const app = require("./app");
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
