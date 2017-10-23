import React from 'react';
import { shallow } from 'enzyme';
import { CurrencyCarouselContainer } from 'containers';
import { changeTo } from 'action-creators';
import { ToContainer, mapStateToProps, mapDispatchToProps, FIRST_CURRENCY_INDEX } from '../to';

jest.mock('action-creators', () => ({
  changeTo: jest.fn()
}));

let wrapper;
let initialProps;
let state;

describe('ToContainer', () => {
  beforeEach(() => {
    initialProps = {
      to          : 'USD',
      currencyIds : ['EUR', 'USD'],
      changeTo    : jest.fn()
    };
    wrapper = shallow(<ToContainer {...initialProps} />);
  });

  it('should render CurrencyCarouselContainer with correct props', () => {
    expect(wrapper.contains(<CurrencyCarouselContainer
      initialCurrencyId={initialProps.to}
      currencyIds={initialProps.currencyIds}
      changeScreenAction={initialProps.changeTo}
      toOrFrom={'to'}
    />)).toBeTruthy();
  });

  it('should change initialCurrencyId to currency with FIRST_CURRENCY_INDEX if currency is not found', () => {
    wrapper.setProps({
      to: 'GBP'
    });

    expect(
      wrapper.find(CurrencyCarouselContainer).prop('initialCurrencyId')
    ).toBe(initialProps.currencyIds[FIRST_CURRENCY_INDEX]);
  });
});


describe('ToContainer mapStateToProps', () => {
  beforeEach(() => {
    state = {
      to             : 'USD',
      currencyIds    : [],
      currenciesById : {}
    };
  });

  it('should return to and currencyIds', () => {
    const resultingSTate = {
      to          : state.to,
      currencyIds : state.currencyIds
    };
    expect(mapStateToProps(state)).toEqual(resultingSTate);
  });
});

describe('ToContainer mapDispatchToProps', () => {
  it('should contain changeTo action creator', () => {
    expect(mapDispatchToProps).toEqual({ changeTo });
  });
});
