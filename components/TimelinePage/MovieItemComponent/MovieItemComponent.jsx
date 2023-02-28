import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Image from 'next/image';
import { Parallax } from 'react-scroll-parallax';
import Link from 'next/link';
import styles from './MovieItemComponent.module.css';
import extractBrightestColor, { hexToRGB } from '@/utils/colorExtractor';

const cx = classNames.bind(styles);

export default function MovieItemComponent({
  noLine, movie: {
    title, posterUrl, date, movies, actors,
  },
}) {
  const [accentColor, setAccentColor] = useState('#FFF');

  const updateAccentColor = async () => {
    const color = await extractBrightestColor(posterUrl);
    let [r, g, b] = hexToRGB(color);

    const FACTOR = 1.2;
    r = Math.min(Math.round(r * FACTOR), 255);
    g = Math.min(Math.round(g * FACTOR), 255);
    b = Math.min(Math.round(b * FACTOR), 255);

    setAccentColor(`rgb(${r},${g},${b})`);
  };
  useEffect(() => { updateAccentColor(); }, [posterUrl]);

  return (
    <Parallax speed={-8}>
      <Link className={styles.container} href="/movie/505642">
        <div className={styles.lineContainer}>
          <div className={styles.circle} style={{ backgroundColor: accentColor }} />
          <div className={cx(styles.line, { [styles.invisible]: noLine })} />
        </div>
        <div className={styles.content}>
          <h1 style={{ color: accentColor }}>{title}</h1>
          <p>{date && date.toLocaleDateString('he-IL')}</p>
          <p>{actors && movies ? `${actors} familiar actors from ${movies} different movies` : 'No familiar actors.'}</p>
        </div>
        <Parallax scale={[0.8, 1.1, 'easeInOut']}>
          <Image
            src={posterUrl}
            alt={`Image of ${title}`}
            width={110}
            height={150}
          />
        </Parallax>
      </Link>
    </Parallax>
  );
}

MovieItemComponent.propTypes = {
  noLine: PropTypes.bool,
  movie: PropTypes.instanceOf(Object),
};

MovieItemComponent.defaultProps = {
  noLine: false,
  movie: {},
};
