import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import classNames from 'classnames/bind';
import ToggleButtonComponent from '../ToggleButtonComponent/ToggleButtonComponent';
import BackArrowSVGComponent from '../svg/BackArrowSVGComponent';
import NextArrowSVGComponent from '../svg/NextArrowSVGComponent';
import DoubleBackArrowSVGComponent from '../svg/DoubleBackArrowSVGComponent';
import DoubleNextArrowSVGComponent from '../svg/DoubleNextArrowSVGComponent';
import styles from './DatePickerComponent.module.css';

const cx = classNames.bind(styles);
const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function DatePickerComponent({
  value, onChange, accentColor, allowUndefined,
}) {
  const [month, setMonth] = useState(value.getMonth());
  const [year, setYear] = useState(value.getFullYear());
  const [day, setDay] = useState(value.getDate());
  const [isUnknown, setIsUnknown] = useState(false);

  const onToggleChange = () => setIsUnknown((val) => !val);

  const addMonth = () => {
    const newMonth = (month + 1) % 12;
    setMonth(newMonth);
    if (newMonth === 0) setYear((val) => val + 1);
  };
  const downloadMonth = () => {
    const newMonth = month - 1 >= 0 ? month - 1 : 11;
    setMonth(newMonth);
    if (newMonth === 11) setYear((val) => val - 1);
  };

  const addYear = () => setYear((val) => val + 1);
  const downloadYear = () => setYear((val) => val - 1);

  const changeDay = (newDay) => setDay(newDay);

  useEffect(() => {
    let result;
    if (!isUnknown) result = new Date(year, month, day);
    onChange({ target: { value: result } });
  }, [year, month, day, isUnknown]);

  const renderMonth = (_month, _year, _day) => {
    const result = [];
    let week = [];
    let weekCounter = 0;

    const date = new Date(_year, _month, 1);
    let dayOfWeek = 0;
    while (date.getDay() !== dayOfWeek) {
      week.push(<div key={`postfix${dayOfWeek}`} />);
      dayOfWeek += 1;
    }

    while (date.getMonth() === _month) {
      const currentDay = date.getDate();
      const id = String(date.getTime());
      week.push(
        <label
          key={`label${id}`}
          htmlFor={id}
        >
          <input
            id={id}
            type="radio"
            name="calendar"
            checked={_day === currentDay}
            onChange={() => changeDay(currentDay)}
          />
          <span
            className={styles.checkmark}
            style={{ backgroundColor: _day === currentDay ? accentColor : 'transparent' }}
          >
            {currentDay}
          </span>
        </label>,
      );
      if (date.getDay() === 6) {
        result.push({ html: week, key: `week${weekCounter}` });
        week = [];
        weekCounter += 1;
      }
      date.setDate(date.getDate() + 1);
    }

    dayOfWeek = date.getDay();
    while (dayOfWeek <= 6) {
      week.push(<div key={`prefix${dayOfWeek}`} />);
      dayOfWeek += 1;
    }
    result.push({ html: week, key: `week${weekCounter}` });

    return result;
  };

  return (
    <div className={styles.container}>
      <div className={cx({ [styles.calenderContainer]: isUnknown })}>
        <div className={styles.buttonsBar}>
          <button type="button" onClick={addYear}>
            <DoubleBackArrowSVGComponent className={styles.svgIcon} />
          </button>
          <button type="button" onClick={addMonth}>
            <BackArrowSVGComponent className={styles.svgIcon} />
          </button>
          <p>
            {monthNames[month]}
            {' '}
            {year}
          </p>
          <button type="button" onClick={downloadMonth}>
            <NextArrowSVGComponent className={styles.svgIcon} />
          </button>
          <button type="button" onClick={downloadYear}>
            <DoubleNextArrowSVGComponent className={styles.svgIcon} />
          </button>
        </div>
        <div className={styles.calender}>
          <div className={`${styles.week} ${styles.days}`}>
            {dayNames.map((name) => <p key={`day${name}`}>{name}</p>)}
          </div>
          {renderMonth(month, year, day).map(
            (week) => (
              <div
                key={week.key}
                className={styles.week}
              >
                {week.html}
              </div>
            ),
          )}
        </div>
      </div>
      {allowUndefined && (
      <>
        <div className={styles.orContainer}>
          <div />
          <p>Or</p>
          <div />
        </div>
        <ToggleButtonComponent
          text="I can't remember"
          checked={isUnknown}
          onChange={onToggleChange}
        />
      </>
      )}
    </div>
  );
}

DatePickerComponent.propTypes = {
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
  accentColor: PropTypes.string,
  allowUndefined: PropTypes.bool,
};

DatePickerComponent.defaultProps = {
  value: new Date(),
  onChange: () => {},
  accentColor: '#FFF',
  allowUndefined: false,
};

export default DatePickerComponent;
