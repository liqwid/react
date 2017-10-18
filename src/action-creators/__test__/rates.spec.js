import { fetchRates } from 'api';
import { UPDATE_RATES, UPDATE_RATES_LOADING_STATE, LOAD_RATES, SHOW_RATES_ERROR } from 'action-types';
import { initRates, pollForRates, stopPollingForRates, RATES_POLL_TIMEOUT } from '../rates';

const RATES_RESPONSE = {
  USD : 1,
  EUR : 0.85,
  GBP : 0.85
};
const LOAD_STATES = {
  USD : true,
  EUR : true,
  GBP : true
};
const CURRENCY_IDS = ['EUR', 'GBP', 'USD'];
const dispatchMock = jest.fn();

jest.mock('api', () => ({
  fetchRates: jest.fn()
}));
jest.useFakeTimers();

describe('initRates', () => {
  afterEach(() => {
    fetchRates.mockClear();
    dispatchMock.mockClear();
  });

  it('should return a thunk', () => {
    expect(initRates(CURRENCY_IDS)).toBeInstanceOf(Function);
  });

  it('should dispatch an update loading state action when thunk is invoked', () => {
    fetchRates.mockImplementationOnce(() => new Promise(() => {}));
    initRates(CURRENCY_IDS)(dispatchMock);
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith({
      type    : UPDATE_RATES_LOADING_STATE,
      payload : {
        loadingStates: LOAD_STATES
      }
    });
  });

  it('should call fetchRates when thunk is invoked and pass currencyIds as attribute', () => {
    fetchRates.mockImplementationOnce(() => new Promise(() => {}));
    initRates(CURRENCY_IDS)(dispatchMock);
    expect(fetchRates).toHaveBeenCalledTimes(1);
    expect(fetchRates).toHaveBeenCalledWith(CURRENCY_IDS);
  });

  it('should dispatch a load state action after fetch is resolved', async () => {
    fetchRates.mockImplementationOnce(() => Promise.resolve(RATES_RESPONSE));
    await initRates(CURRENCY_IDS)(dispatchMock);
    expect(dispatchMock).toHaveBeenCalledTimes(2);
    expect(dispatchMock).toHaveBeenLastCalledWith({
      type    : LOAD_RATES,
      payload : {
        ratesToUsd: RATES_RESPONSE
      }
    });
  });

  it('should dispatch an error action in case that fetchRates rejects', async () => {
    fetchRates.mockImplementationOnce(() => Promise.reject());
    await initRates(CURRENCY_IDS)(dispatchMock);
    expect(dispatchMock).toHaveBeenCalledTimes(2);
    expect(dispatchMock).toHaveBeenLastCalledWith({
      type    : SHOW_RATES_ERROR,
      payload : {
        currencyIds: CURRENCY_IDS
      }
    });
  });
});


describe('pollForRates', () => {
  afterEach(() => {
    fetchRates.mockClear();
    dispatchMock.mockClear();
  });

  it('should return a thunk', () => {
    expect(pollForRates(CURRENCY_IDS)).toBeInstanceOf(Function);
  });

  it(`should call fetch once every ${RATES_POLL_TIMEOUT / 1000} seconds`, () => {
    fetchRates.mockImplementation(() => new Promise(() => {}));
    pollForRates(CURRENCY_IDS)(dispatchMock);

    expect(fetchRates).not.toHaveBeenCalled();

    jest.runTimersToTime(RATES_POLL_TIMEOUT);

    expect(fetchRates).toHaveBeenCalledTimes(1);

    jest.runTimersToTime(RATES_POLL_TIMEOUT);

    expect(fetchRates).toHaveBeenCalledTimes(2);

    jest.clearAllTimers();
  });

  it('should dispatch an update rates action when fetchrates resolves', () => {
    fetchRates.mockImplementation(() => Promise.resolve(RATES_RESPONSE));
    pollForRates(CURRENCY_IDS)(dispatchMock);

    jest.runTimersToTime(RATES_POLL_TIMEOUT);

    Promise.resolve()
    .then(() => {
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith({
        type    : UPDATE_RATES,
        payload : {
          ratesToUsd: RATES_RESPONSE
        }
      });
    });
  });
});

describe('stopPollingRates', () => {
  it('should stop ongoing polling', () => {
    fetchRates.mockImplementation(() => new Promise(() => {}));
    pollForRates(CURRENCY_IDS)(dispatchMock);

    jest.runTimersToTime(RATES_POLL_TIMEOUT);

    expect(fetchRates).toHaveBeenCalledTimes(1);

    stopPollingForRates();
    jest.runTimersToTime(RATES_POLL_TIMEOUT);

    expect(fetchRates).toHaveBeenCalledTimes(1);
  });
});
