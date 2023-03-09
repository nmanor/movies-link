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
import { ActorsListComponent } from '../../components/shared/ItemsListComponent/ItemsListComponent';
import styles from '../../styles/Movie.module.css';
import getServerSidePropsLoginMiddleware from '../../middlware/getServerSidePropsLoginMiddleware';
import redirectToPage from '../../utils/redirectToPage';
import SnackbarComponent from '../../components/shared/SnackbarComponent/SnackbarComponent';

export default function Movie({
  id, posterUrl, name, watchedByUser: initialWatchedByUser,
  mediaType, distributionYear, duration, knownActors,
}) {
  const [accentColor, setAccentColor] = useState('#FFF');
  const [isDatePopupOpen, setIsDatePopupOpen] = useState(false);
  const [watchedByUser, setWatchedByUser] = useState(initialWatchedByUser);
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const updateAccentColor = async () => {
    const color = await extractBrightestColor(posterUrl);
    setAccentColor(color);
  };
  useEffect(() => { updateAccentColor(); }, [posterUrl]);

  const changePopupState = useCallback(
    () => setIsDatePopupOpen((value) => !value),
    [isDatePopupOpen],
  );

  const addMovieToUserList = useCallback(async (date) => {
    setLoading(true);
    setIsDatePopupOpen(false);
    const epoch = date ? date.getTime() : -1;
    const { data: { success } } = await axios.post(
      '/api/movies/add-to-watched-list',
      { movieId: id, watchDate: epoch },
    );
    setTimeout(() => {
      setWatchedByUser(success);
      setLoading(false);

      const msg = success ? 'The movie was successfully added' : 'Error adding the movie';
      setSnackbarMessage(msg);
      setShowSnackbar(true);
    }, 1000);
  }, []);

  const removeMovieFromUserList = useCallback(async () => {
    setLoading(true);
    const { data: { success } } = await axios.post(
      '/api/movies/remove-from-watched-list',
      { movieId: id },
    );
    setTimeout(() => {
      setWatchedByUser(!success);
      setLoading(false);

      const msg = success ? 'The movie was successfully removed' : 'Error removing the movie';
      setSnackbarMessage(msg);
      setShowSnackbar(true);
    }, 1000);
  }, []);

  const handleSnackbarHiding = useCallback(() => setShowSnackbar(false), []);

  return (
    <>
      <title>{name}</title>
      <meta name="theme-color" content={accentColor} />
      <SnackbarComponent
        show={showSnackbar}
        message={snackbarMessage}
        onHiding={handleSnackbarHiding}
      />

      <ParallaxProvider>
        <BackButtonComponent accentColor={accentColor} />
        <PopupComponent
          isOpen={isDatePopupOpen}
          title="When did you watch the movie?"
          positiveButtonText="Save"
          onNegativeClick={changePopupState}
          onPositiveClick={addMovieToUserList}
          accentColor={accentColor}
        >
          <DatePickerComponent accentColor={accentColor} allowUndefined />
        </PopupComponent>

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
              loading={loading}
              accentColor={accentColor}
              onClick={watchedByUser ? removeMovieFromUserList : changePopupState}
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
                <ActorsListComponent
                  title="Actors you know"
                  items={knownActors
                    .sort((p1, p2) => p2.totalNumOfMovies - p1.totalNumOfMovies)}
                  accentColor={accentColor}
                />
              )}
          </div>
        </article>
      </ParallaxProvider>
    </>
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

export const getServerSideProps = getServerSidePropsLoginMiddleware(async (context) => {
  try {
    const { user } = context.req.session;
    const { id } = context.query;

    const res = await axios.post(`${process.env.BASE_URL}/api/movies/${id}`, { user: user.googleId });
    let data = {};
    if (res.status === 200) {
      data = res.data;
    }

    return { props: { ...data } };
  } catch (e) {
    return redirectToPage('/404');
  }
});
