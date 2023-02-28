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
  id, posterUrl, name, watchedByUser, mediaType, distributionYear, duration, knownActors, user,
}) {
  const [accentColor, setAccentColor] = useState('#FFF');
  const [isDatePopupOpen, setIsDatePopupOpen] = useState(false);

  const updateAccentColor = async () => {
    const color = await extractBrightestColor(posterUrl);
    setAccentColor(color);
  };
  useEffect(() => { updateAccentColor(); }, [posterUrl]);

  const handlePopup = useCallback(() => setIsDatePopupOpen((value) => !value), [isDatePopupOpen]);

  const addMovieToUserList = useCallback(async (date) => {
    const epoch = date ? date.getTime() : -1;
    await axios.post(
      '/api/movies/add-to-watched-list',
      { movieId: id, watchDate: epoch },
    );
  }, []);

  return (
    <ParallaxProvider>
      <title>{name}</title>
      <meta name="theme-color" content={accentColor} />
      <BackButtonComponent accentColor={accentColor} />
      {isDatePopupOpen && (
      <PopupComponent
        title="When did you watch the movie?"
        positiveButtonText="Save"
        onBlur={handlePopup}
        onResult={addMovieToUserList}
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
                  actorsList={knownActors
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
  distributionYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  duration: PropTypes.instanceOf(Object),
  knownActors: PropTypes.instanceOf(Array),
  user: PropTypes.instanceOf(Object),
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
  user: {},
};

export const getServerSideProps = getServerSidePropsLoginMiddleware(async (context) => {
  try {
    const { user } = context.req.session;
    const { id } = context.query;

    const res = await axios.post(`${process.env.BASE_URL}/api/movies/${id}`, { user: user.googleId });
    let data = {};
    if (res.status === 200) {
      data = res.data;
    }

    return { props: { ...data, user } };
  } catch (e) {
    return redirectToPage('/404');
  }
});

export default Movie;
