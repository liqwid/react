import { createReducer } from '../';

const INITIAL_STATE_FIXTURE = {};
const STATE_FIXTURE = {};
const ACTION_TYPE_FIXTURE = 'ACTION_TYPE_FIXTURE';
const ACTION_PAYLOAD_FIXTURE = {};
const handlerMock = jest.fn();
const handlersMock = {
  [ACTION_TYPE_FIXTURE]: handlerMock
};

let reducerMock;

describe('createReducer factory', () => {
  it('should return a reducer function', () => {
    expect(createReducer(INITIAL_STATE_FIXTURE, handlersMock)).toBeInstanceOf(Function);
  });

  describe('reducer function', () => {
    beforeEach(() => {
      reducerMock = createReducer(INITIAL_STATE_FIXTURE, handlersMock);
    });

    it('should return initial state', () => {
      expect(reducerMock(undefined, {})).toBe(INITIAL_STATE_FIXTURE);
    });

    it('should call handler depending on action.type', () => {
      reducerMock(undefined, { type: ACTION_TYPE_FIXTURE });
      expect(handlerMock).toHaveBeenCalledTimes(1);
    });

    it('should pass initial state to the handler if state was not defined', () => {
      reducerMock(undefined, { type: ACTION_TYPE_FIXTURE });
      expect(handlerMock).toHaveBeenCalledWith(INITIAL_STATE_FIXTURE, undefined);
    });

    it('should pass state to the handler if it is defined', () => {
      reducerMock(STATE_FIXTURE, { type: ACTION_TYPE_FIXTURE });
      expect(handlerMock).toHaveBeenCalledWith(STATE_FIXTURE, undefined);
    });

    it('should call pass action payload to the handler', () => {
      reducerMock(STATE_FIXTURE, { type: ACTION_TYPE_FIXTURE, payload: ACTION_PAYLOAD_FIXTURE });
      expect(handlerMock).toHaveBeenCalledWith(STATE_FIXTURE, ACTION_PAYLOAD_FIXTURE);
    });
  });
});
