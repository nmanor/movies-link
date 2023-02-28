import React from 'react';
import { PropTypes } from 'prop-types';
import Image from 'next/image';
import ClickableListItemComponent from '../../shared/ClickableListItemComponent/ClickableListItemComponent';
import styles from './ActorComponent.module.css';

function ActorComponent({
  actor: {
    id,
    imageUrl,
    fullName,
    lastMovie,
    totalNumOfMovies,
    character,
  },
  accentColor,
}) {
  return (
    <ClickableListItemComponent
      href={`/actor/${id}`}
      accentColor={accentColor}
    >
      <Image
        alt={`Image of ${fullName}`}
        src={imageUrl}
        width={70}
        height={70}
      />
      <div>
        <p>
          <strong>{character}</strong>
        </p>
        <p className={styles.smallText}>
          <span>{lastMovie}</span>
          {totalNumOfMovies > 1 ? ` and ${totalNumOfMovies - 1} more` : ''}
        </p>
      </div>
    </ClickableListItemComponent>
  );
}

ActorComponent.propTypes = {
  actor: PropTypes.instanceOf(Object),
  accentColor: PropTypes.string,
};

ActorComponent.defaultProps = {
  actor: {},
  accentColor: '#FFF',
};

export default ActorComponent;
