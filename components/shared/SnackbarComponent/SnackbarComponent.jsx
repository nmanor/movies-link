import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './SnackbarComponent.module.css';
import UndoSVGComponent from '../svg/UndoSVGComponent';

const cx = classNames.bind(styles);

/**
 * Show a popup message that disappears after `delay` time.
 * Note that if you won't change the `show` state inside your parent component after `onHiding`
 * fired, you won't be able to show the snackbar again until you do so.
 * @param show {boolean} Is the message displayed
 * @param message {string} The message that displayed
 * @param delay {number} The delay time before closing the message in ms
 * @param accentColor {string} The font color of the undo button
 * @param onHiding {function} A function that is activated when the message is closed
 * @param onUndo {function} A function that is activated when the undo button clicked
 */
export default function SnackbarComponent({
  show, message, delay, accentColor, onHiding, onUndo,
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
  }, [show, isShow, message, delay, onUndo]);

  const handleOnClick = useCallback(() => {
    setIsShow(false);
    onUndo();
  }, [onUndo]);

  return (
    <div className={cx(styles.toast, { [styles.show]: isShow })}>
      <p>{message}</p>
      {onUndo && (
      <>
        <button className={styles.undoButton} type="button" onClick={handleOnClick}>
          <UndoSVGComponent fill={accentColor} />
        </button>
        <div
          className={cx(styles.timerBar, { [styles.show]: isShow })}
          style={{ backgroundColor: accentColor, animationDuration: `${delay}ms` }}
        />
      </>
      )}
    </div>
  );
}

SnackbarComponent.propTypes = {
  show: PropTypes.bool,
  message: PropTypes.string,
  delay: PropTypes.number,
  accentColor: PropTypes.string,
  onHiding: PropTypes.func,
  onUndo: PropTypes.func,
};

SnackbarComponent.defaultProps = {
  show: false,
  message: '',
  delay: 4000,
  accentColor: '#FFF',
  onHiding: () => {},
  onUndo: null,
};
