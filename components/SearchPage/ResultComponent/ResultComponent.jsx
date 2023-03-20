import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import Image from 'next/image';
import ClickableListItemComponent from '../../shared/ClickableListItemComponent/ClickableListItemComponent';
import styles from './ResultComponent.module.css';

function ResultComponent({
  data: {
    id,
    title,
    releaseYear,
    mediaType,
    imageUrl,
  },
  priority,
}) {
  const [src, setSrc] = useState(imageUrl);
  const handleError = () => {
    setSrc('/images/oscar-trophy.png');
  };

  return (
    <ClickableListItemComponent
      href={`/media/${id}`}
    >
      <Image
        className={styles.image}
        alt={`Image of ${title}`}
        src={src}
        width={70}
        height={70}
        onError={handleError}
        priority={priority}
      />
      <div>
        <p>{title}</p>
        <p className={styles.secondaryText}>
          {mediaType}
          {' '}
          |
          {' '}
          {releaseYear}
        </p>
      </div>
    </ClickableListItemComponent>
  );
}

ResultComponent.propTypes = {
  data: PropTypes.instanceOf(Object),
  priority: PropTypes.bool,
};

ResultComponent.defaultProps = {
  data: {},
  priority: false,
};

export default ResultComponent;
