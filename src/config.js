const env = process.env;
const config = {
  db: {
    host: env.DB_HOST || 'db4free.org',
    user: env.DB_USER || 'currency_user',
    password: env.DB_PASSWORD || '715e147f',
    database: env.DB_NAME || `currency_db`,
  },
  currencyConverterApiBaseUrl: 'https://free.currencyconverterapi.com/api/v6'
}

module.exports = config;
