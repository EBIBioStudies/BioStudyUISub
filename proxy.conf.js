module.exports = [
  {
    context: [
      '/api',
      '/identifiers',
      '/log',
      '/subm-status',
      '/organizations'
    ],
    target: 'http://0.0.0.0:8383',
    secure: false
  }
];
