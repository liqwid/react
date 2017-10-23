import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bind } from 'decko';
import './styles/amount-input.css';

const mapStateToProps = (state, { currencyId }) =>
  ({ currenciesById, to, from }) => ({
    sameCurrencies : currencyId === to,
    amount         : currenciesById[currencyId].exchangeAmount,
    active         : currencyId === from
  });

export class AmountInput extends Component {
  state = {
    input: null
  };

  componentDidMount() {
    if (this.input && this.props.active) {
      setTimeout(this.input.focus(), 0);
    }
  }

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
    if (this.props.active) input.focus();
  }

  render() {
    const { amount, sameCurrencies, active } = this.props;
    let formattedAmount = amount;

    const focus = (e) => {
      if (!active) return;
      e.target.focus();
    };

    if (amount.length) formattedAmount = `-${amount}`;
    return (
      <input
        autoFocus={active}
        ref={this.bindInput}
        value={formattedAmount}
        hidden={sameCurrencies}
        className="amount-input"
        onBlur={focus}
      />
    );
  }
}

AmountInput.propTypes = {
  amount         : PropTypes.string.isRequired,
  sameCurrencies : PropTypes.bool.isRequired,
  active         : PropTypes.bool.isRequired
};

export const ConnectedAmountInput = connect(mapStateToProps)(AmountInput);
