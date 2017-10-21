import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const mapStateToProps = (state, { toOrFrom, currencyId }) => {
  return ({ currenciesById }) => ({
    balance: currenciesById[currencyId].balance,
    currencyId,
    toOrFrom
  });
};

export function CurrencyCarouselItem({ currencyId, toOrFrom, balance }) {
  return <div>{currencyId} Your balance is: {balance}</div>;
}

CurrencyCarouselItem.propTypes = {
  balance    : PropTypes.number.isRequired,
  currencyId : PropTypes.string.isRequired,
  toOrFrom   : PropTypes.string.isRequired
};

export const ConnectedCurrencyCarouselItem = connect(mapStateToProps)(CurrencyCarouselItem);
