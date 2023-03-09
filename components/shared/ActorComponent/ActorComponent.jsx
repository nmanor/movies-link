import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import Image from 'next/image';
import ClickableListItemComponent from '../ClickableListItemComponent/ClickableListItemComponent';
import styles from './ActorComponent.module.css';
import { colorLightening } from '../../../utils/colorExtractor';

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
  const [src, setSrc] = useState(imageUrl);
  const onError = () => {
    setSrc('/images/oscar-trophy.png');
  };

  return (
    <ClickableListItemComponent
      href={`/actor/${id}`}
      accentColor={accentColor}
    >
      <Image
        style={{ backgroundColor: colorLightening(accentColor, 0.7) }}
        alt={`Image of ${fullName}`}
        src={src}
        width={70}
        height={70}
        onError={onError}
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
