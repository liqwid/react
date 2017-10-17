import { CHANGE_TO } from 'action-types';
import { toHandlers } from '../to';

const INITIAL_TO = 'USD';
const NEW_TO     = 'EUR';

describe('toHandlers', () => {
  describe(CHANGE_TO, () => {
    it('should change to state', () => {
      const newTo = toHandlers[CHANGE_TO](INITIAL_TO, {
        currencyId: NEW_TO
      });
      expect(newTo).toBe(NEW_TO);
    });
  });
});
