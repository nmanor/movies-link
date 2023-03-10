import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Parallax, ParallaxBanner } from 'react-scroll-parallax';
import Link from 'next/link';
import styles from './MovieItemComponent.module.css';
import extractBrightestColor, { colorLightening } from '../../../utils/colorExtractor';

const cx = classNames.bind(styles);
const RGB_FACTOR = 1.2;

export default function MovieItemComponent({
  noLine, priority, movie: {
    name, posterUrl, date, id, ref, groupName, groupColor,
  },
}) {
  const [accentColor, setAccentColor] = useState('#FFF');
  const updateAccentColor = async () => {
    const color = await extractBrightestColor(posterUrl);
    const lighterColor = colorLightening(color, RGB_FACTOR);
    setAccentColor(lighterColor);
  };
  useEffect(() => { updateAccentColor(); }, [posterUrl]);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.date}>
          <p>{date ? date.getFullYear() : '0000'}</p>
          <p>{date ? date.toLocaleString('en', { month: 'short' }).toUpperCase() : 'XXX'}</p>
          <p>{String(date ? date.getDate() : 0).padStart(2, '0')}</p>
        </div>
        <div className={styles.line} />
      </div>
      <Parallax scale={[0.9, 1]} className={styles.parallax}>
        <Link className={styles.movieCard} href={`/movie/${id}`} ref={ref}>
          <ParallaxBanner
            layers={[{ image: posterUrl, speed: 2 }]}
            className={styles.movieImage}
          />
          <div className={styles.blurredEdge} />
          <div className={styles.movieDetails}>
            <h3>{name}</h3>
          </div>
          {groupName && groupColor && (
          <div className={styles.groupTag}>
            <p style={{ color: colorLightening(groupColor, 0.85) }}>Watched along with</p>
            <p style={{ backgroundColor: groupColor }}>
              {groupName}
            </p>
          </div>
          )}
        </Link>
      </Parallax>
    </div>
  );
}

MovieItemComponent.propTypes = {
  noLine: PropTypes.bool,
  movie: PropTypes.instanceOf(Object),
  priority: PropTypes.bool,
};

MovieItemComponent.defaultProps = {
  noLine: false,
  movie: {},
  priority: false,
};
