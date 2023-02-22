import React from 'react';
import { PropTypes } from 'prop-types';
import Image from 'next/image';
import ClickableListItemComponent from '../../shared/ClickableListItemComponent/ClickableListItemComponent';
import styles from './MovieComponent.module.css';

function MovieComponent({
  movie: {
    id,
    posterUrl,
    name,
    character,
  },
  accentColor,
}) {
  return (
    <ClickableListItemComponent
      href={`/movie/${id}`}
      accentColor={accentColor}
    >
      <Image
        alt={`Image of ${name}`}
        src={posterUrl}
        width={70}
        height={70}
      />
      <div>
        <p className={styles.watchedMovies}>
          <span>{name}</span>
          {' '}
          as
          {' '}
          {character}
        </p>
      </div>
    </ClickableListItemComponent>
  );
}

MovieComponent.propTypes = {
  movie: PropTypes.instanceOf(Object),
  accentColor: PropTypes.string,
};

MovieComponent.defaultProps = {
  movie: {},
  accentColor: '#FFF',
};

export default MovieComponent;
