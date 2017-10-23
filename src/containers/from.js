import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CurrencyCarouselContainer } from 'containers';
import { changeFrom } from 'action-creators';

const mapStateToProps = ({ from, currencyIds }) => ({ from, currencyIds });
const mapDispatchToProps = { changeFrom };

export function ToContainer(props) {
  let { from, currencyIds } = props;
  if (!currencyIds.includes(from)) {
    from = currencyIds[0];
  }
  return (<CurrencyCarouselContainer
    initialCurrencyId={from}
    currencyIds={currencyIds}
    changeScreenAction={props.changeFrom}
    toOrFrom={'from'}
  />);
}

ToContainer.propTypes = {
  from        : PropTypes.string.isRequired,
  currencyIds : PropTypes.arrayOf(PropTypes.string).isRequired,
  changeFrom  : PropTypes.func.isRequired
};

export const ConnectedFromContainer = connect(mapStateToProps, mapDispatchToProps)(ToContainer);
