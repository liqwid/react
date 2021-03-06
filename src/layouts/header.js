import React from 'react';
import PropTypes from 'prop-types';
import NavBar from 'antd-mobile/lib/nav-bar';
import 'antd-mobile/lib/nav-bar/style/css';
import './styles/header.css';

export function HeaderLayout({ children, leftButton, rightButton }) {
  return (<NavBar
    className={'exchange-header'}
    leftContent={leftButton}
    rightContent={rightButton}
  >{children}</NavBar>);
}

HeaderLayout.propTypes = {
  children: PropTypes.node
};

HeaderLayout.defaultProps = {
  children: []
};
