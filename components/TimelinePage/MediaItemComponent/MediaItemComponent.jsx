import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import styles from './MediaItemComponent.module.css';
import { groupNameToAcronyms } from '../../../utils/utils';
import NextArrowSVGComponent from '../../shared/svg/NextArrowSVGComponent';

export default function MediaItemComponent({
  priority,
  htmlId,
  media: {
    name, posterUrl, date, id, mediaType, groupName, groupColor,
  },
}) {
  return (
    <div className={styles.container} id={htmlId}>
      <div className={styles.side}>
        <div className={styles.circle} />
        <div className={styles.line} />
      </div>
      <Link
        href={`/media/${id}`}
        className={styles.data}
        type="button"
      >
        <Image
          priority={priority}
          src={posterUrl}
          alt={`Image of ${name}`}
          width={120}
          height={180}
          className={styles.mediaImage}
        />
        <div className={styles.movieDetails}>
          {date && (
          <p className={styles.date}>
            {date.toLocaleDateString('he-IL')}
            {groupName && groupColor && (
            <span className={styles.groupIcon} style={{ backgroundColor: groupColor }}>
              {groupNameToAcronyms(groupName)}
            </span>
            )}
          </p>
          )}
          <p className={styles.mediaTitle}>{name}</p>
          <p className={styles.mediaType}>{mediaType}</p>
        </div>
        <NextArrowSVGComponent className={styles.svgIcon} />
      </Link>
    </div>
  );
}

MediaItemComponent.propTypes = {
  priority: PropTypes.bool,
  htmlId: PropTypes.string,
  media: PropTypes.instanceOf(Object),
};

MediaItemComponent.defaultProps = {
  priority: false,
  htmlId: undefined,
  media: {},
};
