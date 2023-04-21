import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import styles from '../styles/Timeline.module.css';
import MediaItemComponent from '../components/TimelinePage/MediaItemComponent/MediaItemComponent';
import getServerSidePropsLoginMiddleware from '../middlware/getServerSidePropsLoginMiddleware';
import redirectToPage from '../utils/redirectToPage';
import YearsPickerComponent from '../components/TimelinePage/YearsPickerComponent/YearsPickerComponent';

export default function Timeline({ data }) {
  const years = new Set();

  const [currentYear, setCurrentYear] = useState('unknown');
  const [media, setMedia] = useState([]);

  useEffect(() => {
    setMedia(data
      .sort((a, b) => b.date - a.date)
      .map((movie) => ({
        ...movie,
        date: movie.date >= 0 ? new Date(movie.date) : null,
      })));
    years.clear();
  }, [data]);

  const createId = (date) => {
    if (!date) {
      if (years.has(undefined)) return undefined;

      years.add(undefined);
      return 'unknown';
    }

    const year = date.getFullYear();
    if (years.has(year)) return undefined;

    years.add(year);
    return `${year}`;
  };

  const uniqueYears = useMemo(() => {
    const yearsSet = new Set();
    media
      .filter((entry) => entry.date)
      .forEach((entry) => yearsSet.add(entry.date.getFullYear()));

    const result = [...yearsSet].sort((y1, y2) => y2 - y1).concat('unknown');
    setCurrentYear(result[0]);

    return result;
  }, [media]);

  const handleClick = useCallback((id) => {
    const targetElement = document.getElementById(id);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 90,
        behavior: 'smooth',
      });
      setCurrentYear(id);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Your timeline</h1>
        <p>
          Here&apos;s your viewing timeline of all the
          movies you&apos;ve added to your movie list.
        </p>
      </div>
      <YearsPickerComponent years={uniqueYears} onClick={handleClick} currentYear={currentYear} />
      {media.map((entry, i) => (
        <MediaItemComponent
          priority={i < 5}
          key={`${entry.id}${entry.groupName ? entry.groupName.replace(/\s+/g, '') : ''}`}
          media={entry}
          htmlId={createId(entry.date)}
        />
      ))}
    </div>
  );
}

Timeline.propTypes = {
  data: PropTypes.arrayOf(Object),
};

Timeline.defaultProps = {
  data: [],
};

export const getServerSideProps = getServerSidePropsLoginMiddleware(async (context) => {
  try {
    const { user } = context.req.session;

    const res = await axios.post(`${process.env.BASE_URL}/api/timeline/user-timeline`, { user: user.googleId });
    let data = {};
    if (res.status === 200) {
      data = res.data;
    }

    return { props: { data, user } };
  } catch (e) {
    return redirectToPage('/404');
  }
});
