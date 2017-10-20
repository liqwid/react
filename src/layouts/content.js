import React from 'react';
import PropTypes from 'prop-types';

export function ContentLayout({ children }) {
  return (<div>{children}</div>);
}

ContentLayout.propTypes = {
  children: PropTypes.node
};

ContentLayout.defaultProps = {
  children: []
};
