import React from 'react';
import { PropTypes } from 'prop-types';
import styles from './ButtonComponent.module.css';

function ButtonComponent({ text, accentColor, onClick }) {
  return (
    <button
      className={styles.button}
      style={{ backgroundColor: accentColor }}
      onClick={onClick}
      type="button"
    >
      {text}
    </button>
  );
}

ButtonComponent.propTypes = {
  text: PropTypes.string,
  accentColor: PropTypes.string,
  onClick: PropTypes.func,
};

ButtonComponent.defaultProps = {
  text: 'Click here',
  accentColor: 'rgba(0, 0, 0, 1)',
  onClick: () => {},
};

export default ButtonComponent;
