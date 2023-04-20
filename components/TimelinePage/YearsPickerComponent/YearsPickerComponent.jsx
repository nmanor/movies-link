import React, { Fragment } from 'react';
import PropTypes, { number, string } from 'prop-types';
import classNames from 'classnames/bind';
import styles from './YearsPickerComponent.module.css';

const cx = classNames.bind(styles);

export default function YearsPickerComponent({ years, onClick, currentYear }) {
  return (
    <div className={styles.container}>
      {years
        .sort((a, b) => b - a)
        .map((year, i, arr) => (
          <Fragment key={year}>
            <button
              onClick={() => onClick(year)}
              type="button"
              className={cx(styles.year, { [styles.selectedYear]: currentYear === year })}
            >
              {year}
            </button>
            {i + 1 !== arr.length && <div className={styles.separator} /> }
          </Fragment>
        ))}
    </div>
  );
}

YearsPickerComponent.propTypes = {
  years: PropTypes.arrayOf(Number),
  onClick: PropTypes.func,
  currentYear: PropTypes.oneOfType(string, number),
};

YearsPickerComponent.defaultProps = {
  years: [2018, 2019, 2020, 2021, 2022, 2023],
  onClick: () => {},
  currentYear: 'unknown',
};
