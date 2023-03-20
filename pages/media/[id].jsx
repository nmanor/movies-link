import React, { useCallback, useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import axios from 'axios';
import { ParallaxBanner, ParallaxProvider } from 'react-scroll-parallax';
import extractBrightestColor from '../../utils/colorExtractor';
import ButtonComponent from '../../components/shared/ButtonComponent/ButtonComponent';
import PopupComponent from '../../components/shared/PopupComponent/PopupComponent';
import DatePickerComponent from '../../components/shared/DatePickerComponent/DatePickerComponent';
import MovieMetadataComponent from '../../components/MediaPage/MovieMetadataComponent/MovieMetadataComponent';
import BackButtonComponent from '../../components/shared/BackButtonComponent/BackButtonComponent';
import { ActorsListComponent } from '../../components/shared/ItemsListComponent/ItemsListComponent';
import styles from '../../styles/Media.module.css';
import getServerSidePropsLoginMiddleware from '../../middlware/getServerSidePropsLoginMiddleware';
import redirectToPage from '../../utils/redirectToPage';
import SnackbarComponent from '../../components/shared/SnackbarComponent/SnackbarComponent';
import ExpanderComponent from '../../components/shared/ExpanderComponent/ExpanderComponent';
import SwipeableListComponent, { ActionType } from '../../components/MediaPage/SwipeableListComponent/SwipeableListComponent';
import MediaType from '../../utils/enums';
import SeriesMetadataComponent from '../../components/MediaPage/SeriesMetadataComponent/SeriesMetadataComponent';

const SECOND = 1000;

export default function Media({
  id,
  posterUrl,
  name,
  mediaType,
  distributionYear,
  duration,
  knownActors,
  groups,
  numberOfSeasons,
  firstAirDate,
  lastAirDate,
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
  const [expanderOpen, setExpanderOpen] = useState(false);
  const [allActors, setAllActors] = useState([]);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarDelay, setSnackbarDelay] = useState(4 * SECOND);
  const [handleSnackbarUndo, setHandleSnackbarUndo] = useState(null);
  const handleSnackbarHiding = useCallback(() => {
    setShowSnackbar(false);
    setHandleSnackbarUndo(null);
  }, []);
  const openSnackbar = (message, delay = 4 * SECOND, handler = null) => {
    setSnackbarMessage(message);
    setSnackbarDelay(delay);
    setHandleSnackbarUndo(handler);
    setShowSnackbar(true);
  };

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

  const addMedia = useCallback(async (date) => {
    setLoading(true);
    setPopupOpen(false);

    const epoch = date ? date.getTime() : -1;
    const group = groups.find((g) => g.id === chosenGroup);
    const url = group ? '/api/groups/add-media' : '/api/media/add-to-watched-list';
    const data = { movieId: id, watchDate: epoch };
    if (group) data.groupId = group.id;

    const { data: { success } } = await axios.post(url, data);
    chosenGroup = null;

    setTimeout(() => {
      if (success) {
        if (group) setWatchedByGroups((value) => [...value, { ...group, date: epoch }]);
        else setWatchedByUser({ date: epoch });
      }

      setLoading(false);

      const msg = success ? 'The media was successfully added' : 'Error adding the media';
      openSnackbar(msg);
    }, 1000);
  }, []);

  const removeMedia = useCallback(async () => {
    setLoading(true);

    const group = watchedByGroups.find((g) => g.id === chosenGroup);
    const url = group ? '/api/groups/remove-media' : '/api/media/remove-from-watched-list';
    const data = { movieId: id };
    let { date } = watchedByUser;

    if (group) {
      data.groupId = group.id;
      date = group.date;
    }

    const { data: { success } } = await axios.post(url, data);

    const chosenGroupCopy = chosenGroup;
    chosenGroup = null;

    setTimeout(() => {
      if (success) {
        if (group) setWatchedByGroups((value) => value.filter((g) => g.id !== group.id));
        else setWatchedByUser({ date: null });
      }

      setLoading(false);

      const msg = success ? 'The media was successfully removed' : 'Error removing the media';
      const undoRemove = () => {
        chosenGroup = chosenGroupCopy;
        addMedia(new Date(date));
      };
      openSnackbar(msg, 10 * SECOND, () => undoRemove);
    }, 1000);
  }, []);

  const handleExpanderOnChange = useCallback(() => setExpanderOpen((val) => !val), []);

  const changeChosenGroup = (groupId) => { chosenGroup = groupId !== -1 ? groupId : null; };
  const handleOnRemoveSwipe = useCallback((groupId) => {
    changeChosenGroup(groupId);
    removeMedia();
  }, []);
  const handleOnAddSwipe = useCallback((groupId) => {
    changeChosenGroup(groupId);
    setTimeout(() => setPopupOpen(true), 500);
  }, []);

  const handleLoadAllActorsClick = useCallback(async () => {
    try {
      const response = await axios.post('/api/media/all-actors', { mediaId: id, numberOfSeasons });
      const actors = response.data.actors
        .filter((a1) => !knownActors.find((a2) => a2.id === a1.id));
      setAllActors(actors);
    } catch (e) {
      openSnackbar('Error fetching the actors');
    }
  }, []);

  const renderButton = () => (
    <ButtonComponent
      loading={loading}
      accentColor={accentColor}
      onClick={watchedByUser.date ? removeMedia : changePopupState}
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
    // if the user watched the media with group, return expander
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
        accentColor={accentColor}
        onHiding={handleSnackbarHiding}
        onUndo={handleSnackbarUndo}
        delay={snackbarDelay}
      />

      <ParallaxProvider>
        <BackButtonComponent accentColor={accentColor} />

        <PopupComponent
          isOpen={popupOpen}
          title={`When did you watch the ${mediaType}?`}
          positiveButtonText="Save"
          onNegativeClick={changePopupState}
          onPositiveClick={addMedia}
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
            {mediaType === MediaType.Movie
              ? (
                <MovieMetadataComponent
                  mediaType={mediaType}
                  distributionYear={distributionYear}
                  duration={duration}
                  accentColor={accentColor}
                />
              )
              : (
                <SeriesMetadataComponent
                  mediaType={mediaType}
                  firstAirDate={firstAirDate}
                  lastAirDate={lastAirDate}
                  numberOfSeasons={numberOfSeasons}
                  accentColor={accentColor}
                />
              )}
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

          <div className={styles.playersSection}>
            {allActors.length > 0
              ? (
                <ActorsListComponent
                  title="Other actors"
                  items={allActors}
                  accentColor={accentColor}
                />
              )
              : (
                <div className={styles.loadMoreActors}>
                  Want to see more?
                  <button
                    type="button"
                    style={{ color: accentColor }}
                    onClick={handleLoadAllActorsClick}
                  >
                    load the rest of the actors
                  </button>
                </div>
              )}
          </div>
        </article>
      </ParallaxProvider>
    </>
  );
}

Media.propTypes = {
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
  numberOfSeasons: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  firstAirDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lastAirDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Media.defaultProps = {
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
  numberOfSeasons: 'unknown',
  firstAirDate: 'unknown',
  lastAirDate: 'unknown',
};

export const getServerSideProps = getServerSidePropsLoginMiddleware(async (context) => {
  try {
    const { user } = context.req.session;
    const { id } = context.query;

    const res = await axios.post(`${process.env.BASE_URL}/api/media/${id}`, { user: user.googleId });
    let data = {};
    if (res.status === 200) {
      data = res.data;
    }

    return { props: { ...data, groups: user.groups } };
  } catch (e) {
    console.error(e);
    return redirectToPage('/404');
  }
});
