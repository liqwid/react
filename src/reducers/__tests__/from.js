import { CHANGE_FROM } from 'action-types';
import { fromHandlers } from '../from';

const INITIAL_FROM = 'USD';
const NEW_FROM     = 'EUR';

describe('fromHandlers', () => {
  describe(CHANGE_FROM, () => {
    it('should change from state', () => {
      const newFrom = fromHandlers[CHANGE_FROM](INITIAL_FROM, {
        currencyId: NEW_FROM
      });
      expect(newFrom).toBe(NEW_FROM);
    });
  });
});
