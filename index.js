const express = require('express');
require('express-async-errors');
const expressUtils = require('expressjs-utils');
const bodyParser = require('body-parser');
const exchangeRates = require('./src/exchangeRates');

const app = express();
app.use(bodyParser.json());

app.get('/', (req,res) => {
  res.json({message: `Please hit the api like: /api/convert/fromCurrency/toCurrency/onDate 
  example: ${req.get('host')}/api/convert/USD/AUD/${new Date().toISOString().split('T')[0]}`});
});

app.get('/api/convert/:fromCurrency/:toCurrency/:onDate', async (req, res) => {
  console.log(`Api hit`, req.params);
  res.json(await exchangeRates.get(req.params));
});

app.get('/api/rates', async (req,res) => {
  //res.json({message: `All Caches Rates will come here`});
  res.json(await exchangeRates.getMultiple(req.query.page || 1));
});

expressUtils.hc(app);
expressUtils.static(app);
expressUtils.errorHandler(app);
expressUtils.start(app, 8080, 'dev');