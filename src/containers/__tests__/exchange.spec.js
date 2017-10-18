import React from 'react';
import { shallow, mount } from 'enzyme';
import { ExchangeContainer } from '../exchange';

const CURRENCY_IDS = ['USD', 'EUR'];
const NEW_CURRENCY_IDS = ['USD', 'EUR', 'GBP'];
const ADDED_TO_NEW = ['GBP'];

let initRates;
let pollForRates;
let stopPolling;
let component;
let jsDomWrapper;

describe('ExchangeContainer', () => {
  beforeEach(() => {
    initRates = jest.fn();
    pollForRates = jest.fn();
    stopPolling = jest.fn();
    component = (
      <ExchangeContainer
        initRates={initRates}
        pollForRates={pollForRates}
        stopPolling={stopPolling}
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
  });

  it('should render children', () => {
    expect(shallow(component).contains(<div />)).toBeTruthy();
  });

  it('should call initRates after mounting with correct ids', () => {
    jsDomWrapper = mount(component);

    initRates.mockClear();
    jsDomWrapper.unmount();
    jsDomWrapper.mount();

    expect(initRates).toHaveBeenCalledTimes(1);
    expect(initRates).toHaveBeenCalledWith(CURRENCY_IDS);
  });

  it('should call pollForRates after mounting with correct ids', () => {
    jsDomWrapper = mount(component);

    pollForRates.mockClear();
    jsDomWrapper.unmount();
    jsDomWrapper.mount();

    expect(pollForRates).toHaveBeenCalledTimes(1);
    expect(initRates).toHaveBeenCalledWith(CURRENCY_IDS);
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
