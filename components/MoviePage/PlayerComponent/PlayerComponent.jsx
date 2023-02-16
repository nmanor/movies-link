import React from 'react';
import { PropTypes } from 'prop-types';
import Image from 'next/image';
import NextArrowSVGComponent from '@/components/shared/svg/NextArrowSVGComponent';
import styles from './PlayerComponent.module.css';

function PlayerComponent({
  player: {
    imageUrl,
    fullName,
    lastMovie,
    totalNumOfMovies,
  },
  accentColor,
}) {
  return (
    <button
      className={styles.container}
      type="button"
    >
      <Image
        alt={`Image of ${fullName}`}
        src={imageUrl}
        width={70}
        height={70}
      />
      <div>
        <p><strong>{fullName}</strong></p>
        <p className={styles.watchedMovies}>
          <span>{lastMovie}</span>
          {totalNumOfMovies > 1 ? ` and ${totalNumOfMovies - 1} more` : ''}
        </p>
      </div>
      <NextArrowSVGComponent className={styles.svgIcon} style={{ fill: accentColor }} />
    </button>
  );
}

PlayerComponent.propTypes = {
  player: PropTypes.instanceOf(Object),
  accentColor: PropTypes.string,
};

PlayerComponent.defaultProps = {
  player: {},
  accentColor: '#FFF',
};

export default PlayerComponent;
