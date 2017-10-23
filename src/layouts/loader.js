import React from 'react';
import './styles/loader.css';

export function LoaderLayout() {
  return (
    <div className="lds-css">
      <div className="lds-eclipse">
        <div />
      </div>
    </div>
  );
}
