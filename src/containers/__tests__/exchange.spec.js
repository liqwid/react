import React from 'react';
import { shallow, mount } from 'enzyme';
import { LoaderLayout, NoCurrenciesLayout } from 'layouts';
import { ExchangeContainer, mapStateToProps, mapDispatchToProps } from '../exchange';

const CURRENCY_IDS = ['USD', 'EUR'];
const NEW_CURRENCY_IDS = ['USD', 'EUR', 'GBP'];
const ADDED_TO_NEW = ['GBP'];

let initCurrencies;
let initRates;
let pollForRates;
let stopPolling;
let component;
let jsDomWrapper;

const STATE = {
  currencyIds    : [],
  appLoaded      : false,
  currenciesById : {}
};

const STATE_PROPS = {
  currencyIds : [],
  appLoaded   : false
};

describe('ExchangeContainer', () => {
  beforeEach(() => {
    initCurrencies = jest.fn();
    initRates = jest.fn();
    pollForRates = jest.fn();
    stopPolling = jest.fn();
    component = (
      <ExchangeContainer
        initCurrencies={initCurrencies}
        initRates={initRates}
        pollForRates={pollForRates}
        stopPolling={stopPolling}
        appLoaded={false}
        currencyIds={CURRENCY_IDS}
      >
        <div />
      </ExchangeContainer>
    );
  });

  afterEach(() => {
    if (jsDomWrapper && typeof jsDomWrapper.unmount === 'function') {
      jsDomWrapper.unmount();
      jsDomWrapper = null;
    }
    initRates.mockClear();
    pollForRates.mockClear();
  });

  it('should render loading layout when appLoaded is false', () => {
    expect(shallow(component).contains(<LoaderLayout />)).toBeTruthy();
  });

  it('should render no currencies layout when there is no currencies', () => {
    const wrapper = shallow(component);
    wrapper.setProps({ appLoaded: true, currencyIds: [] });

    expect(wrapper.contains(<NoCurrenciesLayout />)).toBeTruthy();
  });

  it('should render children when appLoaded is true', () => {
    const wrapper = shallow(component);
    wrapper.setProps({ appLoaded: true });

    expect(wrapper.contains(<div />)).toBeTruthy();
  });

  it('should render children when appLoaded is true', () => {
    const wrapper = shallow(component);
    wrapper.setProps({ appLoaded: true });

    expect(wrapper.contains(<div />)).toBeTruthy();
  });

  it('should call initCurrencies after mounting with correct ids', () => {
    jsDomWrapper = mount(component);

    initCurrencies.mockClear();
    jsDomWrapper.unmount();
    jsDomWrapper.mount();

    expect(initCurrencies).toHaveBeenCalledTimes(1);
  });

  it('should call stopPolling before unmounting', () => {
    shallow(component).unmount();

    expect(stopPolling).toHaveBeenCalledTimes(1);
  });

  it('should call pollForRates if currencyIds have changed', () => {
    const wrapper = shallow(component);

    pollForRates.mockClear();
    wrapper.setProps({ currencyIds: NEW_CURRENCY_IDS });

    expect(pollForRates).toHaveBeenCalledTimes(1);
    expect(pollForRates).toHaveBeenCalledWith(NEW_CURRENCY_IDS);
  });

  it('should call initRates with added currencyIds', () => {
    const wrapper = shallow(component);

    initRates.mockClear();
    wrapper.setProps({ currencyIds: NEW_CURRENCY_IDS });

    expect(initRates).toHaveBeenCalledTimes(1);
    expect(initRates).toHaveBeenCalledWith(ADDED_TO_NEW);
  });
});

describe('ExchangeContainer mapStateToProps', () => {
  it('should return only currencyIds and appLoaded props', () => {
    expect(mapStateToProps(STATE)).toEqual(STATE_PROPS);
  });
});


describe('ExchangeContainer mapDispatchToProps', () => {
  it('should return initCurrencies, initRates, pollForRates, stopPolling', () => {
    const dispatchProps = mapDispatchToProps();
    expect(dispatchProps.initCurrencies).toBeInstanceOf(Function);
    expect(dispatchProps.initRates).toBeInstanceOf(Function);
    expect(dispatchProps.pollForRates).toBeInstanceOf(Function);
    expect(dispatchProps.stopPolling).toBeInstanceOf(Function);
  });
});
