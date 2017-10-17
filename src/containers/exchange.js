import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { initRates, pollForRates, stopPollingForRates } from 'action-creators';

const mapStateToProps = ({ currencyIds }) => ({ currencyIds });

const mapDispatchToProps = (dispatch) => ({
  initRates    : (currencyIds) => dispatch(initRates(currencyIds)),
  pollForRates : (currencyIds) => dispatch(pollForRates(currencyIds)),
  stopPolling  : () => stopPollingForRates()
});

export class ExchangeContainer extends Component {
  static propTypes = {
    initRates    : PropTypes.func.isRequired,
    pollForRates : PropTypes.func.isRequired,
    stopPolling  : PropTypes.func.isRequired,
    children     : PropTypes.node,
    currencyIds  : PropTypes.arrayOf(PropTypes.string).isRequired
  }

  static defaultProps = {
    children: []
  }

  componentDidMount() {
    const { currencyIds } = this.props;
    this.props.initRates(currencyIds);
    this.props.pollForRates(currencyIds);
  }

  componentWillReceiveProps({ currencyIds }) {
    // Upgrading polling if currencies changed
    const oldCurrencyIds = this.props.currencyIds;
    if (currencyIds === oldCurrencyIds) return;

    this.props.pollForRates(currencyIds);

    // Fetching new rates if they were introduced
    const addedCurrencyIds = currencyIds.filter(
      (currencyId) => !oldCurrencyIds.includes(currencyId)
    );
    if (!addedCurrencyIds.length) return;

    this.props.initRates(addedCurrencyIds);
  }

  componentWillUnmount() {
    this.props.stopPolling();
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

export const ConnectedExchangeContainer = connect(
  mapStateToProps, mapDispatchToProps
)(ExchangeContainer);
