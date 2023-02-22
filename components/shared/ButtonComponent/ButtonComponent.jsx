import React from 'react';
import { PropTypes } from 'prop-types';
import styles from './ButtonComponent.module.css';

function ButtonComponent({
  accentColor, onClick, children,
}) {
  return (
    <button
      className={styles.button}
      style={{ backgroundColor: accentColor }}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

ButtonComponent.propTypes = {
  children: PropTypes.node,
  accentColor: PropTypes.string,
  onClick: PropTypes.func,
};

ButtonComponent.defaultProps = {
  children: 'Click here',
  accentColor: 'rgba(0, 0, 0, 1)',
  onClick: () => {},
};

export default ButtonComponent;
