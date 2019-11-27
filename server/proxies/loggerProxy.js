const { logger } = require('../logger');

const loggerProxy = (app) => {
  app.use('/log', (req, res) => {
    logger.log(req.body);

    res.send();
  });
};

module.exports = loggerProxy;
