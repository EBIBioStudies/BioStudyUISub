const config = require('config');
const request = require('request');
const { format } = require('url');

const loggerProxy = (app) => {
  const logStashUri = format(config.log_stash_uri);

  app.use('/log', (req, res) => {
    request({
      url: logStashUri,
      method: "POST",
      json: true,
      body: req.body
    }, () => res.send({ status: 'ok' }));
  });
};

module.exports = loggerProxy;
