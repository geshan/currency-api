const express = require('express');
require('express-async-errors');
const expressUtils = require('expressjs-utils');
const bodyParser = require('body-parser');
const exchangeRates = require('./src/exchangeRates');

const app = express();
app.use(bodyParser.json());

app.get('/api/convert/:fromCurrency/:toCurrency/:onDate', async (req, res) => {
  console.log(`Api hit`, req.params);
  
  res.json(await exchangeRates.get(req.params));
});

expressUtils.hc(app);
expressUtils.static(app);
expressUtils.errorHandler(app);
expressUtils.start(app, 8080, 'dev');
