import { CHANGE_FROM, LOAD_INITIAL_CURRENCIES } from 'action-types';
import { fromHandlers } from '../from';

const INITIAL_FROM = 'USD';
const NEW_FROM     = 'EUR';
const CURRENCY_IDS = ['EUR', 'USD'];

describe('fromHandlers', () => {
  describe(CHANGE_FROM, () => {
    it('should change from state', () => {
      const newFrom = fromHandlers[CHANGE_FROM](INITIAL_FROM, {
        currencyId: NEW_FROM
      });
      expect(newFrom).toBe(NEW_FROM);
    });
  });

  describe(LOAD_INITIAL_CURRENCIES, () => {
    it('should set from to the first of the available currencies', () => {
      const newFrom = fromHandlers[LOAD_INITIAL_CURRENCIES](INITIAL_FROM, {
        currencyIds: CURRENCY_IDS
      });
      expect(newFrom).toBe(CURRENCY_IDS[0]);
    });
  });
});
