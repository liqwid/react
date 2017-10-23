import React from 'react';
import { shallow } from 'enzyme';
import ReactCarousel from 'nuka-carousel';
import { CurrencyCarouselItem } from 'containers';
import { CurrencyCarouselContainer, DOT_ACTIVE_SUFFIX, FIRST_CURRENCY_INDEX } from '../currency-carousel';

let initialProps;
let dotArgs;
let wrapper;
let dotWrapper;

const DOT_SELECTOR = 'div[role="button"]';

describe('CurrencyCarouselContainer', () => {
  beforeEach(() => {
    initialProps = {
      prefixCls          : 'prefix',
      initialCurrencyId  : 'USD',
      toOrFrom           : 'to',
      currencyIds        : ['USD', 'EUR'],
      changeScreenAction : jest.fn()
    };
    wrapper = shallow(<CurrencyCarouselContainer {...initialProps} />);
  });

  it('should update only when currencyIds contents changes', () => {
    const shouldUpdateState = {
      currencyIds: ['USD', 'GBP']
    };
    const shouldNotUpdateState = {
      currencyIds: ['EUR', 'USD']
    };
    expect(wrapper.instance().shouldComponentUpdate(shouldUpdateState)).toBe(true);
    expect(wrapper.instance().shouldComponentUpdate(shouldNotUpdateState)).toBe(false);
  });

  describe('ReactCarousel rendering', () => {
    it('should render ReactCarousel', () => {
      expect(wrapper.find(ReactCarousel)).toBeTruthy();
    });

    it('should pass initial index', () => {
      const { currencyIds, initialCurrencyId } = initialProps;
      const initialIndex = currencyIds.indexOf(initialCurrencyId);
      expect(wrapper.find(ReactCarousel).prop('slideIndex')).toBe(initialIndex);
    });

    it('should pass dots decorator', () => {
      expect(wrapper.find(ReactCarousel).prop('decorators')[0].component).toBe(wrapper.instance().getDots);
    });

    it('should pass a beforeSlide callback', () => {
      expect(wrapper.find(ReactCarousel).prop('beforeSlide')).toBe(wrapper.instance().changeActiveCurrency);
    });

    it('should pass correct classed depenging on toOrFrom prop', () => {
      expect(wrapper.find(ReactCarousel).prop('className').indexOf('to-mask')).toBeGreaterThan(-1);

      const fromProps = {
        ...initialProps,
        toOrFrom: 'from'
      };
      const fromWrapper = shallow(<CurrencyCarouselContainer {...fromProps} />);
      expect(fromWrapper.find(ReactCarousel).prop('className').indexOf('to-mask')).toBe(-1);
    });
  });


  describe('CurrencyCarouselItem rendering', () => {
    it('should render CurrencyCarouselItem for each currencyId', () => {
      expect(wrapper.find(CurrencyCarouselItem)).toHaveLength(initialProps.currencyIds.length);
    });

    it('should pass currrencyId as key', () => {
      expect(wrapper.find(CurrencyCarouselItem).map((component) => component.key())).toEqual(initialProps.currencyIds);
    });

    it('should pass currencyId', () => {
      expect(wrapper.find(CurrencyCarouselItem).map((component) => component.prop('currencyId'))).toEqual(initialProps.currencyIds);
    });

    it('should pass toOrFrom', () => {
      wrapper.find(CurrencyCarouselItem).forEach((component) => expect(component.prop('toOrFrom')).toEqual(initialProps.toOrFrom));
    });
  });

  describe('getDots', () => {
    beforeEach(() => {
      dotArgs = {
        slidesToScroll : 1,
        slideCount     : initialProps.currencyIds.length,
        goToSlide      : jest.fn(),
        currentSlide   : initialProps.currencyIds.indexOf(initialProps.initialCurrencyId)
      };
      dotWrapper = shallow(wrapper.instance().getDots(dotArgs));
    });

    it('should return a dots component with slideCount/slidesToScroll dots', () => {
      expect(dotWrapper.find(DOT_SELECTOR)).toHaveLength(dotArgs.slideCount / dotArgs.slidesToScroll);
    });

    it('should pass slide index as a key', () => {
      const indexes = [...Array(dotArgs.slideCount)].map((value, index) => String(index));
      expect(dotWrapper.find(DOT_SELECTOR).map((component) => component.key())).toEqual(indexes);
    });

    it('should pass goToSlide attribute as a callback with bound index', () => {
      dotWrapper.find(DOT_SELECTOR).forEach((component, index) => {
        component.prop('onClick')();
        expect(dotArgs.goToSlide).toHaveBeenCalledWith(index);
      });
    });

    it('should pass active class to a dot with a currentSlide index', () => {
      expect(
        dotWrapper.find(DOT_SELECTOR).filter(`.${initialProps.prefixCls}${DOT_ACTIVE_SUFFIX}`).key()
      ).toBe(String(dotArgs.currentSlide));
    });
  });

  describe('changeActiveCurrency', () => {
    it('should call changeScreenAction prop callback', () => {
      const PREV_CURRENCY = 0;
      const NEXT_CURRENCY = 1;
      wrapper.instance().changeActiveCurrency(PREV_CURRENCY, NEXT_CURRENCY);

      expect(initialProps.changeScreenAction)
      .toHaveBeenCalledWith(initialProps.currencyIds[NEXT_CURRENCY]);
    });

    it('should reset active currency to first if nextCurrency is not available', () => {
      const PREV_CURRENCY = 0;
      const NEXT_CURRENCY = 2;
      wrapper.instance().changeActiveCurrency(PREV_CURRENCY, NEXT_CURRENCY);

      expect(initialProps.changeScreenAction)
      .toHaveBeenCalledWith(initialProps.currencyIds[FIRST_CURRENCY_INDEX]);
    });
  });
});
