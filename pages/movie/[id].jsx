import React, { useEffect, useState, useCallback } from 'react';
import { PropTypes } from 'prop-types';
import axios from 'axios';
import { ParallaxBanner, ParallaxProvider } from 'react-scroll-parallax';
import extractBrightestColor from '../../utils/colorExtractor';
import ButtonComponent from '../../components/shared/ButtonComponent/ButtonComponent';
import PopupComponent from '../../components/shared/PopupComponent/PopupComponent';
import DatePickerComponent from '../../components/shared/DatePickerComponent/DatePickerComponent';
import MovieMetadataComponent from '../../components/MoviePage/MovieMetadataComponent/MovieMetadataComponent';
import BackButtonComponent from '../../components/shared/BackButtonComponent/BackButtonComponent';
import ActorsListComponent from '../../components/MoviePage/ActorsListComponent/ActorsListComponent';
import styles from './movie.module.css';
import getServerSidePropsLoginMiddleware from '../../middlware/getServerSidePropsLoginMiddleware';
import redirectToPage from '../../utils/redirectToPage';

function Movie({
  id, posterUrl, name, watchedByUser, mediaType, distributionYear, duration, knownActors,
}) {
  const [accentColor, setAccentColor] = useState('#FFF');
  const [isDatePopupOpen, setIsDatePopupOpen] = useState(false);

  const updateAccentColor = async () => {
    const color = await extractBrightestColor(posterUrl);
    setAccentColor(color);
  };
  useEffect(() => { updateAccentColor(); }, [posterUrl]);

  const handlePopup = useCallback(() => setIsDatePopupOpen((value) => !value), [isDatePopupOpen]);

  return (
    <ParallaxProvider>
      <meta name="theme-color" content={accentColor} />
      <BackButtonComponent accentColor={accentColor} />
      {isDatePopupOpen && (
      <PopupComponent
        title="When did you watch the movie?"
        positiveButtonText="Save"
        onBlur={handlePopup}
        onResult={(res) => alert(`You choose: ${res}`)}
        accentColor={accentColor}
      >
        <DatePickerComponent accentColor={accentColor} allowUndefined />
      </PopupComponent>
      )}
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
            onClick={watchedByUser ? () => {} : handlePopup}
          >
            {`${watchedByUser ? 'Remove from' : 'Add to'} my watched list`}
          </ButtonComponent>
        </div>

        <div className={styles.playersSection}>
          {knownActors.length === 0
            ? (
              <p className={styles.errorMessage}>
                <strong>
                  You don&apos;t know any of
                  {' '}
                  {name}
                  &apos;s actors yet.
                </strong>
                <br />
                When you get to know them, they will appear here.
              </p>
            ) : (
              <>
                <h2>Actors you know</h2>
                <ActorsListComponent
                  playersList={knownActors
                    .sort((p1, p2) => p2.totalNumOfMovies - p1.totalNumOfMovies)}
                  accentColor={accentColor}
                />
              </>
            )}
        </div>
      </article>
    </ParallaxProvider>
  );
}

Movie.propTypes = {
  id: PropTypes.string,
  posterUrl: PropTypes.string,
  name: PropTypes.string,
  watchedByUser: PropTypes.bool,
  mediaType: PropTypes.string,
  distributionYear: PropTypes.string,
  duration: PropTypes.instanceOf(Object),
  knownActors: PropTypes.instanceOf(Array),
};

Movie.defaultProps = {
  id: '0',
  posterUrl: '',
  name: 'unknown',
  watchedByUser: true,
  mediaType: 'unknown',
  distributionYear: 'unknown',
  duration: { hours: 0, minutes: 0 },
  knownActors: [],
};

export const getServerSideProps = getServerSidePropsLoginMiddleware(async () => {
  try {
    const res = await axios.get(`${process.env.BASE_URL}/api/movies/0`);
    let data = {};
    if (res.status === 200) {
      data = res.data;
    }

    return { props: { ...data } };
  } catch (e) {
    return redirectToPage('/404');
  }
});

export default Movie;
