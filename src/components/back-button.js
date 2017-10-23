import React from 'react';
import PropTypes from 'prop-types';

export function BackButton({ handleBack }) {
  return <div onClick={handleBack} role="button" className="header-button" tabIndex={0}>Back</div>;
}

BackButton.propTypes = {
  handleBack: PropTypes.func.isRequired
};
