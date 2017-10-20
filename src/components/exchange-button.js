import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addBalance, substractBalance } from 'action-creators';

const mapStateToProps = ({ from, to, currenciesById }) => {
  const fromCurrency = currenciesById[from];
  const toCurrency   = currenciesById[to];
  const { exchangeAmount } = fromCurrency;
  return {
    exchangeAmount,
    from,
    to,
    disabled: exchangeAmount <= 0
           || exchangeAmount > fromCurrency.balance
           || fromCurrency.showRateError
           || toCurrency.showRateError
           || fromCurrency.isLoadingRate
           || toCurrency.isLoadingRate
  };
};
const mapDispatchToProps = { addBalance, substractBalance };

export function ExchangeButton(props) {
  const handleClick = () => {
    props.addBalance(props.to, props.exchangeAmount);
    props.substractBalance(props.from, props.exchangeAmount);
  };

  return <button onClick={handleClick} disabled={props.disabled} />;
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
