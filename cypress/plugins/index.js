const fs = require('fs')
const path = require('path')

module.exports = (on, config) => {
  // Parse the .env file and inject the settings into the Cypress.env object.
  const file = fs.readFileSync(path.resolve('.env'), 'utf-8');

  file.split('\n').map((line) => {
    if (line.trim() !== '') {
      const [key, value] = line.split('=');

      // Overrides base url in Cypress config and set everything else as env variable.
      if (key === 'BASE_URL') {
        config.baseUrl = value;
      } else {
        config.env[key] = value;
      }
    }
  });

  return config
}
