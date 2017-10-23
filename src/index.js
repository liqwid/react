import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import store from 'store';
import { ExchangeContainer, ToContainer, FromContainer, ErrorNoticeContainer } from 'containers';
import { ContentLayout, HeaderLayout } from 'layouts';
import { BackButton, RateButton, ExchangeButton, AmountKeyboard } from 'components';
import './overrides.css';
import './containers/styles/currency-carousel-item.css';

export default function ExchangeWidget({ handleBack, handleShowRates }) {
  return (
    <Provider store={store}>
      <ExchangeContainer>
        <HeaderLayout
          leftButton={<BackButton handleBack={handleBack} />}
          rightButton={<ExchangeButton />}
        >
          <RateButton handleShowRates={handleShowRates} />
        </HeaderLayout>
        <ContentLayout>
          <ErrorNoticeContainer />
          <FromContainer />
          <ToContainer />
          <AmountKeyboard />
        </ContentLayout>
      </ExchangeContainer>
    </Provider>
  );
}

ExchangeWidget.propTypes = {
  handleBack      : PropTypes.func,
  handleShowRates : PropTypes.func
};

ExchangeWidget.defaultProps = {
  handleBack      : () => {},
  handleShowRates : () => {}
};
