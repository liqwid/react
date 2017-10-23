import React from 'react';
import { shallow } from 'enzyme';
import { CurrencyCarouselContainer } from 'containers';
import { changeFrom } from 'action-creators';
import { FromContainer, mapStateToProps, mapDispatchToProps, FIRST_CURRENCY_INDEX } from '../from';

jest.mock('action-creators', () => ({
  changeFrom: jest.fn()
}));

let wrapper;
let initialProps;
let state;

describe('FromContainer', () => {
  beforeEach(() => {
    initialProps = {
      from        : 'USD',
      currencyIds : ['EUR', 'USD'],
      changeFrom  : jest.fn()
    };
    wrapper = shallow(<FromContainer {...initialProps} />);
  });

  it('should render CurrencyCarouselContainer with correct props', () => {
    expect(wrapper.contains(<CurrencyCarouselContainer
      initialCurrencyId={initialProps.from}
      currencyIds={initialProps.currencyIds}
      changeScreenAction={initialProps.changeFrom}
      toOrFrom={'from'}
    />)).toBeTruthy();
  });

  it('should change initialCurrencyId to currency with FIRST_CURRENCY_INDEX if currency is not found', () => {
    wrapper.setProps({
      from: 'GBP'
    });

    expect(
      wrapper.find(CurrencyCarouselContainer).prop('initialCurrencyId')
    ).toBe(initialProps.currencyIds[FIRST_CURRENCY_INDEX]);
  });
});


describe('FromContainer mapStateToProps', () => {
  beforeEach(() => {
    state = {
      from           : 'USD',
      currencyIds    : [],
      currenciesById : {}
    };
  });

  it('should return from and currencyIds', () => {
    const resultingSTate = {
      from        : state.from,
      currencyIds : state.currencyIds
    };
    expect(mapStateToProps(state)).toEqual(resultingSTate);
  });
});

describe('FromContainer mapDispatchToProps', () => {
  it('should contain changeFrom action creator', () => {
    expect(mapDispatchToProps).toEqual({ changeFrom });
  });
});
