import React, { useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './YearsPickerComponent.module.css';

const cx = classNames.bind(styles);

export default function YearsPickerComponent({ years, currentYear, onYearClick }) {
  const refs = Object.fromEntries(years.map((year) => [year, useRef(null)]));

  // useEffect(() => refs[currentYear].current.scrollIntoView({
  //   behavior: 'smooth',
  //   block: 'center',
  //   inline: 'center',
  // }), [currentYear]);

  return (
    <div className={styles.container}>
      {years
        .sort((a, b) => b - a)
        .map((year, i, arr) => (
          <Fragment key={year}>
            <button
              ref={refs[year]}
              onClick={() => onYearClick(year)}
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
  currentYear: PropTypes.number,
  onYearClick: PropTypes.func,
};

YearsPickerComponent.defaultProps = {
  years: [2018, 2019, 2020, 2021, 2022, 2023],
  currentYear: 2020,
  onYearClick: () => {},
};
