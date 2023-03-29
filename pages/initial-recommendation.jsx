import React, { useCallback, useEffect, useState } from 'react';
import axios, { HttpStatusCode } from 'axios';
import { PropTypes } from 'prop-types';
import { useRouter } from 'next/router';
import styles from '../styles/InitialRecommendation.module.css';
import getServerSidePropsLoginMiddleware from '../middlware/getServerSidePropsLoginMiddleware';
import redirectToPage from '../utils/redirectToPage';
import MediaTagComponent from '../components/InitialRecommendationPage/MediaTagComponent/MediaTagComponent';
import CounterButtonComponent
  from '../components/InitialRecommendationPage/CounterButtonComponent/CounterButtonComponent';
import PopupComponent from '../components/shared/PopupComponent/PopupComponent';
import SnackbarComponent from '../components/shared/SnackbarComponent/SnackbarComponent';

const accentColor = '#92cce4';

export default function InitialRecommendation({ initialMedia }) {
  const [media, setMedia] = useState(initialMedia);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [page, setPage] = useState(1);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const router = useRouter();

  const handleMediaChange = useCallback(async (e) => {
    try {
      const { id, checked } = e.target;

      if (checked) {
        setSelectedMedia((prev) => [...prev, id]);

        const response = await axios.post('/api/initial-recommendation/similar', { id });
        const similar = response.data.filter((obj1) => !media.some((obj2) => obj1.id === obj2.id));
        setMedia((prev) => {
          const newMedia = [...prev];
          const index = newMedia.findIndex((m) => m.id === id);
          newMedia.splice(index + 1, 0, ...similar);
          return newMedia;
        });
      } else {
        const newSelection = selectedMedia.filter((item) => item !== id);
        setSelectedMedia(newSelection);
      }
    } catch (err) {
      console.error(err);
    }
  }, [media, selectedMedia]);

  const handleSaveClick = useCallback(async () => {
    if (selectedMedia.length > 0) {
      setPopupTitle(`Save ${selectedMedia.length} media to your watch list?`);
    } else {
      setPopupTitle('Are you sure you don\'t want to save any media?');
    }
    setPopupOpen(true);
  }, [selectedMedia]);

  const handlePopupPositiveClick = useCallback(() => {
    setPopupOpen(false);
    let timeout = 0;
    try {
      if (selectedMedia.length > 0) {
        axios.post('/api/initial-recommendation/save-initial-recommendation', { mediaIds: selectedMedia });
        setShowSnackbar(true);
        timeout = 2000;
      }
    } catch (e) {
      console.log(e);
    }

    setTimeout(() => router.push('/timeline'), timeout);
  }, [selectedMedia]);

  const handlePopupNegativeClick = useCallback(() => setPopupOpen(false), []);

  const fetchMoreMedia = async () => {
    try {
      const response = await axios.get(`/api/initial-recommendation/initial-list?page=${page}`);
      const newMedia = response.data.filter((obj1) => !media.some((obj2) => obj1.id === obj2.id));
      setMedia([...media, ...newMedia]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    fetchMoreMedia();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <title>Quick start</title>

      <PopupComponent
        title={popupTitle}
        accentColor={accentColor}
        isOpen={popupOpen}
        positiveButtonText="Yes"
        onPositiveClick={handlePopupPositiveClick}
        onNegativeClick={handlePopupNegativeClick}
      >
        <p className={styles.popupText}>
          You can always return to this screen through your profile screen.
        </p>
      </PopupComponent>

      <SnackbarComponent
        accentColor={accentColor}
        message="The media will be added in the next few moments"
        show={showSnackbar}
      />

      <div className={styles.container}>
        <div className={styles.title}>
          <h1>Quick start</h1>
          <p>
            Select the movies and series you&apos;ve watched to add them to your watch list.
            <br />
            When finished press the counter button.
          </p>
        </div>
        <CounterButtonComponent
          onClick={handleSaveClick}
          count={selectedMedia.length}
        />
        <div className={styles.mediaList}>
          {media.map((m) => (
            <MediaTagComponent
              key={m.id}
              id={m.id}
              title={m.title}
              releaseYear={m.releaseYear}
              onChange={handleMediaChange}
              checked={selectedMedia.includes(m.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

InitialRecommendation.propTypes = {
  initialMedia: PropTypes.arrayOf(Object),
};

InitialRecommendation.defaultProps = {
  initialMedia: [],
};

export const getServerSideProps = getServerSidePropsLoginMiddleware(async (context) => {
  try {
    const { user } = context.req.session;

    const initialResponse = await axios.post(
      `${process.env.BASE_URL}/api/initial-recommendation/initial-list`,
      { user: user.googleId },
    );

    let initialMedia = [];
    if (initialResponse.status === HttpStatusCode.Ok) {
      initialMedia = initialResponse.data;
    }

    return { props: { user, initialMedia } };
  } catch (e) {
    console.error(e);
    return redirectToPage('/404');
  }
});
