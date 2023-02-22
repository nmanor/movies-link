import React from 'react';
import { PropTypes } from 'prop-types';
import NextArrowSVGComponent from '../svg/NextArrowSVGComponent';
import styles from './ClickableListItemComponent.module.css';

function ClickableListItemComponent({ children, href, accentColor }) {
  return (
    <a
      href={href}
      className={styles.container}
      type="button"
    >
      {children}
      <NextArrowSVGComponent className={styles.svgIcon} style={{ fill: accentColor }} />
    </a>
  );
}

ClickableListItemComponent.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
  accentColor: PropTypes.string,
};

ClickableListItemComponent.defaultProps = {
  children: undefined,
  href: '',
  accentColor: '#FFF',
};

export default ClickableListItemComponent;
