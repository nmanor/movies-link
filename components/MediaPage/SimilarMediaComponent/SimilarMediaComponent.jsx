import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styles from './SimilarMediaComponent.module.css';

export default function SimilarMediaComponent({ media }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollLeft = 0;
  }, [media]);

  return (
    <div className={styles.container}>
      <h3>Similar media</h3>
      <div className={styles.mediaList} ref={containerRef}>
        {media.map((m) => (
          <Link
            key={m.id}
            className={styles.media}
            href={`/media/${m.id}`}
          >
            {m.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

SimilarMediaComponent.propTypes = {
  media: PropTypes.arrayOf(Object),
};

SimilarMediaComponent.defaultProps = {
  media: [],
};
