import React, { useCallback, useEffect, useState } from 'react';
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
import ExpanderComponent from '../../components/shared/ExpanderComponent/ExpanderComponent';
import SwipeableListComponent, { ActionType } from '../../components/MoviePage/SwipeableListComponent/SwipeableListComponent';

export default function Movie({
  id,
  posterUrl,
  name,
  mediaType,
  distributionYear,
  duration,
  knownActors,
  groups,
  watchedByGroups: initialWatchedByGroups,
  watchedByUser: initialWatchedByUser,
}) {
  let chosenGroup = null;
  const userHasGroups = groups && groups.length > 0;

  const [watchedByUser, setWatchedByUser] = useState(initialWatchedByUser);
  const [watchedByGroups, setWatchedByGroups] = useState(initialWatchedByGroups);
  const [accentColor, setAccentColor] = useState('#FFF');
  const [popupOpen, setPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [expanderOpen, setExpanderOpen] = useState(false);

  const updateAccentColor = async () => {
    const color = await extractBrightestColor(posterUrl);
    setAccentColor(color);
  };
  useEffect(() => { updateAccentColor(); }, [posterUrl]);

  const changePopupState = useCallback(
    () => {
      setPopupOpen((value) => !value);
      chosenGroup = null;
    },
    [popupOpen],
  );

  const addMovie = useCallback(async (date) => {
    setLoading(true);
    setPopupOpen(false);

    const epoch = date ? date.getTime() : -1;
    const group = groups.find((g) => g.id === chosenGroup);
    const url = group ? '/api/groups/add-movie' : '/api/movies/add-to-watched-list';
    const data = { movieId: id, watchDate: epoch };
    if (group) data.groupId = group.id;

    const { data: { success } } = await axios.post(url, data);

    setTimeout(() => {
      if (success) {
        if (group) setWatchedByGroups((value) => [...value, { ...group, date: epoch }]);
        else setWatchedByUser({ date: epoch });
      }

      setLoading(false);
      chosenGroup = null;

      const msg = success ? 'The movie was successfully added' : 'Error adding the movie';
      setSnackbarMessage(msg);
      setShowSnackbar(true);
    }, 1000);
  }, []);

  const removeMovie = useCallback(async () => {
    setLoading(true);

    const group = groups.find((g) => g.id === chosenGroup);
    const url = group ? '/api/groups/remove-movie' : '/api/movies/remove-from-watched-list';
    const data = { movieId: id };
    if (group) data.groupId = group.id;

    const { data: { success } } = await axios.post(url, data);

    setTimeout(() => {
      if (success) {
        if (group) setWatchedByGroups((value) => value.filter((g) => g.id !== group.id));
        else setWatchedByUser({ date: null });
      }

      setLoading(false);
      chosenGroup = null;

      const msg = success ? 'The movie was successfully removed' : 'Error removing the movie';
      setSnackbarMessage(msg);
      setShowSnackbar(true);
    }, 1000);
  }, []);

  const handleSnackbarHiding = useCallback(() => setShowSnackbar(false), []);
  const handleExpanderOnChange = useCallback(() => setExpanderOpen((val) => !val), []);

  const changeChosenGroup = (groupId) => { chosenGroup = groupId !== -1 ? groupId : null; };
  const handleOnRemoveSwipe = useCallback((groupId) => {
    changeChosenGroup(groupId);
    removeMovie();
  }, []);
  const handleOnAddSwipe = useCallback((groupId) => {
    changeChosenGroup(groupId);
    setTimeout(() => setPopupOpen(true), 500);
  }, []);

  const renderButton = () => (
    <ButtonComponent
      loading={loading}
      accentColor={accentColor}
      onClick={watchedByUser.date ? removeMovie : changePopupState}
    >
      {`${watchedByUser.date ? 'Remove from' : 'Add to'} my watched list`}
    </ButtonComponent>
  );

  const renderExpander = () => {
    const alone = {
      id: -1, name: 'Alone', color: '#FFF', date: watchedByUser.date,
    };

    const existingGroups = [...watchedByGroups];
    const optionalGroups = groups.filter((g1) => !watchedByGroups.some((g2) => g1.id === g2.id));
    if (watchedByUser.date) existingGroups.unshift(alone);
    else optionalGroups.unshift(alone);

    let title;
    if (expanderOpen) {
      if (existingGroups.length === 0) title = 'Close Add menu';
      else if (optionalGroups.length === 0) title = 'Close removal menu';
      else title = 'Close watch history';
    } else if (existingGroups.length === 0) title = 'Add to my watched list';
    else if (optionalGroups.length === 0) title = 'Remove from my watched list';
    else title = 'View watch history';

    return (
      <ExpanderComponent
        title={title}
        accentColor={accentColor}
        onOpen={handleExpanderOnChange}
        isOpen={expanderOpen}
        loading={loading}
      >
        {existingGroups.length > 0 && (
        <>
          <p className={styles.watchlistTitle}>Swipe to remove watch</p>
          <SwipeableListComponent
            groups={existingGroups}
            actionType={ActionType.Remove}
            onSwipe={handleOnRemoveSwipe}
          />
        </>
        )}

        {existingGroups.length > 0 && optionalGroups.length > 0 && <div className={styles.line} />}

        {optionalGroups.length > 0 && (
        <>
          <p className={styles.watchlistTitle}>Swipe to add watch</p>
          <SwipeableListComponent
            groups={optionalGroups}
            actionType={ActionType.Add}
            onSwipe={handleOnAddSwipe}
          />
        </>
        )}
      </ExpanderComponent>
    );
  };

  const renderAddToWatchlistController = () => {
    // if the user watched the movie with group, return expander
    if (watchedByGroups && watchedByGroups.length !== 0) {
      return renderExpander();
    }

    // If the user is registered to groups, return expander
    if (userHasGroups) {
      return renderExpander();
    }

    // in any other case, return button
    return renderButton();
  };

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
          isOpen={popupOpen}
          title="When did you watch the movie?"
          positiveButtonText="Save"
          onNegativeClick={changePopupState}
          onPositiveClick={addMovie}
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
            {renderAddToWatchlistController(watchedByUser, watchedByGroups)}
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
  watchedByUser: PropTypes.instanceOf(Object),
  mediaType: PropTypes.string,
  distributionYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  duration: PropTypes.instanceOf(Object),
  knownActors: PropTypes.arrayOf(Object),
  groups: PropTypes.arrayOf(Object),
  watchedByGroups: PropTypes.arrayOf(Object),
};

Movie.defaultProps = {
  id: '0',
  posterUrl: '',
  name: 'unknown',
  watchedByUser: { date: null },
  mediaType: 'unknown',
  distributionYear: 'unknown',
  duration: { hours: 0, minutes: 0 },
  knownActors: [],
  groups: [],
  watchedByGroups: [],
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

    return { props: { ...data, groups: user.groups } };
  } catch (e) {
    return redirectToPage('/404');
  }
});
