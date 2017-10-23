import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { currencySymbols, formatFixed } from 'utils';
import Icon from 'antd-mobile/lib/icon';
import 'antd-mobile/lib/icon/style/css';
import './styles/rate-button.css';

const DIGIT_AFTER_DELIMETER_COUNT = 4;
const LAST_SMALL_DIGITS_COUNT     = 2;

const mapStateToProps = (state, { handleShowRates }) => ({ to, from, currenciesById }) => {
  const fromCurrency = currenciesById[from];
  const toCurrency   = currenciesById[to];

  if (!fromCurrency || !toCurrency) {
    return {
      hide : true,
      rate : 0
    };
  }

  return {
    handleShowRates,
    from,
    to,
    rate : Number(toCurrency.rate && fromCurrency.rate && (toCurrency.rate / fromCurrency.rate)),
    hide : Boolean(
         from === to
      || toCurrency.rateIsLoading
      || fromCurrency.rateIsLoading
      || toCurrency.showRatesError
      || toCurrency.showRatesError
    )
  };
};

export function RateButton({ handleShowRates, from, to, rate, hide }) {
  let formattedRate = formatFixed(rate, DIGIT_AFTER_DELIMETER_COUNT);
  const lastDigits = formattedRate.slice(-LAST_SMALL_DIGITS_COUNT);
  formattedRate = formattedRate.slice(0, -LAST_SMALL_DIGITS_COUNT);

  return (
    <button onClick={handleShowRates} hidden={hide} className="rate-button">
      {currencySymbols[from]}1 = {currencySymbols[to]}{formattedRate}
      <p className="small-digits">{lastDigits}</p>
      <Icon type="down" />
    </button>
  );
}

RateButton.propTypes = {
  handleShowRates : PropTypes.func.isRequired,
  from            : PropTypes.string,
  to              : PropTypes.string,
  rate            : PropTypes.number,
  hide            : PropTypes.bool.isRequired
};

RateButton.defaultProps = {
  rate : 0,
  from : null,
  to   : null
};

export const ConnectedRateButton = connect(mapStateToProps)(RateButton);
