import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CurrencyCarouselContainer } from 'containers';
import { changeFrom } from 'action-creators';

export const mapStateToProps = ({ from, currencyIds }) => ({ from, currencyIds });
export const mapDispatchToProps = { changeFrom };
export const FIRST_CURRENCY_INDEX = 0;

export function FromContainer(props) {
  let { from, currencyIds } = props;
  if (!currencyIds.includes(from)) {
    from = currencyIds[FIRST_CURRENCY_INDEX];
  }
  return (<CurrencyCarouselContainer
    initialCurrencyId={from}
    currencyIds={currencyIds}
    changeScreenAction={props.changeFrom}
    toOrFrom={'from'}
  />);
}

FromContainer.propTypes = {
  from        : PropTypes.string.isRequired,
  currencyIds : PropTypes.arrayOf(PropTypes.string).isRequired,
  changeFrom  : PropTypes.func.isRequired
};

export const ConnectedFromContainer = connect(mapStateToProps, mapDispatchToProps)(FromContainer);
