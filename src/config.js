const env = process.env;
const config = {
  db: {
    host: env.DB_HOST || "remotemysql.com",
    user: env.DB_USER || "x0B9v9MaCy",
    password: env.DB_PASSWORD || "s7RjzSve5L",
    database: env.DB_NAME || `x0B9v9MaCy`
  },
  currencyConverterApi: {
    baseUrl: "https://api.exchangeratesapi.io"
  },
  itemsPerPage: env.ITEMS_PER_PAGE || 10
};

module.exports = config;
