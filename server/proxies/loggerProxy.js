const { logger } = require('../logger');
const config = require('config');
const { format } = require('url');

const loggerProxy = (path, router) => {
  const hostUri = format(config.express);
  const isDevelopment = process.env.NODE_ENV === 'development';

  router.use(path, (req, res) => {
    const { origin } = req.headers;

    if (origin === hostUri || isDevelopment) {
      logger.log(req.body);
    }

    res.send();
  });
};

module.exports = loggerProxy;
