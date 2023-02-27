import React from 'react';
import { PropTypes } from 'prop-types';
import { useRouter } from 'next/router';
import BackSVGComponent from '../svg/BackSVGComponent';
import styles from './BackButtonComponent.module.css';

function BackButtonComponent({ accentColor }) {
  const router = useRouter();
  const goBack = () => router.back();

  return (
    <button
      className={styles.container}
      onClick={goBack}
      type="button"
    >
      <div className={styles.blurBorder} />
      <BackSVGComponent style={{ fill: accentColor }} className={styles.svgIcon} />
    </button>
  );
}

BackButtonComponent.propTypes = {
  accentColor: PropTypes.string,
};

BackButtonComponent.defaultProps = {
  accentColor: 'rgba(0, 0, 0, 1)',
};

export default BackButtonComponent;
