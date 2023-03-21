// https://dribbble.com/shots/20702083-Social-Network-Mobile-App

import React, { useCallback, useEffect, useState } from 'react';
import axios, { HttpStatusCode } from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../styles/Profile.module.css';
import PopupComponent from '../components/shared/PopupComponent/PopupComponent';
import ColorPickerComponent from '../components/ProfilePage/ColorPickerComponent/ColorPickerComponent';
import SnackbarComponent from '../components/shared/SnackbarComponent/SnackbarComponent';
import getServerSidePropsLoginMiddleware from '../middlware/getServerSidePropsLoginMiddleware';
import redirectToPage from '../utils/redirectToPage';
import CurveGraphComponent from '../components/ProfilePage/CurveGraphComponent/CurveGraphComponent';
import extractBrightestColor, { colorLightening } from '../utils/colorExtractor';

const colors = ['#ffadad', '#ffc6ff', '#bdb2ff', '#a0c4ff', '#9bf6ff', '#caffbf', '#fdffb6', '#ffd6a5', '#fafafa'];

export default function Profile({ user: { image, firstName, lastName }, mediaPerMonth }) {
  const router = useRouter();

  const [isNewGroupPopupOpen, setIsNewGroupPopupOpen] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [accentColor, setAccentColor] = useState('#FFF');

  const updateAccentColor = async () => {
    const color = await extractBrightestColor(image);
    setAccentColor(color);
  };
  useEffect(() => { updateAccentColor(); }, [image]);

  const handleSnackbarHiding = useCallback(() => setShowSnackbar(false), []);
  const handleNewGroupClick = useCallback(() => setIsNewGroupPopupOpen(true), []);
  const handleNewGroupNegativeClick = useCallback(() => setIsNewGroupPopupOpen(false), []);
  const handleNewGroupPositiveClick = useCallback(async (values) => {
    if (isCreatingGroup) return;

    if (Array.isArray(values) && values.length === 2) {
      const [name, color] = values;
      if (name.length < 3) {
        setSnackbarMessage('The name must be at least 3 letters');
        setShowSnackbar(true);
      } else {
        setIsCreatingGroup(true);
        try {
          const { data: { id } } = await axios.post('/api/groups/create', { name: name.trim(), color });
          if (id) await router.push(`/group/${id}`);
        } catch (e) {
          setSnackbarMessage('An error occurred');
          setShowSnackbar(true);
        }
        setIsCreatingGroup(false);
      }
    } else {
      setSnackbarMessage('Please choose name and color');
      setShowSnackbar(true);
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

      <div className={styles.container}>
        <button type="button" onClick={handleNewGroupClick}>New Group - DO NOT CLICK THAT BUTTON</button>
        <Image
          className={styles.profileImage}
          src={image}
          alt={`Profile image of ${firstName}`}
          width={150}
          height={150}
        />
        <h1>{`${firstName} ${lastName}`}</h1>

        <CurveGraphComponent
          width={300}
          height={150}
          data={mediaPerMonth}
          accentColor={colorLightening(accentColor, 1.8)}
        />
      </div>
    </>
  );
}

export const getServerSideProps = getServerSidePropsLoginMiddleware(async (context) => {
  try {
    const { user } = context.req.session;

    const [moviesPerMonthResponse] = await Promise.all([
      axios.post(`${process.env.BASE_URL}/api/profile/media-per-month`, { user: user.googleId }),
    ]);

    let mediaPerMonth = {};
    if (moviesPerMonthResponse.status === HttpStatusCode.Ok) {
      mediaPerMonth = moviesPerMonthResponse.data;
    }

    return { props: { user, mediaPerMonth } };
  } catch (e) {
    return redirectToPage('/404');
  }
});
