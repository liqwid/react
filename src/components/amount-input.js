import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bind } from 'decko';
import './styles/amount-input.css';

export const mapStateToProps = (state, { currencyId }) =>
  ({ currenciesById, to, from }) => ({
    sameCurrencies : currencyId === to,
    amount         : currenciesById[currencyId].exchangeAmount,
    active         : currencyId === from
  });

export class AmountInput extends Component {
  static propTypes = {
    amount         : PropTypes.string.isRequired,
    sameCurrencies : PropTypes.bool.isRequired,
    active         : PropTypes.bool.isRequired
  };

  componentWillReceiveProps({ active }) {
    const { input } = this;
    if (input && active) {
      input.focus();

      // HACK: slider frame gets scrolled to focused item on imput focus:
      // this breaks carousel transition positions
      input.closest('.slider-frame').scrollLeft = 0;
    }
  }

  @bind
  bindInput(input) {
    this.input = input;
  }

  @bind
  focus(e) {
    if (this.props.active) e.target.focus();
  }

  render() {
    const { amount, sameCurrencies, active } = this.props;
    let formattedAmount = amount;

    if (amount.length) formattedAmount = `-${amount}`;
    return (
      <input
        autoFocus={active}
        ref={this.bindInput}
        value={formattedAmount}
        hidden={sameCurrencies}
        className="amount-input"
        onBlur={this.focus}
        readOnly
      />
    );
  }
}

export const ConnectedAmountInput = connect(mapStateToProps)(AmountInput);
