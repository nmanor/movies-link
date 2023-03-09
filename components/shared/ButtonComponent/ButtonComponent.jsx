import React from 'react';
import { PropTypes } from 'prop-types';
import classNames from 'classnames/bind';
import styles from './ButtonComponent.module.css';

const cx = classNames.bind(styles);

function ButtonComponent({
  accentColor, onClick, loading, outline, children,
}) {
  return (
    <button
      className={cx(styles.button, { [styles.loading]: loading })}
      style={{
        backgroundColor: outline ? 'transparent' : accentColor,
        border: outline ? `${accentColor} 2px solid` : '',
        color: outline ? accentColor : 'black',
      }}
      disabled={loading}
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
  loading: PropTypes.bool,
  outline: PropTypes.bool,
  onClick: PropTypes.func,
};

ButtonComponent.defaultProps = {
  children: 'Click here',
  accentColor: 'rgba(0, 0, 0, 1)',
  loading: false,
  outline: false,
  onClick: () => {},
};

export default ButtonComponent;
