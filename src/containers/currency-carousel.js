import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCarousel from 'nuka-carousel';
import 'antd-mobile/lib/carousel/style/css';
import classnames from 'classnames';
import { CurrencyCarouselItem } from 'containers';
import { bind } from 'decko';
import './styles/currency-carousel.css';

export const DOT_ACTIVE_SUFFIX    = '-wrap-dot-active';
export const DOT_SUFFIX           = '-wrap-dot';
export const FIRST_CURRENCY_INDEX = 0;

export class CurrencyCarouselContainer extends Component {
  static propTypes = {
    initialCurrencyId  : PropTypes.string.isRequired,
    toOrFrom           : PropTypes.string.isRequired,
    currencyIds        : PropTypes.arrayOf(PropTypes.string).isRequired,
    changeScreenAction : PropTypes.func.isRequired,
    prefixCls          : PropTypes.string
  };

  static defaultProps = {
    prefixCls: 'am-carousel'
  };

  shouldComponentUpdate(nextProps) {
    return [...nextProps.currencyIds].sort().join() !== [...this.props.currencyIds].sort().join();
  }

  @bind
  getDots({ slideCount, slidesToScroll, currentSlide, goToSlide }) {
    const { prefixCls } = this.props;
    const dotDom = [];
    for (let index = 0; index < slideCount; index += slidesToScroll) {
      const dotCls = classnames(`${prefixCls}${DOT_SUFFIX}`, {
        [`${prefixCls}${DOT_ACTIVE_SUFFIX}`]: index === currentSlide
      });
      dotDom.push((
        <div
          className={dotCls}
          key={index}
          onClick={() => goToSlide(index)}
          role="button"
          tabIndex={0}
        >
          <span />
        </div>
      ));
    }
    return (
      <div className={`${prefixCls}-wrap`}>
        {dotDom}
      </div>
    );
  }

  @bind
  changeActiveCurrency(prevCurrencyIndex, nextCurrencyIndex) {
    const { changeScreenAction, currencyIds } = this.props;
    let nextCurrency = currencyIds[nextCurrencyIndex];

    // Check for currency removal
    if (!nextCurrency) nextCurrency = currencyIds[FIRST_CURRENCY_INDEX];

    changeScreenAction(nextCurrency);
  }

  render() {
    const { currencyIds, toOrFrom, initialCurrencyId } = this.props;
    const initialIndex = currencyIds.indexOf(initialCurrencyId);
    const { prefixCls } = this.props;
    const Decorators = [{
      component : this.getDots,
      position  : 'BottomCenter',
      style     : {
        bottom: '10%'
      }
    }];

    const wrapCls = classnames(prefixCls, 'currency-item', {
      'to-mask': toOrFrom === 'to'
    });

    return (
      <ReactCarousel
        slideIndex={initialIndex}
        wrapAround
        className={wrapCls}
        decorators={Decorators}
        beforeSlide={this.changeActiveCurrency}
      >
        {currencyIds.map(currencyId => (
          <CurrencyCarouselItem
            key={currencyId}
            currencyId={currencyId}
            toOrFrom={toOrFrom}
          />
        ))}
      </ReactCarousel>
    );
  }
}
