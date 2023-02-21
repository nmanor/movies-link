import React from 'react';
import { PropTypes } from 'prop-types';
import styles from './ToggleButtonComponent.module.css';

const id = 'toggle-button';

function ToggleButtonComponent({ text, checked, onChange }) {
  return (
    <label htmlFor={id} className={styles.label}>
      <input type="checkbox" id={id} checked={checked} onChange={onChange} />
      <span className={styles.checkmark}>{text}</span>
    </label>
  );
}

ToggleButtonComponent.propTypes = {
  text: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

ToggleButtonComponent.defaultProps = {
  text: 'Click here',
  checked: false,
  onChange: () => {},
};

export default ToggleButtonComponent;
