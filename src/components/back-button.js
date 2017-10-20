import React from 'react';
import PropTypes from 'prop-types';

export function BackButton({ handleBack }) {
  return <button onClick={handleBack} />;
}

BackButton.propTypes = {
  handleBack: PropTypes.func.isRequired
};
