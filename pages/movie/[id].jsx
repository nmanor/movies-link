import React from 'react';
import { PropTypes } from 'prop-types';
import axios from 'axios';
import ButtonComponent from '../../components/shared/ButtonComponent/ButtonComponent';
import MovieMetadataComponent from '../../components/MoviePage/MovieMetadataComponent/MovieMetadataComponent';
import BackButtonComponent from '../../components/MoviePage/BackButtonComponent/BackButtonComponent';
import styles from './movie.module.css';

const palette = require('image-palette');
const pixels = require('image-pixels');

function Movie({
  posterUrl, name, mediaType, distributionYear, duration, knownActors, accentColor,
}) {
  return (
    <>
      <BackButtonComponent accentColor={accentColor} />
      <div className={styles.parallax} style={{ 'background-image': `url(${posterUrl})` }} />
      <article className={styles.container}>
        <div className={styles.containerCorner} />
        <div className={styles.header}>
          <h1>{name}</h1>
          <MovieMetadataComponent
            mediaType={mediaType}
            distributionYear={distributionYear}
            duration={duration}
            accentColor={accentColor}
          />
          <ButtonComponent
            accentColor={accentColor}
            text="I watched this movie"
          />
        </div>
      </article>
    </>
  );
}

Movie.propTypes = {
  posterUrl: PropTypes.string,
  name: PropTypes.string,
  mediaType: PropTypes.string,
  distributionYear: PropTypes.string,
  duration: PropTypes.oneOfType(Object),
  knownActors: PropTypes.oneOfType(Array),
  accentColor: PropTypes.string,
};

Movie.defaultProps = {
  posterUrl: '',
  name: 'unknown',
  mediaType: 'unknown',
  distributionYear: 'unknown',
  duration: { hours: 0, minutes: 0 },
  knownActors: [],
  accentColor: 'rgba(0, 0, 0, 1)',
};

export async function getServerSideProps() {
  const res = await axios.get(`${process.env.BASE_URL}/api/movies/0`);
  let data = {};
  if (res.status === 200) {
    data = res.data;

    const { colors } = palette(await pixels(data.posterUrl));
    const sumArray = (arr) => arr.reduce((a, b) => a + b);
    const lightest = colors.reduce(
      (max, current) => (sumArray(max) > sumArray(current) ? max : current),
    );
    data.accentColor = `rgba(${lightest[0]}, ${lightest[1]}, ${lightest[2]}, ${lightest[3]})`;
  }

  return { props: { ...data } };
}

export default Movie;
