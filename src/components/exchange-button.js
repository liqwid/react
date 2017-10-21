import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addBalance, substractBalance } from 'action-creators';

const mapStateToProps = ({ from, to, currenciesById }) => {
  const fromCurrency   = currenciesById[from];
  const toCurrency     = currenciesById[to];
  const exchangeAmount = Number(fromCurrency.exchangeAmount);
  return {
    exchangeAmount,
    from,
    to,
    disabled: Boolean(
         exchangeAmount <= 0
      || exchangeAmount > fromCurrency.balance
      || fromCurrency.showRateError
      || toCurrency.showRateError
      || fromCurrency.isLoadingRate
      || toCurrency.isLoadingRate
    )
  };
};
const mapDispatchToProps = { addBalance, substractBalance };

export function ExchangeButton(props) {
  const handleClick = () => {
    if (props.disabled) return;

    props.addBalance(props.to, props.exchangeAmount);
    props.substractBalance(props.from, props.exchangeAmount);
  };

  return <div onClick={handleClick} role="button" tabIndex={0}>Exchange</div>;
}

ExchangeButton.propTypes = {
  to               : PropTypes.string,
  from             : PropTypes.string,
  exchangeAmount   : PropTypes.number,
  disabled         : PropTypes.bool.isRequired,
  addBalance       : PropTypes.func.isRequired,
  substractBalance : PropTypes.func.isRequired
};

ExchangeButton.defaultProps = {
  exchangeAmount : 0,
  from           : null,
  to             : null
};

export const ConnectedExchangeButton = connect(mapStateToProps, mapDispatchToProps)(ExchangeButton);
