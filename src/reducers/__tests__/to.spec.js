import { CHANGE_TO, LOAD_INITIAL_CURRENCIES } from 'action-types';
import { toHandlers } from '../to';

const INITIAL_TO = 'USD';
const NEW_TO     = 'EUR';
const CURRENCY_IDS = ['USD', 'EUR'];
const SINGLE_CURRENCY_ID = ['EUR'];

describe('toHandlers', () => {
  describe(CHANGE_TO, () => {
    it('should change to state', () => {
      const newTo = toHandlers[CHANGE_TO](INITIAL_TO, {
        currencyId: NEW_TO
      });
      expect(newTo).toBe(NEW_TO);
    });
  });

  describe(LOAD_INITIAL_CURRENCIES, () => {
    it('should set to to the second of the available currencies', () => {
      const newTo = toHandlers[LOAD_INITIAL_CURRENCIES](INITIAL_TO, {
        currencyIds: CURRENCY_IDS
      });
      expect(newTo).toBe(CURRENCY_IDS[1]);
    });
  });

  describe(LOAD_INITIAL_CURRENCIES, () => {
    it('should set to to the first of the available currencies if there is only single currency', () => {
      const newTo = toHandlers[LOAD_INITIAL_CURRENCIES](INITIAL_TO, {
        currencyIds: SINGLE_CURRENCY_ID
      });
      expect(newTo).toBe(SINGLE_CURRENCY_ID[0]);
    });
  });
});
