import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CurrencyCarouselContainer } from 'containers';
import { changeTo } from 'action-creators';

export const mapStateToProps = ({ to, currencyIds }) => ({ to, currencyIds });
export const mapDispatchToProps = { changeTo };
export const FIRST_CURRENCY_INDEX = 0;

export function ToContainer(props) {
  let { to, currencyIds } = props;
  if (!currencyIds.includes(to)) {
    to = currencyIds[FIRST_CURRENCY_INDEX];
  }
  return (<CurrencyCarouselContainer
    initialCurrencyId={to}
    currencyIds={currencyIds}
    changeScreenAction={props.changeTo}
    toOrFrom={'to'}
  />);
}

ToContainer.propTypes = {
  to          : PropTypes.string.isRequired,
  currencyIds : PropTypes.arrayOf(PropTypes.string).isRequired,
  changeTo    : PropTypes.func.isRequired
};

export const ConnectedToContainer = connect(mapStateToProps, mapDispatchToProps)(ToContainer);
