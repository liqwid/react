import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { currencySymbols, formatFixed } from 'utils';
import { IncomingAmount, AmountInput } from 'components';
import Flex from 'antd-mobile/lib/flex';
import 'antd-mobile/lib/flex/style/css';

const mapStateToProps = (state, { toOrFrom, currencyId }) =>
  ({ currenciesById, to }) => {
    const currency = currenciesById[currencyId];
    const { balance } = currency;

    return {
      insufficientFunds: toOrFrom === 'from' && to !== currencyId && currency.exchangeAmount > balance,
      balance,
      currencyId,
      toOrFrom
    };
  };

export function CurrencyCarouselItem({ currencyId, toOrFrom, balance, insufficientFunds }) {
  const amountIetm = toOrFrom === 'from'
  ? <AmountInput currencyId={currencyId} />
  : <IncomingAmount currencyId={currencyId} />;
  return (
    <Flex className="exchange-item" align="start">
      <Flex.Item className="exchange-block">
        <h1>{currencyId}</h1>
        <p className={insufficientFunds ? 'error' : ''}>
          You have {currencySymbols[currencyId]}{formatFixed(balance, 2)}
        </p>
      </Flex.Item>
      <Flex.Item className="exchange-block amount-block">
        {amountIetm}
      </Flex.Item>
    </Flex>
  );
}

CurrencyCarouselItem.propTypes = {
  balance           : PropTypes.number.isRequired,
  currencyId        : PropTypes.string.isRequired,
  toOrFrom          : PropTypes.string.isRequired,
  insufficientFunds : PropTypes.bool.isRequired
};

export const ConnectedCurrencyCarouselItem = connect(mapStateToProps)(CurrencyCarouselItem);
