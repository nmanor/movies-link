import React from 'react';
import { PropTypes } from 'prop-types';
import BackSVGComponent from '../../svg/BackSVGComponent';
import styles from './BackButtonComponent.module.css';

function BackButtonComponent({ onClick, accentColor }) {
  return (
    <button
      className={styles.container}
      onClick={onClick}
      type="button"
    >
      <div className={styles.blurBorder} />
      <BackSVGComponent style={{ fill: accentColor }} className={styles.svgIcon} />
    </button>
  );
}

BackButtonComponent.propTypes = {
  onClick: PropTypes.func,
  accentColor: PropTypes.string,
};

BackButtonComponent.defaultProps = {
  onClick: () => {},
  accentColor: 'rgba(0, 0, 0, 1)',
};

export default BackButtonComponent;
