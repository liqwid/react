import React from 'react';
import { Provider } from 'react-redux';
import store from 'store';
import { ExchangeContainer } from 'containers';

export default function ExchangeWidget() {
  return (
    <Provider store={store}>
      <ExchangeContainer />
    </Provider>
  );
}
