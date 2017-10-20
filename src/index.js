import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import store from 'store';
import { ExchangeContainer, ToContainer, FromContainer } from 'containers';
import { ContentLayout, HeaderLayout } from 'layouts';
import { BackButton, RateButton, ExchangeButton } from 'components';

export default function ExchangeWidget({ handleBack }) {
  return (
    <Provider store={store}>
      <ExchangeContainer>
        <HeaderLayout>
          <BackButton handleBack={handleBack} />
          <RateButton />
          <ExchangeButton />
        </HeaderLayout>
        <ContentLayout>
          {/* <ToContainer />
          <FromContainer /> */}
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
