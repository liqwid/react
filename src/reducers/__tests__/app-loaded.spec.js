import { LOAD_INITIAL_CURRENCIES } from 'action-types';
import { appLoadedHandlers } from '../app-loaded';

const INITIAL_APP_LOADED_STATE = false;
const APP_LOADED_STATE_AFTER_LOAD = true;

describe('toHandlers', () => {
  describe(LOAD_INITIAL_CURRENCIES, () => {
    it('should change app loaded state to true', () => {
      const newAppLoaded = appLoadedHandlers[LOAD_INITIAL_CURRENCIES](INITIAL_APP_LOADED_STATE);
      expect(newAppLoaded).toBe(APP_LOADED_STATE_AFTER_LOAD);
    });
  });
});
