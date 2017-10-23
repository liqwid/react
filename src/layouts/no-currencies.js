import React from 'react';
import './styles/no-currencies.css';

export function NoCurrenciesLayout() {
  return (
    <div className="message-screen">
      <h1>
        You do not have active currencies.
        Please add a currency to proceed
      </h1>
    </div>
  );
}
