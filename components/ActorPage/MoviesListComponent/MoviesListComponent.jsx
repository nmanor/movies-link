import React from 'react';
import { PropTypes } from 'prop-types';
import { Parallax } from 'react-scroll-parallax';
import MovieComponent from '../MovieComponent/MovieComponent';
import styles from './MoviesListComponent.module.css';

function MoviesListComponent({ moviesList, accentColor }) {
  return (
    <Parallax
      speed={3}
      className={styles.container}
    >
      {moviesList.map((movie) => (
        <MovieComponent
          key={movie.id}
          movie={movie}
          accentColor={accentColor}
        />
      ))}
    </Parallax>
  );
}

MoviesListComponent.propTypes = {
  moviesList: PropTypes.arrayOf(Object),
  accentColor: PropTypes.string,
};

MoviesListComponent.defaultProps = {
  moviesList: [],
  accentColor: '#FFF',
};

export default MoviesListComponent;
