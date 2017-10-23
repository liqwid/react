import React from 'react';
import { shallow } from 'enzyme';
import { currencySymbols, formatFixed } from 'utils';
import { IncomingAmount, AmountInput } from 'components';
import { CurrencyCarouselItem, getBalanceMessage, mapStateToProps } from '../currency-carousel-item';

let initialProps;
let passedProps;
let state;
let wrapper;

describe('CurrencyCarouselitem', () => {
  beforeEach(() => {
    initialProps = {
      currencyId        : 'USD',
      toOrFrom          : 'to',
      balance           : 100,
      insufficientFunds : false
    };

    wrapper = shallow(<CurrencyCarouselItem {...initialProps} />);
  });

  it('should render currencyId title', () => {
    expect(wrapper.find(`h1[children="${initialProps.currencyId}"]`)).toHaveLength(1);
  });

  it('should render balance text', () => {
    const balanceMessage = getBalanceMessage(
      currencySymbols[initialProps.currencyId],
      formatFixed(initialProps.balance, 2)
    );
    expect(wrapper.find(`p[children="${balanceMessage}"]`)).toHaveLength(1);
  });

  it('should highlight balance text if insufficientFunds is true', () => {
    expect(wrapper.find('p.error')).toHaveLength(0);
    const insufficientProps = {
      ...initialProps,
      insufficientFunds: true
    };
    const insufficientFundsWrapper = shallow(<CurrencyCarouselItem {...insufficientProps} />);

    expect(insufficientFundsWrapper.find('p.error')).toHaveLength(1);
  });

  it('should render AmountInput if toOrFrom is from', () => {
    const fromProps = {
      ...initialProps,
      toOrFrom: 'from'
    };
    const fromWrapper = shallow(<CurrencyCarouselItem {...fromProps} />);

    expect(
      fromWrapper.contains(<AmountInput currencyId={initialProps.currencyId} />)
    ).toBeTruthy();
  });

  it('should render IncomingAmount if toOrFrom is to', () => {
    expect(
      wrapper.contains(<IncomingAmount currencyId={initialProps.currencyId} />)
    ).toBeTruthy();
  });
});


describe('CurrencyCarouselItem mapStateToProps', () => {
  beforeEach(() => {
    passedProps = {
      toOrFrom   : 'from',
      currencyId : 'USD'
    };

    state = {
      currenciesById: {
        USD: {
          balance        : 100,
          exchangeAmount : 25
        }
      },
      to: 'EUR'
    };
  });

  it('should return a function', () => {
    expect(mapStateToProps({}, passedProps)).toBeInstanceOf(Function);
  });

  it('should return toOrFrom and currencyId from incoming props', () => {
    const stateProps = mapStateToProps({}, passedProps)(state);
    expect(stateProps).toHaveProperty('toOrFrom', passedProps.toOrFrom);
    expect(stateProps).toHaveProperty('currencyId', passedProps.currencyId);
  });

  it('should return currencyId balance', () => {
    const stateProps = mapStateToProps({}, passedProps)(state);
    expect(stateProps).toHaveProperty('balance', state.currenciesById[passedProps.currencyId].balance);
  });


  it('should return insufficientFunds true if toOrFrom is from, "to" isnt same currency and exchange amount is larger than balance', () => {
    const stateProps = mapStateToProps({}, passedProps)(state);
    expect(stateProps.insufficientFunds).toBe(false);

    const insufficientBalanceState = {
      ...state,
      currenciesById: {
        USD: {
          balance        : 0,
          exchangeAmount : 25
        }
      }
    };
    expect(
      mapStateToProps({}, passedProps)(insufficientBalanceState).insufficientFunds
    ).toBe(true);

    const sameFromToState = {
      ...insufficientBalanceState,
      to: 'USD'
    };
    expect(
      mapStateToProps({}, passedProps)(sameFromToState).insufficientFunds
    ).toBe(false);

    const toProps = {
      ...passedProps,
      toOrFrom: 'to'
    };
    expect(
      mapStateToProps({}, toProps)(insufficientBalanceState).insufficientFunds
    ).toBe(false);
  });
});
