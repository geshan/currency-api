const assert = require('assert');
const nock = require('nock');
const proxyquire = require('proxyquire').noCallThru();

const mysqlStub = {};

const exchangeRates = proxyquire('./../src/exchangeRates', {
  'namshi-node-mysql': _ => mysqlStub,
});
const today = new Date().toISOString().split('T')[0];

describe('exchangeRates', () => {
  describe('get', () => {
    it('should return no rates from the db when no rates exists', async () => {
      try {
        mysqlStub.query = (query, params) => {
          if (query.startsWith(`SELECT from_currency, to_currency`)) {
            return [];
          }
        };

        const result = await exchangeRates.getMultiple({});
        assert.deepStrictEqual(result, []);
      } catch (err) {
        console.log(`err`, err);
        assert.strictEqual(err.message, 'should never reach here');
      }
    });
    it('should return exchange rates from the db when exchange rates exists', async () => {
      try {
        mysqlStub.query = (query, params) => {
          if (query.startsWith(`SELECT from_currency, to_currency`)) {
            return [
              {
                from_currency: 'USD',
                to_currency: 'AUD',
                rate: 1.437403,
                on_date: '2019-06-10T14:00:00.000Z',
              },
            ];
          }
        };

        const result = await exchangeRates.getMultiple({});
        assert.deepStrictEqual(result[0], {
          from_currency: 'USD',
          to_currency: 'AUD',
          rate: 1.437403,
          on_date: '2019-06-10T14:00:00.000Z',
        });
      } catch (err) {
        console.log(`err`, err);
        assert.deepStrictEqual(err.message, 'should never reach here');
      }
    });
  });
});
