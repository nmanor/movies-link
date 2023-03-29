import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './CounterButtonComponent.module.css';
import NextArrowSVGComponent from '../../shared/svg/NextArrowSVGComponent';

const cx = classNames.bind(styles);

export default function CounterButtonComponent({ count, onClick }) {
  const [innerCounter, setInnerCounter] = useState(0);
  const [blur, setBlur] = useState(false);

  useEffect(() => {
    setBlur(true);
    setTimeout(() => {
      setInnerCounter(count);
      setBlur(false);
    }, 200);
  }, [count]);

  return (
    <button
      type="button"
      className={styles.counter}
      onClick={onClick}
    >
      <p>
        {innerCounter > 0 ? (
          <>
            <span className={cx({ [styles.blur]: blur })}>{innerCounter}</span>
            {' '}
            media
          </>
        )
          : 'Skip'}
      </p>
      <NextArrowSVGComponent />
    </button>
  );
}

CounterButtonComponent.propTypes = {
  onClick: PropTypes.func,
  count: PropTypes.number,
};

CounterButtonComponent.defaultProps = {
  onClick: () => {},
  count: 0,
};
