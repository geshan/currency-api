const axios = require('axios');
const config = require('./config');
const db = require('namshi-node-mysql')(config.db);
const _ = require('lodash');
const {httpError} = require('expressjs-utils');

async function getExternal(fromCurrency, toCurrency, onDate) {
  let rate = 0;
  console.log(`Getting rate from the API not the db`);
  const fromToCurrency = `${fromCurrency}_${toCurrency}`;
  try{
    const response = await axios.get(
      `${config.currencyConverterApi.baseUrl}/convert?q=${fromToCurrency}&compact=ultra&date=${onDate}&apiKey=${config.currencyConverterApi.key}`
    );
    rate = _.get(response,`data[${fromToCurrency}][${onDate}]`, 0);
  } catch(err) {
    let message = `Problem fetching error rate try a date range within 1 year from today and check currencies`;
    const remoteErrMessage = _.get(err, `response.data.error`);
    if (remoteErrMessage) {
      message = remoteErrMessage;
    }
    console.log(`Error calling currency converter API: `, err.message);
    throw new httpError(400, message);
  }
  if(rate === 0) {
    throw new httpError(400, `Error in fetching rate`);
  }

  db.query(
    `INSERT INTO exchange_rates (from_currency, to_currency, rate, on_date) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE rate = ?`,
    [fromCurrency, toCurrency, rate, onDate, rate]
  ).then(result => {
    if(result.affectedRows === 0) {
      console.error(`Exchange rate of ${rate} for ${fromCurrency} to ${toCurrency} on ${onDate} could not be saved`)
    }
  }).catch(err => {
    console.log(`Error while writing to db: `, err);
  }); //this is done async for the API to respond faster

  console.log(`Fetched exchange rate of ${rate} for ${fromCurrency} to ${toCurrency} of ${onDate} from the API`);
  return {fromCurrency, toCurrency, onDate, rate};
}

async function get(params) {
  const today= new Date().toISOString().split('T')[0];
  const {fromCurrency='AUD', toCurrency='USD', onDate=today} = params;
  let exchangeRates = await db.query(
    `SELECT rate, created_at FROM exchange_rates WHERE from_currency = ? AND to_currency = ? AND on_date = ?`,
    [fromCurrency, toCurrency, onDate]
  );
  if (exchangeRates.length) {
    const rate = Number(exchangeRates[0].rate);
    console.log(`Found exchange rate of ${rate} for ${fromCurrency} to ${toCurrency} of ${onDate} in the db`);

    return {fromCurrency, toCurrency, onDate, rate};
  }

  return getExternal(fromCurrency, toCurrency, onDate);
}

async function getMultiple(currentPage) {

  let offset = (currentPage - 1) * [config.itemsPerPage];

  let allExchangeRates = await db.query
  (`SELECT from_currency, to_currency, rate, on_date FROM exchange_rates LIMIT ?,?`,[offset, config.itemsPerPage] );

  if (allExchangeRates) {
    return allExchangeRates;
  }
  return [];
}

module.exports = {
  get,
  getMultiple,
};
