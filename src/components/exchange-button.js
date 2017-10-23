import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { addBalance, substractBalance, updateExchangeAmount } from 'action-creators';
import { formatFixed } from 'utils';

export const mapStateToProps = ({ from, to, currenciesById }) => {
  const fromCurrency   = currenciesById[from];
  const toCurrency     = currenciesById[to];

  if (!fromCurrency || !toCurrency) {
    return {
      exchangeRate : 0,
      disabled     : true
    };
  }

  const exchangeAmount = Number(fromCurrency.exchangeAmount);

  return {
    exchangeAmount,
    from,
    to,
    exchangeRate : fromCurrency.rate / toCurrency.rate,
    disabled     : Boolean(
         exchangeAmount <= 0
      || exchangeAmount > fromCurrency.balance
      || from === to
      || fromCurrency.showRateError
      || toCurrency.showRateError
      || fromCurrency.isLoadingRate
      || toCurrency.isLoadingRate
    )
  };
};
export const mapDispatchToProps = { addBalance, substractBalance, updateExchangeAmount };

export function ExchangeButton(props) {
  const { disabled, to, from, exchangeAmount, exchangeRate } = props;
  const handleClick = () => {
    if (disabled) return;

    props.updateExchangeAmount(from, '');
    props.addBalance(to, exchangeAmount / Number(formatFixed(exchangeRate, 4)));
    props.substractBalance(from, exchangeAmount);
  };
  const exchnageButtonCls = classnames('header-button', { disabled });

  return <div onClick={handleClick} role="button" className={exchnageButtonCls} tabIndex={0}>Exchange</div>;
}

ExchangeButton.propTypes = {
  to                   : PropTypes.string,
  from                 : PropTypes.string,
  exchangeAmount       : PropTypes.number,
  disabled             : PropTypes.bool.isRequired,
  exchangeRate         : PropTypes.number.isRequired,
  addBalance           : PropTypes.func.isRequired,
  substractBalance     : PropTypes.func.isRequired,
  updateExchangeAmount : PropTypes.func.isRequired
};

ExchangeButton.defaultProps = {
  exchangeAmount : 0,
  from           : null,
  to             : null
};

export const ConnectedExchangeButton = connect(mapStateToProps, mapDispatchToProps)(ExchangeButton);
