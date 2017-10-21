import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { currencySymbols } from 'utils';
import { IncomingAmount, AmountInput } from 'components';
import Flex from 'antd-mobile/lib/flex';
import 'antd-mobile/lib/flex/style/css';

const mapStateToProps = (state, { toOrFrom, currencyId }) =>
  ({ currenciesById }) => ({
    balance: currenciesById[currencyId].balance,
    currencyId,
    toOrFrom
  });

export function CurrencyCarouselItem({ currencyId, toOrFrom, balance }) {
  const amountIetm = toOrFrom === 'from'
  ? <AmountInput currencyId={currencyId} />
  : <IncomingAmount currencyId={currencyId} />;
  return (
    <Flex>
      <Flex.Item>
        <h1>{currencyId}</h1>
        <p>You have {currencySymbols[currencyId]}{balance}</p>
      </Flex.Item>
      <Flex.Item>
        {amountIetm}
      </Flex.Item>
    </Flex>
  );
}

CurrencyCarouselItem.propTypes = {
  balance    : PropTypes.number.isRequired,
  currencyId : PropTypes.string.isRequired,
  toOrFrom   : PropTypes.string.isRequired
};

export const ConnectedCurrencyCarouselItem = connect(mapStateToProps)(CurrencyCarouselItem);
