const env = process.env;
const config = {
  db: {
    host: env.DB_HOST || '35.201.28.84',
    user: env.DB_USER || 'currency_user',
    password: env.DB_PASSWORD || '715e147f',
    database: env.DB_NAME || `currency`,
  },
  currencyConverterApi: {
    baseUrl: 'https://free.currconv.com/api/v7',
    key: 'ca0133cec785f144a8c5'
  },
  itemsPerPage: {
    value: env.ITEMS_PER_PAGE || 10
  }
};

module.exports = config;
