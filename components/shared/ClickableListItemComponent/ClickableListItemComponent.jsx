import React from 'react';
import { PropTypes } from 'prop-types';
import Link from 'next/link';
import NextArrowSVGComponent from '../svg/NextArrowSVGComponent';
import styles from './ClickableListItemComponent.module.css';

function ClickableListItemComponent({ children, href, accentColor }) {
  return (
    <Link
      href={href}
      className={styles.container}
      type="button"
    >
      {children}
      <NextArrowSVGComponent className={styles.svgIcon} style={{ fill: accentColor }} />
    </Link>
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
