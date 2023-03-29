import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import axios, { HttpStatusCode } from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import * as PropTypes from 'prop-types';
import styles from '../styles/Profile.module.css';
import PopupComponent from '../components/shared/PopupComponent/PopupComponent';
import ColorPickerComponent from '../components/ProfilePage/ColorPickerComponent/ColorPickerComponent';
import SnackbarComponent from '../components/shared/SnackbarComponent/SnackbarComponent';
import getServerSidePropsLoginMiddleware from '../middlware/getServerSidePropsLoginMiddleware';
import redirectToPage from '../utils/redirectToPage';
import CurveGraphComponent from '../components/ProfilePage/CurveGraphComponent/CurveGraphComponent';
import extractBrightestColor, { colorLightening } from '../utils/colorExtractor';
import StatisticsTableComponent from '../components/ProfilePage/StatisticsTableComponent/StatisticsTableComponent';
import GroupsListComponent from '../components/ProfilePage/GroupsListComponent/GroupsListComponent';
import ButtonComponent from '../components/shared/ButtonComponent/ButtonComponent';

const colors = ['#ffadad', '#ffc6ff', '#bdb2ff', '#a0c4ff', '#9bf6ff', '#caffbf', '#fdffb6', '#ffd6a5', '#fafafa'];

export default function Profile({
  user: {
    image, firstName, lastName, email,
  },
  mediaPerMonth,
  groups,
  statistics: {
    movies, series, moviesTime, numberOfSeasons,
  },
}) {
  const router = useRouter();

  const [isNewGroupPopupOpen, setIsNewGroupPopupOpen] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [accentColor, setAccentColor] = useState('#FFF');

  const graphRef = useRef(null);
  const [graphSize, setGraphSize] = useState({ width: 0, height: 0 });

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  useEffect(() => {
    if (graphRef.current) {
      setGraphSize(({
        width: graphRef.current.parentElement.offsetWidth,
        height: graphRef.current.parentElement.offsetHeight,
      }));
    }
  }, []);

  const updateAccentColor = async () => {
    const color = await extractBrightestColor(image);
    setAccentColor(colorLightening(color, 1.8));
  };
  useEffect(() => {
    updateAccentColor();
  }, [image]);

  const handleSnackbarHiding = useCallback(() => setShowSnackbar(false), []);
  const handleNewGroupClick = useCallback(() => setIsNewGroupPopupOpen(true), []);
  const handleNewGroupNegativeClick = useCallback(() => setIsNewGroupPopupOpen(false), []);
  const handleNewGroupPositiveClick = useCallback(async (values) => {
    if (isCreatingGroup) return;

    if (Array.isArray(values) && values.length === 2) {
      const [name, color] = values;
      if (name.length < 3) {
        openSnackbar('The name must be at least 3 letters');
      } else {
        setIsCreatingGroup(true);
        try {
          const { data: { id } } = await axios.post('/api/groups/create', { name: name.trim(), color });
          if (id) await router.push(`/group/${id}`);
        } catch (e) {
          openSnackbar('An error occurred');
        }
        setIsCreatingGroup(false);
      }
    } else {
      openSnackbar('Please choose name and color');
    }
  }, []);

  const handleQuickStartClick = useCallback(() => router.push('/initial-recommendation'), []);
  const handleLogoutClick = useCallback(async () => {
    try {
      const response = await axios.get('/api/auth/logout');
      if (response.status === HttpStatusCode.Ok && response.data.success) {
        await router.push('/login');
      }
    } catch (e) {
      console.log(e);
      openSnackbar('Error while logging out');
    }
  }, []);

  return (
    <>
      <SnackbarComponent
        show={showSnackbar}
        message={snackbarMessage}
        onHiding={handleSnackbarHiding}
      />

      <PopupComponent
        isOpen={isNewGroupPopupOpen}
        accentColor="#b4b4b4"
        title="Create a new watch group"
        positiveButtonText="Create"
        positiveButtonLoading={isCreatingGroup}
        onPositiveClick={handleNewGroupPositiveClick}
        onNegativeClick={handleNewGroupNegativeClick}
      >
        <label className={styles.popupLabel} htmlFor="group-name">Enter your group name:</label>
        <input className={styles.popupTextInput} id="group-name" type="text" autoComplete="off" />
        <label className={styles.popupLabel}>Choose color for your group:</label>
        <ColorPickerComponent colors={colors} />
      </PopupComponent>

      <ParallaxProvider>
        <meta name="theme-color" content={accentColor} />
        <div
          style={{ backgroundImage: `url(${image})` }}
          className={styles.blurImage}
        />
        <article className={styles.container}>
          <Parallax speed={-4}>
            <div className={styles.containerCorner} />
            <Image
              className={styles.profileImage}
              src={image}
              alt={`Profile image of ${firstName}`}
              width={150}
              height={150}
            />
            <div className={styles.header}>
              <h1>{`${firstName} ${lastName}`}</h1>
              <p>{email}</p>
              <div className={styles.actionButtons}>
                <ButtonComponent
                  className={styles.actionButton}
                  accentColor={accentColor}
                  onClick={handleLogoutClick}
                >
                  Log out
                </ButtonComponent>
                <ButtonComponent
                  className={styles.actionButton}
                  accentColor={accentColor}
                  onClick={handleQuickStartClick}
                  outline
                >
                  Quick start
                </ButtonComponent>
              </div>
            </div>
          </Parallax>

          <div className={styles.content}>
            <StatisticsTableComponent
              movies={movies}
              series={series}
              moviesTime={moviesTime}
              numberOfSeasons={numberOfSeasons}
            />

            <div className={styles.graphContainer}>
              <div className={styles.graphTitle}>
                <h1>Your watching trend</h1>
                <p>Your monthly trend in the last year</p>
              </div>
              <CurveGraphComponent
                ref={graphRef}
                width={graphSize.width}
                height={120}
                data={mediaPerMonth}
                accentColor={accentColor}
              />
            </div>

            <h1 className={styles.title}>Your groups</h1>
            <GroupsListComponent
              onNewGroupClick={handleNewGroupClick}
              groups={groups}
            />
          </div>
        </article>
      </ParallaxProvider>

    </>
  );
}

Profile.propTypes = {
  user: PropTypes.instanceOf(Object).isRequired,
  mediaPerMonth: PropTypes.instanceOf(Object).isRequired,
  statistics: PropTypes.instanceOf(Object).isRequired,
  groups: PropTypes.arrayOf(Object),
};

Profile.defaultProps = {
  groups: [],
};

export const getServerSideProps = getServerSidePropsLoginMiddleware(async (context) => {
  try {
    const { user } = context.req.session;

    const [moviesPerMonthResponse, statisticsResponse, groupsResponse] = await Promise.all([
      axios.post(`${process.env.BASE_URL}/api/profile/media-per-month`, { user: user.googleId }),
      axios.post(`${process.env.BASE_URL}/api/profile/user-statistics`, { user: user.googleId }),
      axios.post(`${process.env.BASE_URL}/api/groups/users-group`, { user: user.googleId }),
    ]);

    let mediaPerMonth = {};
    if (moviesPerMonthResponse.status === HttpStatusCode.Ok) {
      mediaPerMonth = moviesPerMonthResponse.data;
    }

    let statistics = {};
    if (statisticsResponse.status === HttpStatusCode.Ok) {
      statistics = statisticsResponse.data;
    }

    let groups = [];
    if (groupsResponse.status === HttpStatusCode.Ok) {
      groups = groupsResponse.data;
    }

    return {
      props: {
        user, mediaPerMonth, statistics, groups,
      },
    };
  } catch (e) {
    return redirectToPage('/404');
  }
});
