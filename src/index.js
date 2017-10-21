import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import store from 'store';
import { ExchangeContainer, ToContainer, FromContainer } from 'containers';
import { ContentLayout, HeaderLayout } from 'layouts';
import { BackButton, RateButton, ExchangeButton, AmountKeyboard } from 'components';

export default function ExchangeWidget({ handleBack }) {
  return (
    <Provider store={store}>
      <ExchangeContainer>
        <HeaderLayout
          leftButton={<BackButton handleBack={handleBack} />}
          rightButton={<ExchangeButton />}
        >
          <RateButton />
        </HeaderLayout>
        <ContentLayout>
          <FromContainer />
          <ToContainer />
          <AmountKeyboard />
        </ContentLayout>
      </ExchangeContainer>
    </Provider>
  );
}

ExchangeWidget.propTypes = {
  handleBack: PropTypes.func
};

ExchangeWidget.defaultProps = {
  handleBack: () => {}
};
