import React, { useCallback } from 'react';
import PropTypes, { string } from 'prop-types';
import Image from 'next/image';
import styles from './PostersCollageComponent.module.css';

const width = 100;
const height = 120;
const gridSize = 4;

export default function PostersCollageComponent({ images }) {
  const handleError = useCallback((e) => {
    const { 8: image } = images;
    e.target.src = image;
  }, [images]);

  const renderImage = (src) => (
    <Image
      onError={handleError}
      src={src}
      width={width}
      height={height}
      key={src.slice(48)}
      alt="Movie poster"
    />
  );

  return (
    <div className={styles.table}>
      {[...Array(gridSize).keys()].map((i) => (
        <div className={styles.column} key={`column${i}`}>
          {images.slice(gridSize * i, (gridSize * i) + gridSize).map(renderImage)}
        </div>
      ))}
    </div>
  );
}

PostersCollageComponent.propTypes = {
  images: PropTypes.arrayOf(string),
};

PostersCollageComponent.defaultProps = {
  images: [],
};
