import React from 'react';
import { PropTypes } from 'prop-types';
import axios from 'axios';
import { ParallaxBanner, ParallaxProvider } from 'react-scroll-parallax';
import ButtonComponent from '../../components/shared/ButtonComponent/ButtonComponent';
import MovieMetadataComponent from '../../components/MoviePage/MovieMetadataComponent/MovieMetadataComponent';
import BackButtonComponent from '../../components/MoviePage/BackButtonComponent/BackButtonComponent';
import PlayersListComponent from '@/components/MoviePage/PlayersListComponent/PlayersListComponent';
import styles from './movie.module.css';

function Movie({
  posterUrl, name, mediaType, distributionYear, duration, knownPlayers, accentColor,
}) {
  return (
    <ParallaxProvider>
      <meta name="theme-color" content={accentColor} />
      <BackButtonComponent accentColor={accentColor} />
      <ParallaxBanner
        layers={[{ image: posterUrl, speed: -15 }]}
        className={styles.parallax}
      />
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

        <div className={styles.playersSection}>
          <h2>Players you know</h2>
          <PlayersListComponent
            playersList={knownPlayers.sort((p1, p2) => p2.totalNumOfMovies - p1.totalNumOfMovies)}
            accentColor={accentColor}
          />
        </div>
      </article>
    </ParallaxProvider>
  );
}

Movie.propTypes = {
  posterUrl: PropTypes.string,
  name: PropTypes.string,
  mediaType: PropTypes.string,
  distributionYear: PropTypes.string,
  duration: PropTypes.instanceOf(Object),
  knownPlayers: PropTypes.instanceOf(Array),
  accentColor: PropTypes.string,
};

Movie.defaultProps = {
  posterUrl: '',
  name: 'unknown',
  mediaType: 'unknown',
  distributionYear: 'unknown',
  duration: { hours: 0, minutes: 0 },
  knownPlayers: [],
  accentColor: '#FFF',
};

export async function getServerSideProps() {
  const res = await axios.get(`${process.env.BASE_URL}/api/movies/0`);
  let data = {};
  if (res.status === 200) {
    data = res.data;
  }

  return { props: { ...data } };
}

export default Movie;
