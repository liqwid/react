import { get } from 'axios';

const BASE_CURRENCY       = 'USD';
const OPENEXCHANGE_HOST   = 'https://openexchangerates.org';
const OPENEXCHANGE_APP_ID = '815868164fc4412396b5d89734330458';
const OPENEXCHANGE_API    = `api/latest.json?app_id=${OPENEXCHANGE_APP_ID}&base=${BASE_CURRENCY}`;
export const RATES_API    = `${OPENEXCHANGE_HOST}/${OPENEXCHANGE_API}`;

/**
 * Selects rates for requested currencies
 * @param {CurrencyId[]} currencyIds
 * @param {Object<CurrencyId, ExchangeRate>} rateContainer.rates
 */
function parseRates(currencyIds, { data }) {
  const { rates } = data;
  return currencyIds.reduce((result, currencyId) => ({
    ...result,
    [currencyId]: rates[currencyId]
  }), {});
}

/**
 * Fetches requested currencies' rates
 * @param {CurrencyId[]} currencyIds
 */
export function fetchRates(currencyIds) {
  return get(RATES_API)
        .then(parseRates.bind(null, currencyIds));
}
