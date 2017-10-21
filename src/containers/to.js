import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CurrencyCarouselContainer } from 'containers';
import { changeTo } from 'action-creators';

const mapStateToProps = ({ to, currencyIds }) => ({ to, currencyIds });
const mapDispatchToProps = { changeTo };

export function ToContainer(props) {
  const { to, currencyIds } = props;
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
