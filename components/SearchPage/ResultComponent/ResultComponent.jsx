import React from 'react';
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
  return (
    <ClickableListItemComponent
      href={`/${mediaType.toLowerCase()}/${id}`}
    >
      <Image
        alt={`Image of ${title}`}
        src={imageUrl}
        width={70}
        height={70}
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
