const assert = require('assert');
const nock = require('nock');
const proxyquire = require('proxyquire').noCallThru();

const mysqlStub = {};

const exchangeRates = proxyquire(
  './../src/exchangeRates',
  { 'namshi-node-mysql': _ => mysqlStub },
);
const today = new Date().toISOString().split('T')[0];

describe('exchangeRates', () => {
  describe('get', () => {
    it('should use default params if no params are provided and no results in db, insert new rate to db', async () => {
      try {
        mysqlStub.query = (query, params) => {
          if (query.startsWith(`SELECT rate, created_at FROM exchange_rates`)) {
            return [];
          }

          if(query.startsWith(`INSERT INTO exchange_rates`)) {
            assert.ok(query.includes(`(from_currency, to_currency, rate, on_date) VALUES (?,?,?,?)`))
            assert.ok(query.includes(`ON DUPLICATE KEY UPDATE rate = ?`))
            assert.deepEqual(params, ['AUD', 'USD', 0.742725, today, 0.742725]);
            return Promise.resolve({
              fieldCount: 0,
              affectedRows: 1,
              insertId: 5,
              info: '',
              serverStatus: 2,
              warningStatus: 0 
            });
          }
        };

        let apiResponse = {'AUD_USD': {}};
        apiResponse['AUD_USD'][today] = 0.742725;
        nock('https://free.currencyconverterapi.com').get(/api*/).reply(200, apiResponse);

        const result = await exchangeRates.get({});
        assert.deepEqual(result, { 
          fromCurrency: 'AUD',
          toCurrency: 'USD',
          onDate: today,
          rate: 0.742725 
        });
      } catch (err) {
        console.log(`err`, err);
        assert.equal(err.message, 'should never reach here');
      }
    });

    it('should use default params if no params are provided and results in db', async () => {
      try {
        mysqlStub.query = (query, params) => {
          if (query.startsWith('SELECT rate, created_at FROM exchange_rates')) {
            assert.ok(query.includes(`WHERE from_currency = ? AND to_currency = ? AND on_date = ?`));
            assert.deepEqual(params, ['AUD', 'USD', today], 'fromCurrency, then toCurrency then onDate respectively');
            return [{ rate: '0.7427190', created_at: '2018-07-23T06:58:45.000Z'}];
          }
        };        

        const result = await exchangeRates.get({});
        assert.deepEqual(result, { 
          fromCurrency: 'AUD',
          toCurrency: 'USD',
          onDate: today,
          rate: 0.7427190 
        });
      } catch (err) {
        console.log(`err`, err);
        assert.equal(err.message, 'should never reach here');
      }
    });

    it('should use given params and no results in db returns error if response from API is wrong', async () => {
      try {
        mysqlStub.query = (query, params) => {
          if (query.startsWith(`SELECT rate, created_at FROM exchange_rates`)) {
            return [];
          }         
        };
        let wrongApiResponse = {'AUD_USD': {}};        
        nock('https://free.currencyconverterapi.com').get(/api*/).reply(200, wrongApiResponse);
        const result = await exchangeRates.get({fromCurrency: 'USD', toCurrency: 'AUD', onDate: '2018-07-21'});
        assert.equal(err.message, 'should never reach here');
      } catch (err) {
        assert.equal(err.statusCode, 400);
        assert.equal(err.message, 'Error in fetching rate');        
      }
    });
  });
});
