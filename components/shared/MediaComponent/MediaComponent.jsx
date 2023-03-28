import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import Image from 'next/image';
import ClickableListItemComponent from '../ClickableListItemComponent/ClickableListItemComponent';
import styles from './MediaComponent.module.css';
import { colorLightening } from '@/utils/colorExtractor';

function MediaComponent({
  media: {
    id,
    posterUrl,
    name,
    character,
  },
  accentColor,
}) {
  const [src, setSrc] = useState(posterUrl);
  const onError = () => {
    setSrc('/images/oscar-trophy.png');
  };

  return (
    <ClickableListItemComponent
      href={`/media/${id}`}
      accentColor={accentColor}
    >
      <Image
        style={{ backgroundColor: colorLightening(accentColor, 0.7) }}
        alt={`Image of ${name}`}
        src={src}
        width={70}
        height={70}
        onError={onError}
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
