import React from 'react';
import classNames from 'classnames/bind';
import { PropTypes } from 'prop-types';
import styles from './SwipeableListComponent.module.css';
import { groupNameToAcronyms } from '../../../utils/utils';
import BlankUserSVGComponent from '../../shared/svg/User/BlankUserSVGComponent';
import AddCalendarSVGComponent from '../../shared/svg/AddCalendarSVGComponent';
import RemoveSVGComponent from '../../shared/svg/RemoveSVGComponent';

const cx = classNames.bind(styles);
export const ActionType = { Add: 0, Remove: 1 };

function formatDate(date) {
  const number = Number(date);
  if (number && number > 0) {
    return new Date(number).toLocaleDateString('he-IL');
  }
  return 'Unknown date';
}

export default function SwipeableListComponent({ groups, onSwipe, actionType }) {
  let touchStartX = null;
  let touchEndX = null;
  let container = null;

  function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    container = event.target.closest(`.${styles.swipeable}`);

    setTimeout(() => {
      const icons = container.parentNode.getElementsByClassName(styles.svgIcon);
      for (let i = 0; i < icons.length; i += 1) {
        icons.item(i).style.transform = 'scale(100%)';
      }
    }, 300);
  }

  function handleTouchMove(event) {
    touchEndX = event.touches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    if (container) container.style.transform = `translateX(${deltaX}px)`;
  }

  function handleTouchEnd(event, group) {
    const deltaX = touchEndX - touchStartX;
    if (Math.abs(deltaX) >= 100) onSwipe(group.id);

    touchStartX = null;
    touchEndX = null;

    setTimeout(() => {
      container = event.target.closest(`.${styles.swipeable}`);
      container.style.transform = null;

      const icons = container.parentNode.getElementsByClassName(styles.svgIcon);
      for (let i = 0; i < icons.length; i += 1) {
        icons.item(i).style.transform = null;
      }

      container = null;
    }, 300);
  }

  return (
    <ul className={styles.list}>
      {groups.map((group) => (
        <li
          className={styles.li}
          key={group.id}
        >

          <div
            className={styles.swipeable}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={(event) => handleTouchEnd(event, group)}
          >
            <p
              className={styles.groupIcon}
              style={{ backgroundColor: group.color }}
            >
              {group.id !== -1 ? groupNameToAcronyms(group.name) : <BlankUserSVGComponent />}
            </p>
            <p>
              {group.name}
              <span className={styles.date}>
                {actionType === ActionType.Remove && formatDate(group.date)}
              </span>
            </p>
          </div>

          {actionType === ActionType.Remove && (
          <>
            <RemoveSVGComponent className={cx(styles.svgIcon, styles.right)} />
            <RemoveSVGComponent className={cx(styles.svgIcon, styles.left)} />
          </>
          )}
          {actionType === ActionType.Add && (
          <>
            <AddCalendarSVGComponent className={cx(styles.svgIcon, styles.right)} />
            <AddCalendarSVGComponent className={cx(styles.svgIcon, styles.left)} />
          </>
          )}
        </li>
      ))}
    </ul>
  );
}

SwipeableListComponent.propTypes = {
  groups: PropTypes.arrayOf(Object),
  onSwipe: PropTypes.func,
  actionType: PropTypes.oneOf([...Object.values(ActionType)]),
};

SwipeableListComponent.defaultProps = {
  groups: [],
  onSwipe: () => {},
  actionType: ActionType.Remove,
};
