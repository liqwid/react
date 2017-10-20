import React from 'react';
import PropTypes from 'prop-types';

export function HeaderLayout({ children }) {
  return <div>{children}</div>;
}

HeaderLayout.propTypes = {
  children: PropTypes.node
};

HeaderLayout.defaultProps = {
  children: []
};
