import React from 'react';
import PropTypes from 'prop-types';
import './styles/content.css';

export function ContentLayout({ children }) {
  return (<div className="content">{children}</div>);
}

ContentLayout.propTypes = {
  children: PropTypes.node
};

ContentLayout.defaultProps = {
  children: []
};
