import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Image from 'next/image';
import { Parallax } from 'react-scroll-parallax';
import Link from 'next/link';
import styles from './MovieItemComponent.module.css';
import extractBrightestColor, { colorLightening } from '../../../utils/colorExtractor';

const cx = classNames.bind(styles);
const RGB_FACTOR = 1.2;

export default function MovieItemComponent({
  noLine, priority, movie: {
    title, posterUrl, date, movies, actors, movieId, ref,
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
    <Parallax speed={-8}>
      <Link className={styles.container} href={`/movie/${movieId}`} ref={ref}>
        <div className={styles.lineContainer}>
          <div className={styles.circle} style={{ backgroundColor: accentColor }} />
          <div className={cx(styles.line, { [styles.invisible]: noLine })} />
        </div>
        <div className={styles.content}>
          <h1 style={{ color: accentColor }}>{title}</h1>
          <p>{date ? date.toLocaleDateString('he-IL') : 'No date specified'}</p>
          <p>{actors && movies ? `${actors} familiar actors from ${movies} different movies` : 'No familiar actors'}</p>
        </div>
        <Parallax scale={[0.8, 1.1, 'easeInOut']}>
          <Image
            src={posterUrl}
            alt={`Image of ${title}`}
            width={110}
            height={150}
            priority={priority}
          />
        </Parallax>
      </Link>
    </Parallax>
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
