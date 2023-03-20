import React from 'react';
import { PropTypes } from 'prop-types';
import Image from 'next/image';
import ClickableListItemComponent from '../ClickableListItemComponent/ClickableListItemComponent';
import styles from './MediaComponent.module.css';

function MediaComponent({
  media: {
    id,
    posterUrl,
    name,
    character,
  },
  accentColor,
}) {
  return (
    <ClickableListItemComponent
      href={`/media/${id}`}
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
          {character && ` as ${character}`}
        </p>
      </div>
    </ClickableListItemComponent>
  );
}

MediaComponent.propTypes = {
  media: PropTypes.instanceOf(Object),
  accentColor: PropTypes.string,
};

MediaComponent.defaultProps = {
  media: {},
  accentColor: '#FFF',
};

export default MediaComponent;
