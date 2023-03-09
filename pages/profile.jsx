import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/Profile.module.css';
import PopupComponent from '../components/shared/PopupComponent/PopupComponent';

const colors = ['#ffadad', '#ffc6ff', '#bdb2ff', '#a0c4ff', '#9bf6ff', '#caffbf', '#fdffb6', '#ffd6a5'];

export default function Profile() {
  const router = useRouter();

  const [isNewGroupPopupOpen, setIsNewGroupPopupOpen] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const handleNewGroupClick = useCallback(() => setIsNewGroupPopupOpen(true), []);
  const handleNewGroupNegativeClick = useCallback(() => setIsNewGroupPopupOpen(false), []);
  const handleNewGroupPositiveClick = useCallback(async (values) => {
    if (isCreatingGroup) return;

    if (Array.isArray(values)) {
      setIsCreatingGroup(true);
      try {
        const [name, color] = values;
        const { data: { id } } = await axios.post('/api/groups/create', { name, color });
        if (id) await router.push(`/group/${id}`);
      } catch (e) {
        console.log(e);
      }
      setIsCreatingGroup(false);
    }
  }, []);

  return (
    <>
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
        <label className={styles.popupLabel} htmlFor="group-color">Choose a color for your group:</label>
        <input className={styles.popupColorInput} id="group-color" type="color" list="presets" />
        <datalist id="presets">
          {colors.map((color) => <option value={color} key={color}>{color}</option>)}
        </datalist>
      </PopupComponent>
      <button type="button" onClick={handleNewGroupClick}>New Group - DO NOT CLICK THAT BUTTON</button>
    </>
  );
}
