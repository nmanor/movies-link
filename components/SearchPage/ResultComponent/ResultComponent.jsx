import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import Image from 'next/image';
import classNames from 'classnames/bind';
import ClickableListItemComponent from '../../shared/ClickableListItemComponent/ClickableListItemComponent';
import styles from './ResultComponent.module.css';
import EntityType from '../../../utils/enums';

const cx = classNames.bind(styles);

function ResultComponent({
  data: {
    id,
    name,
    releaseYear,
    entityType,
    imageUrl,
  },
  delay,
  priority,
}) {
  const [src, setSrc] = useState(imageUrl);
  const [isSliding, setIsSliding] = useState(true);

  const handleError = () => {
    setSrc('/images/oscar-trophy.png');
  };

  useEffect(() => {
    setTimeout(() => setIsSliding(false), delay);
  }, []);

  return (
    <div
      className={cx(styles.listItem, { [styles.slideFromLeft]: isSliding })}
    >
      <ClickableListItemComponent
        href={`/${entityType === EntityType.Actor ? 'actor' : 'media'}/${id}`}
      >
        <Image
          className={styles.image}
          alt={`Image of ${name}`}
          src={src}
          width={70}
          height={70}
          onError={handleError}
          priority={priority}
        />
        <div>
          <p>{name}</p>
          <p className={styles.secondaryText}>
            {entityType}
            {entityType !== EntityType.Actor && ` | ${releaseYear}`}
          </p>
        </div>
      </ClickableListItemComponent>
    </div>
  );
}

ResultComponent.propTypes = {
  data: PropTypes.instanceOf(Object),
  priority: PropTypes.bool,
  delay: PropTypes.number,
};

ResultComponent.defaultProps = {
  data: {},
  priority: false,
  delay: 0,
};

export default ResultComponent;
