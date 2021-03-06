import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import CustomKeyboard, { KeyboardItem } from 'antd-mobile/lib/input-item/CustomKeyboard';
import 'antd-mobile/lib/input-item/style/css';
import { updateExchangeAmount } from 'action-creators';
import { bind } from 'decko';
import './styles/amount-keyboard.css';

const DECIMAL          = '.';
const DELETE           = 'delete';
const ZERO             = '0';
const MAX_INPUT_LENGTH = 8;

export class CustomizedKeyboard extends CustomKeyboard {
  onKeyboardClick = (e, value) => {
    this.props.onClick(value);
  }

  render() {
    const { prefixCls } = this.props;

    const wrapperCls = classnames(`${prefixCls}-wrapper`, 'amount-keyboard');

    return (
      <div
        className={wrapperCls}
        ref={el => { this.antmKeyboard = el; }}
      >
        <table>
          <tbody>
            <tr>
              {['1', '2', '3'].map((item, index) => this.renderKeyboardItem(item, index))}
            </tr>
            <tr>
              {['4', '5', '6'].map((item, index) => this.renderKeyboardItem(item, index))}
            </tr>
            <tr>
              {['7', '8', '9'].map((item, index) => this.renderKeyboardItem(item, index))}
            </tr>
            <tr>
              {[DECIMAL, '0'].map((item, index) => this.renderKeyboardItem(item, index))}
              <KeyboardItem className={`keyboard-${DELETE}`} onClick={this.onKeyboardClick} />
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = ({ currenciesById, from, to }) => {
  const fromCurrency = currenciesById[from];

  if (!fromCurrency) {
    return {
      disabled : true,
      from     : null
    };
  }

  return {
    from,
    disabled       : from === to,
    exchangeAmount : currenciesById[from].exchangeAmount
  };
};
const mapDispatchToProps = { updateExchangeAmount };

export class AmountKeyboard extends Component {
  static propTypes = {
    from                 : PropTypes.string.isRequired,
    disabled             : PropTypes.bool.isRequired,
    exchangeAmount       : PropTypes.string,
    updateExchangeAmount : PropTypes.func.isRequired
  };

  static defaultProps = {
    exchangeAmount: ''
  };

  shouldComponentUpdate({ disabled }) {
    return (disabled !== this.props.disabled);
  }

  @bind
  handleClick(KeyboardItemValue) {
    const { exchangeAmount, from, disabled } = this.props;
    const value = exchangeAmount;

    let valueAfterChange;

    if (disabled) return;
    if (value.length >= MAX_INPUT_LENGTH && KeyboardItemValue !== DELETE) return;

    // Handles deletion
    if (KeyboardItemValue === DELETE) {
      valueAfterChange = value.slice(0, value.length - 1);

      // Does not allow second decimal
    } else if (KeyboardItemValue === DECIMAL && value.indexOf(DECIMAL) > 0) {
      valueAfterChange = value;

      // Adds zero before first decimal
    } else if (KeyboardItemValue === DECIMAL && value === '') {
      valueAfterChange = value + ZERO + DECIMAL;

      // Does not allow more zeroes if value is already a zero
    } else if (KeyboardItemValue === ZERO && value === ZERO) {
      valueAfterChange = value;

      // Replaces zero with inputed value
    } else if (value === ZERO && KeyboardItemValue !== DECIMAL) {
      valueAfterChange = KeyboardItemValue;

    // Handles number addition
    } else {
      valueAfterChange = value + KeyboardItemValue;
    }
    this.props.updateExchangeAmount(from, valueAfterChange);
  }

  render() {
    const { disabled } = this.props;
    const keyboardCls = classnames({ disabled });
    return <span className={keyboardCls}><CustomizedKeyboard onClick={this.handleClick} /></span>;
  }
}

export const ConnectedAmountKeyboard = connect(mapStateToProps, mapDispatchToProps)(AmountKeyboard);
