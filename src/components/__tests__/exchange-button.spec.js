import React from 'react';
import { shallow } from 'enzyme';
import { addBalance, substractBalance, updateExchangeAmount } from 'action-creators';
import { formatFixed } from 'utils';
import { ExchangeButton, mapStateToProps } from '../exchange-button';

let initialProps;
let wrapper;
let state;
let disabledProps;
let disabledWrapper;

describe('ExchangeButton', () => {
  beforeEach(() => {
    initialProps = {
      to                   : 'EUR',
      from                 : 'USD',
      disabled             : false,
      exchangeAmount       : 200,
      exchangeRate         : 1.3,
      addBalance           : jest.fn(),
      substractBalance     : jest.fn(),
      updateExchangeAmount : jest.fn()
    };

    wrapper = shallow(<ExchangeButton {...initialProps} />);
  });

  it('should render exchang button', () => {
    expect(wrapper.find('div[role="button"].header-button')).toHaveLength(1);
  });

  it('should reset exchange amount of the from currency when clicked', () => {
    wrapper.find('div').simulate('click');
    expect(initialProps.updateExchangeAmount).toHaveBeenCalledTimes(1);
    expect(initialProps.updateExchangeAmount).toHaveBeenCalledWith(initialProps.from, '');
  });

  it('should call add to the to currency when clicked', () => {
    wrapper.find('div').simulate('click');
    const addedAmount = initialProps.exchangeAmount /
      Number(formatFixed(initialProps.exchangeRate, 4));
    expect(initialProps.addBalance).toHaveBeenCalledTimes(1);
    expect(initialProps.addBalance).toHaveBeenCalledWith(initialProps.to, addedAmount);
  });

  it('should call substract from the from currency when clicked', () => {
    wrapper.find('div').simulate('click');
    expect(initialProps.substractBalance).toHaveBeenCalledTimes(1);
    expect(initialProps.substractBalance)
    .toHaveBeenCalledWith(initialProps.from, initialProps.exchangeAmount);
  });

  describe('disabled ExchangeButton', () => {
    beforeEach(() => {
      disabledProps = {
        ...initialProps,
        disabled: true
      };

      disabledWrapper = shallow(<ExchangeButton {...disabledProps} />);
    });

    it('should set disabled class', () => {
      expect(disabledWrapper.find('div[role="button"].disabled')).toHaveLength(1);
    });

    it('should not call any handlers on click', () => {
      disabledWrapper.find('div').simulate('click');
      expect(disabledProps.addBalance).toHaveBeenCalledTimes(0);
      expect(disabledProps.substractBalance).toHaveBeenCalledTimes(0);
      expect(disabledProps.updateExchangeAmount).toHaveBeenCalledTimes(0);
    });
  });
});


describe('ExchangeButton mapStateToProps', () => {
  beforeEach(() => {
    state = {
      from           : 'USD',
      to             : 'EUR',
      currenciesById : {
        USD: {
          isLoadingRate  : false,
          showRateError  : false,
          exchangeAmount : 50,
          balance        : 100,
          rate           : 1
        },
        EUR: {
          isLoadingRate : false,
          showRateError : false,
          rate          : 0.85
        }
      }
    };
  });

  it('should return exchangeAmount, from, to, exchangeRate, and disabled false', () => {
    const stateProps = mapStateToProps(state);
    const rate = state.currenciesById[state.from].rate / state.currenciesById[state.to].rate;
    expect(stateProps).toHaveProperty('exchangeAmount', state.currenciesById[state.from].exchangeAmount);
    expect(stateProps).toHaveProperty('from', state.from);
    expect(stateProps).toHaveProperty('to', state.to);
    expect(stateProps).toHaveProperty('exchangeRate', rate);
    expect(stateProps).toHaveProperty('disabled', false);
  });

  it('should return exchangeRate 0 and disabled true if neither from or to currencies werent found', () => {
    const noFromState = {
      ...state,
      from: 'JPY'
    };
    const noToState = {
      ...state,
      to: 'JPY'
    };
    const noFromOrToResult = {
      exchangeRate : 0,
      disabled     : true
    };
    expect(mapStateToProps(noFromState)).toEqual(noFromOrToResult);
    expect(mapStateToProps(noToState)).toEqual(noFromOrToResult);
  });

  it('should return disabled false if exchange amount is 0 or lower', () => {
    const noAmountState = {
      ...state,
      currenciesById: {
        ...state.currenciesById,
        USD: {
          ...state.currenciesById.USD,
          exchangeAmount: 0
        }
      }
    };
    expect(mapStateToProps(noAmountState).disabled).toEqual(true);
  });

  it('should return disabled false if exchange amount is larger than balance', () => {
    const insufficientFundsState = {
      ...state,
      currenciesById: {
        ...state.currenciesById,
        USD: {
          ...state.currenciesById.USD,
          exchangeAmount : 10,
          balance        : 5
        }
      }
    };
    expect(mapStateToProps(insufficientFundsState).disabled).toEqual(true);
  });

  it('should return disabled false if from equals to', () => {
    const fromEqualsToState = {
      ...state,
      to: 'USD'
    };
    expect(mapStateToProps(fromEqualsToState).disabled).toEqual(true);
  });

  it('should return disabled false if if from or to currency are loading', () => {
    const fromLoadingState = {
      ...state,
      from           : 'USD',
      currenciesById : {
        ...state.currenciesById,
        USD: {
          ...state.currenciesById.USD,
          isLoadingRate: true
        }
      }
    };

    expect(mapStateToProps(fromLoadingState).disabled).toEqual(true);
    const toLoadingState = {
      ...state,
      to             : 'EUR',
      currenciesById : {
        ...state.currenciesById,
        EUR: {
          ...state.currenciesById.EUR,
          isLoadingRate: true
        }
      }
    };
    expect(mapStateToProps(toLoadingState).disabled).toEqual(true);
  });

  it('should return disabled false if if from or to currency have errors', () => {
    const fromErrorState = {
      ...state,
      from           : 'USD',
      currenciesById : {
        ...state.currenciesById,
        USD: {
          ...state.currenciesById.USD,
          showRateError: true
        }
      }
    };

    expect(mapStateToProps(fromErrorState).disabled).toEqual(true);
    const toErrorState = {
      ...state,
      to             : 'EUR',
      currenciesById : {
        ...state.currenciesById,
        EUR: {
          ...state.currenciesById.EUR,
          showRateError: true
        }
      }
    };
    expect(mapStateToProps(toErrorState).disabled).toEqual(true);
  });
});
