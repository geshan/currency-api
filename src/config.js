const env = process.env;
const config = {
  db: {
    host: env.DB_HOST || 'remotemysql.com',
    user: env.DB_USER || '8VjostCYYk',
    password: env.DB_PASSWORD || 't87tn6wIMB',
    database: env.DB_NAME || `8VjostCYYk`,
  },
  currencyConverterApi: {
    baseUrl: 'https://api.exchangeratesapi.io',
  },
  itemsPerPage: env.ITEMS_PER_PAGE || 10,
};

module.exports = config;
