import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './ColorPickerComponent.module.css';
import CheckSVGComponent from '../../shared/svg/CheckSVGComponent';

const cx = classNames.bind(styles);

export default function ColorPickerComponent({ colors, value, onChange }) {
  return (
    <div className={styles.container}>
      {colors.map((color) => (
        <label className={styles.color} htmlFor={color} key={color}>
          <input
            id={color}
            name="color-picker"
            type="radio"
            value={color}
            checked={color === value}
            onChange={onChange}
          />
          <div className={styles.colorCircle} style={{ backgroundColor: color }} />
          <div className={styles.checkmark} style={{ border: `${color} 4px solid` }} />
          <CheckSVGComponent className={cx(styles.svgIcon, styles.checkmark)} />
        </label>
      ))}
    </div>
  );
}

ColorPickerComponent.propTypes = {
  colors: PropTypes.arrayOf(String),
  value: PropTypes.string,
  onChange: PropTypes.func,
};

ColorPickerComponent.defaultProps = {
  colors: ['#F00', '#0F0', '#00F', '#000', '#FFF'],
  value: '#FFF',
  onChange: () => {},
};
