import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import CustomKeyboard, { KeyboardItem } from 'antd-mobile/lib/input-item/CustomKeyboard';
import 'antd-mobile/lib/input-item/style/css';
import { updateExchangeAmount } from 'action-creators';
import { bind } from 'decko';

const DECIMAL = '.';
const DELETE  = 'delete';
const ZERO    = '0';

export class CustomizedKeyboard extends CustomKeyboard {
  onKeyboardClick = (e, value) => {
    this.props.onClick(value);
  }

  render() {
    const { prefixCls } = this.props;

    const wrapperCls = classnames(`${prefixCls}-wrapper`);

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

const mapStateToProps = ({ currenciesById, from }) => ({
  from,
  exchangeAmount: currenciesById[from].exchangeAmount
});
const mapDispatchToProps = { updateExchangeAmount };

export class AmountKeyboard extends Component {
  static propTypes = {
    from                 : PropTypes.string.isRequired,
    exchangeAmount       : PropTypes.string,
    updateExchangeAmount : PropTypes.func.isRequired
  };

  static defaultProps = {
    exchangeAmount: ''
  };

  shouldComponentUpdate() {
    return false;
  }

  @bind
  handleClick(KeyboardItemValue) {
    const { exchangeAmount, from } = this.props;
    const value = exchangeAmount;

    let valueAfterChange;

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
    return <CustomizedKeyboard onClick={this.handleClick} />;
  }
}

export const ConnectedAmountKeyboard = connect(mapStateToProps, mapDispatchToProps)(AmountKeyboard);
