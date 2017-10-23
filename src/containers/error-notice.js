import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NoticeBar from 'antd-mobile/lib/notice-bar';
import 'antd-mobile/lib/notice-bar/style/css';
import './styles/error-notice.css';

export const getRatesErrorText = (currencyIds) =>
  `Following rates failed to load: ${currencyIds.join(', ')}`;

export const mapStateToProps = ({ currenciesById }) => {
  const currenciesWithErrors = Object.keys(currenciesById).filter(
    (currencyId) => currenciesById[currencyId].showRatesError
  );
  return {
    showError : Boolean(currenciesWithErrors.length),
    errorText : getRatesErrorText(currenciesWithErrors)
  };
};

export function ErrorNoticeContainer({ showError, errorText }) {
  return (
    <span hidden={!showError}>
      <NoticeBar icon={null} className="error-notice" marqueeProps={{ loop: true }}>{errorText}</NoticeBar>
    </span>
  );
}

ErrorNoticeContainer.propTypes = {
  showError : PropTypes.bool.isRequired,
  errorText : PropTypes.string.isRequired
};

export const ConnectedErrorNoticeContainer = connect(mapStateToProps)(ErrorNoticeContainer);
