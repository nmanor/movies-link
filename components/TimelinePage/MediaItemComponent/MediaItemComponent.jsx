import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Parallax, ParallaxBanner } from 'react-scroll-parallax';
import Link from 'next/link';
import styles from './MediaItemComponent.module.css';
import { groupNameToAcronyms } from '../../../utils/utils';

const cx = classNames.bind(styles);

export default function MediaItemComponent({
  showDay,
  showMonth,
  showYear,
  media: {
    name, posterUrl, date, id, ref, groupName, groupColor,
  },
}) {
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.date}>
          <p className={cx({ [styles.show]: showYear })}>
            {date ? date.getFullYear() : '.'}
          </p>
          <p className={cx({ [styles.show]: showMonth })}>
            {date ? date.toLocaleString('en', { month: 'short' }).toUpperCase() : '.'}
          </p>
          <p className={cx({ [styles.show]: showDay })}>
            {String(date ? date.getDate() : 0).padStart(2, '0')}
          </p>
        </div>
        <div className={styles.line} />
      </div>
      <Parallax scale={[0.9, 1]} className={styles.parallax}>
        <Link className={styles.movieCard} href={`/media/${id}`} ref={ref}>
          <ParallaxBanner
            layers={[{ image: posterUrl, speed: 2 }]}
            className={styles.movieImage}
          />
          <div className={styles.blurredEdge} />
          <div className={styles.movieDetails}>
            <h3>{name}</h3>
          </div>
          {groupName && groupColor && (
          <p
            className={styles.groupIcon}
            style={{ backgroundColor: groupColor }}
          >
            {groupNameToAcronyms(groupName)}
          </p>
          )}
        </Link>
      </Parallax>
    </div>
  );
}

MediaItemComponent.propTypes = {
  showDay: PropTypes.bool,
  showMonth: PropTypes.bool,
  showYear: PropTypes.bool,
  media: PropTypes.instanceOf(Object),
};

MediaItemComponent.defaultProps = {
  showDay: false,
  showMonth: false,
  showYear: false,
  media: {},
};
