## Currency API

A simple project to show how to test a Node Express app using MNP - Mocha, Nock and Proxyquire.
Code coverage is done with Istanbul (now called nyc). Rewire can be used in place of 
proxyquire to test private JS methods. This app is a very basic currency API.

[![Build Status](https://travis-ci.org/geshan/currency-api.svg?branch=master)](https://travis-ci.org/geshan/currency-api) [![Maintainability](https://api.codeclimate.com/v1/badges/54eef9745fdb3b5c5476/maintainability)](https://codeclimate.com/github/geshan/currency-api/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/54eef9745fdb3b5c5476/test_coverage)](https://codeclimate.com/github/geshan/currency-api/test_coverage) [![Greenkeeper badge](https://badges.greenkeeper.io/geshan/currency-api.svg)](https://greenkeeper.io/)

## Running app

You can see this app running on [Zeit Now](https://currency-api.geshanm.now.sh/api/convert/USD/AUD/2019-08-05), each pull request will have it's own URL.

## Run on Google cloud run

[![Run on Google Cloud](https://storage.googleapis.com/cloudrun/button.svg)](https://console.cloud.google.com/cloudshell/editor?shellonly=true&cloudshell_image=gcr.io/cloudrun/button&cloudshell_git_repo=https://github.com/geshan/currency-api.git)

## How it works

The `GET` api works in the following way:

1. hit URL `/api/convert/AUD/USD/2018-07-22`.
1. Checks if the currency exchange rate is in the DB, if yes returns it.
1. If rate is not in the db it will query the `currencyconverterapi.com` free API to get the rate.
1. Returns the rate back and saves it in the DB too.

## DB script

To create the db and the table, run the following sql script.

```
CREATE DATABASE currency CHARACTER SET utf8 COLLATE utf8_general_ci;
CREATE TABLE IF NOT EXISTS `currency`.`exchange_rates` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `from_currency` CHAR(3) NOT NULL,
  `to_currency` CHAR(3) NOT NULL,
  `rate` DECIMAL(12,7) NOT NULL,
  `on_date` DATE NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `rate_on_date_UNIQUE` (`from_currency` ASC, `to_currency` ASC, `on_date` ASC))
ENGINE = InnoDB;

INSERT INTO `currency`.`exchange_rates` (`from_currency`, `to_currency`, `rate`, `on_date`) VALUES ('AUD', 'USD', '0.742719', '2018-07-22');

```

## Configs

Configs for db like username, password etc are in the `/src/config.js` file.

## Run

to run the app you can use `docker-compose up` the go to `http://localhost:8080/api/convert/AUD/USD/2018-07-23` on the browser. It is using the db on `remotemysql.com` so no need to setup the db locally. If you want to set it up locally change the config in `src/configs.js` or put in environment variables.

## Run tests

To run the tests inside the container run `docker-compose run web npm t`

To run tests just run `npm t` to watch test run `npm t -- -w`.

To watch specific test(s) run `npm t -- -w -g "exchangeRates get` or even
`npm t -- -w -g "should use default params if no params are provided and no results in db"`

### Code coverage

To get the code coverage with Istanbul/nyc execute : `npm run test-cov`. You should see the code coverage on the cli.

You can also check the code coverage on [code climate](https://codeclimate.com/github/geshan/currency-api/src/exchangeRates.js/source).
