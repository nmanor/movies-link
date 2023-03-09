import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './SnackbarComponent.module.css';

const cx = classNames.bind(styles);

/**
 * Show a popup message that disappears after `delay` time.
 * Note that if you won't change the `show` state inside your parent component after `onHiding`
 * fired, you won't be able to show the snackbar again until you do so.
 * @param show {boolean} Is the message displayed
 * @param message {string} The message that displayed
 * @param delay {number} The delay time before closing the message
 * @param onHiding {function} A function that is activated when the message is closed
 */
export default function SnackbarComponent({
  show, message, delay, onHiding,
}) {
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    if (show) {
      setIsShow(true);

      setTimeout(() => {
        setIsShow(false);
        onHiding();
      }, delay);
    }
  }, [show]);

  return (
    <div className={cx(styles.toast, { [styles.show]: isShow })}>
      <p>{message}</p>
    </div>
  );
}

SnackbarComponent.propTypes = {
  show: PropTypes.bool,
  message: PropTypes.string,
  delay: PropTypes.number,
  onHiding: PropTypes.func,
};

SnackbarComponent.defaultProps = {
  show: false,
  message: '',
  delay: 3000,
  onHiding: () => {},
};
