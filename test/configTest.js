const assert = require('assert');
const config = require('../src/config');

describe('config', () => {
  describe('values', () => {
    it('should check that config db values are as expected', () => {
      assert.deepStrictEqual(config.db, {
        host: 'remotemysql.com',
        user: 'x0B9v9MaCy',
        password: 's7RjzSve5L',
        database: `x0B9v9MaCy`,
      });
    });

    it('should check that config api values are as expected', () => {
      assert.deepStrictEqual(config.currencyConverterApi, {
        baseUrl: 'https://api.exchangeratesapi.io',
      });
    });

    it('should check that config itemsPerPage values is as expected', () => {
      assert.equal(config.itemsPerPage, 10);
    });
  });
});
