import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { initRates, pollForRates, stopPollingForRates, loadInitialCurrencies } from 'action-creators';
import { LoaderLayout, NoCurrenciesLayout } from 'layouts';
import './styles/exchange-widget.css';

export const mapStateToProps = ({ currencyIds, appLoaded }) => ({ currencyIds, appLoaded });

export const mapDispatchToProps = (dispatch) => ({
  initCurrencies : () => dispatch(loadInitialCurrencies()),
  initRates      : (currencyIds) => dispatch(initRates(currencyIds)),
  pollForRates   : (currencyIds) => dispatch(pollForRates(currencyIds)),
  stopPolling    : () => stopPollingForRates()
});

export class ExchangeContainer extends Component {
  static propTypes = {
    initCurrencies : PropTypes.func.isRequired,
    initRates      : PropTypes.func.isRequired,
    pollForRates   : PropTypes.func.isRequired,
    stopPolling    : PropTypes.func.isRequired,
    children       : PropTypes.node,
    currencyIds    : PropTypes.arrayOf(PropTypes.string).isRequired,
    appLoaded      : PropTypes.bool.isRequired
  }

  static defaultProps = {
    children: []
  }

  componentDidMount() {
    this.props.initCurrencies();
  }

  componentWillReceiveProps({ currencyIds }) {
    const { props } = this;

    // Upgrading polling if currencies changed
    const oldCurrencyIds = props.currencyIds;
    if (currencyIds === oldCurrencyIds) return;

    props.pollForRates(currencyIds);

    // Fetching new rates if they were introduced
    const addedCurrencyIds = currencyIds.filter(
      (currencyId) => !oldCurrencyIds.includes(currencyId)
    );
    if (!addedCurrencyIds.length) return;

    props.initRates(addedCurrencyIds);
  }

  componentWillUnmount() {
    this.props.stopPolling();
  }

  render() {
    const { appLoaded, currencyIds, children } = this.props;

    if (!appLoaded) {
      return <LoaderLayout />;
    }

    if (!currencyIds.length) {
      return <NoCurrenciesLayout />;
    }

    return <div className="exchange-widget-layout">{children}</div>;
  }
}

export const ConnectedExchangeContainer = connect(
  mapStateToProps, mapDispatchToProps
)(ExchangeContainer);
