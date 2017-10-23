import React from 'react';
import { shallow } from 'enzyme';
import { AmountInput, mapStateToProps } from '../amount-input';

let initialProps;
let wrapper;
let state;
let passedProps;

describe('AmountInput', () => {
  beforeEach(() => {
    initialProps = {
      amount         : '100',
      sameCurrencies : false,
      active         : true
    };
    wrapper = shallow(<AmountInput {...initialProps} />);
  });

  it('should render an input with correct props', () => {
    const formattedAmount = `-${initialProps.amount}`;
    expect(wrapper.contains(
      <input
        autoFocus={initialProps.active}
        ref={wrapper.instance().bindInput}
        value={formattedAmount}
        hidden={initialProps.sameCurrencies}
        className="amount-input"
        onBlur={wrapper.instance().focus}
        readOnly
      />
    ));
  });

  it('should set no value if amount is empty', () => {
    const noAmountProps = {
      ...initialProps,
      amount: ''
    };
    const noAmountWrapper = shallow(<AmountInput {...noAmountProps} />);
    expect(noAmountWrapper.find('input').value).toBe(undefined);
  });

  describe('bindInput', () => {
    it('should save passed ref as input', () => {
      const inputRef = {
        focus: jest.fn()
      };
      wrapper.instance().bindInput(inputRef);
      expect(wrapper.instance().input).toBe(inputRef);
    });
  });

  describe('focus', () => {
    it('should call focus on event target if component is active', () => {
      const event = {
        target: {
          focus: jest.fn()
        }
      };
      wrapper.instance().focus(event);
      expect(event.target.focus).toHaveBeenCalledTimes(1);

      event.target.focus.mockClear();

      wrapper.setProps({ active: false });
      wrapper.instance().focus(event);
      expect(event.target.focus).toHaveBeenCalledTimes(0);
    });
  });

  it('should focus input and reset scroll of sliderprop if new component active prop is true', () => {
    const sliderFrame = {
      scrollLeft: 278
    };
    const inputRef = {
      focus   : jest.fn(),
      closest : () => sliderFrame
    };
    wrapper.instance().bindInput(inputRef);

    wrapper.setProps({ active: true });
    expect(inputRef.focus).toHaveBeenCalledTimes(1);
    expect(sliderFrame.scrollLeft).toBe(0);

    sliderFrame.scrollLeft = 278;
    inputRef.focus.mockClear();
    wrapper.setProps({ active: false });
    expect(inputRef.focus).toHaveBeenCalledTimes(0);
    expect(sliderFrame.scrollLeft).toBe(278);
  });
});


describe('AmountInput mapStateToProps', () => {
  beforeEach(() => {
    passedProps = {
      currencyId: 'USD'
    };
    state = {
      currenciesById: {
        USD: {
          exchangeAmount: 100
        }
      },
      to   : 'EUR',
      from : 'USD'
    };
  });

  it('should return a function', () => {
    expect(mapStateToProps({}, passedProps)).toBeInstanceOf(Function);
  });


  it('should pass correct amount', () => {
    expect(mapStateToProps({}, passedProps)(state).amount)
    .toEqual(state.currenciesById[passedProps.currencyId].exchangeAmount);
  });


  it('should set sameCurrencies to true if currencyId prop equals to', () => {
    expect(mapStateToProps({}, passedProps)(state).sameCurrencies).toBe(false);

    const stateWithSameCurrrencies = {
      ...state,
      to: 'USD'
    };
    expect(
      mapStateToProps({}, passedProps)(stateWithSameCurrrencies).sameCurrencies
    ).toBe(true);
  });

  it('should set active to true if currencyIds equals from', () => {
    expect(mapStateToProps({}, passedProps)(state).active).toBe(true);

    const inactiveState = {
      ...state,
      from: 'EUR'
    };
    expect(
      mapStateToProps({}, passedProps)(inactiveState).sameCurrencies
    ).toBe(false);
  });
});
