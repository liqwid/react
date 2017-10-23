import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { currencySymbols, formatFixed } from 'utils';
import './styles/incoming-amount.css';

const mapStateToProps = (state, { currencyId }) =>
  ({ from, currenciesById }) => {
    const fromCurrency = currenciesById[from];
    const toCurrency   = currenciesById[currencyId];
    if (!fromCurrency || !toCurrency) {
      return {
        sameCurrencies: true
      };
    }

    const rate = (fromCurrency.rate / toCurrency.rate) || 0;
    return {
      currencyId,
      from,
      rate,
      amount         : fromCurrency.exchangeAmount,
      sameCurrencies : currencyId === from
    };
  };

export function IncomingAmount({ currencyId, from, rate, amount, sameCurrencies }) {
  const blockCls = classnames({
    loading: amount && !rate
  });
  const amountCls = classnames({
    invisible: !amount || !rate
  });
  return (
    <div hidden={sameCurrencies} className={blockCls}>
      <h1 className={amountCls}>+{formatFixed(Number(amount) / rate, 2)}</h1>
      <p hidden={!rate}>
        {currencySymbols[currencyId]}1 = {currencySymbols[from]}{formatFixed(rate, 2)}
      </p>
    </div>
  );
}

IncomingAmount.propTypes = {
  currencyId     : PropTypes.string,
  from           : PropTypes.string,
  rate           : PropTypes.number,
  amount         : PropTypes.string,
  sameCurrencies : PropTypes.bool.isRequired
};

IncomingAmount.defaultProps = {
  amount     : '',
  rate       : 0,
  from       : null,
  currencyId : null
};

export const ConnectedIncomingAmount = connect(mapStateToProps)(IncomingAmount);
