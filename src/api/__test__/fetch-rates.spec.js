import { get } from 'axios';
import { fetchRates, RATES_API } from '../fetch-rates';

jest.mock('axios', () => ({
  get: jest.fn()
}));

const CURRENCY_IDS = ['USD', 'EUR', 'GBP'];
const GET_RESPONSE = {
  data: {
    rates: {
      AED : 0.6,
      USD : 1,
      EUR : 0.85,
      GBP : 0.75
    }
  }
};
const FETCH_RESULT = {
  USD : 1,
  EUR : 0.85,
  GBP : 0.75
};

describe('fetchRates', () => {
  it(`should call get once with ${RATES_API}`, () => {
    get.mockImplementationOnce(() => new Promise(() => {}));
    fetchRates();

    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(RATES_API);
  });

  it('should return rates for specified currencyIds', async () => {
    get.mockImplementationOnce(() => Promise.resolve(GET_RESPONSE));
    const rates = await fetchRates(CURRENCY_IDS);

    expect(rates).toEqual(FETCH_RESULT);
  });
});
