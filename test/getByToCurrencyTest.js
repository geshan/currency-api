const assert = require('assert');

const proxyquire = require('proxyquire').noCallThru();

const mysqlStub = {};

const exchangeRates = proxyquire('./../src/exchangeRates', {
  'namshi-node-mysql': _ => mysqlStub,
});

describe('exchangeRates', () => {
  describe('getByToCurrency', () => {
    it('should return no rates for the given currency if none exist in the db', async () => {
      try {
        mysqlStub.query = (query, params) => {
          if (
            query.startsWith(
              `SELECT from_currency, to_currency, rate, on_date FROM exchange_rates where to_currency = ?`
            )
          ) {
            assert.deepStrictEqual(params, ['AUD', 0, 10]);
            return [];
          }
        };

        const result = await exchangeRates.getByToCurrency(1, 'AUD');
        assert.deepStrictEqual(result, []);
      } catch (err) {
        console.log(`err`, err);
        assert.strictEqual(err.message, 'should never reach here');
      }
    });

    it('should return rates for the given currency if they exist in the db with pagination', async () => {
      try {
        mysqlStub.query = (query, params) => {
          if (
            query.startsWith(
              `SELECT from_currency, to_currency, rate, on_date FROM exchange_rates where to_currency = ?`
            )
          ) {
            assert.deepStrictEqual(params, ['AUD', 10, 10]);
            return [
              {
                from_currency: 'USD',
                to_currency: 'AUD',
                on_date: '2020-10-01',
                rate: 1.3886147039,
              },
              {
                from_currency: 'USD',
                to_currency: 'AUD',
                on_date: '2019-10-01',
                rate: 1.4966590389,
              },
            ];
          }
        };

        const result = await exchangeRates.getByToCurrency(2, 'AUD');
        assert.deepStrictEqual(result, [
          {
            from_currency: 'USD',
            to_currency: 'AUD',
            on_date: '2020-10-01',
            rate: 1.3886147039,
          },
          {
            from_currency: 'USD',
            to_currency: 'AUD',
            on_date: '2019-10-01',
            rate: 1.4966590389,
          },
        ]);
      } catch (err) {
        console.log(`err`, err);
        assert.strictEqual(err.message, 'should never reach here');
      }
    });
  });
});
