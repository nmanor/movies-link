import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/Profile.module.css';
import PopupComponent from '../components/shared/PopupComponent/PopupComponent';
import ColorPickerComponent from '../components/ProfilePage/ColorPickerComponent/ColorPickerComponent';
import SnackbarComponent from '../components/shared/SnackbarComponent/SnackbarComponent';

const colors = ['#ffadad', '#ffc6ff', '#bdb2ff', '#a0c4ff', '#9bf6ff', '#caffbf', '#fdffb6', '#ffd6a5', '#ffffff'];

export default function Profile() {
  const router = useRouter();

  const [isNewGroupPopupOpen, setIsNewGroupPopupOpen] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

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
          const { data: { id } } = await axios.post('/api/groups/create', { name, color });
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
        <input className={styles.popupTextInput} id="group-name" type="text" />
        <label className={styles.popupLabel}>Choose color for your group:</label>
        <ColorPickerComponent colors={colors} />
      </PopupComponent>
      <button type="button" onClick={handleNewGroupClick}>New Group - DO NOT CLICK THAT BUTTON</button>
    </>
  );
}
