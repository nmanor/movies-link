import React, { useEffect, useState } from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';
import axios from 'axios';
import PropTypes from 'prop-types';
import styles from '../styles/Timeline.module.css';
import MediaItemComponent from '../components/TimelinePage/MediaItemComponent/MediaItemComponent';
import getServerSidePropsLoginMiddleware from '../middlware/getServerSidePropsLoginMiddleware';
import redirectToPage from '../utils/redirectToPage';

export default function Timeline({ data }) {
  const dates = new Set();
  const months = new Set();
  const years = new Set();

  const [media, setMedia] = useState([]);
  dates.clear();
  months.clear();
  years.clear();
  useEffect(() => {
    setMedia(data
      .sort((a, b) => b.date - a.date)
      .map((movie) => ({
        ...movie,
        date: movie.date >= 0 ? new Date(movie.date) : null,
      })));
  }, [data]);

  const renderMedia = (entry) => {
    const day = entry.date ? entry.date.getTime() : null;
    const firstOfDay = !dates.has(day);
    dates.add(day);

    const month = entry.date ? new Date(entry.date.getFullYear(), entry.date.getMonth())
      .getTime() : null;
    const firstOfMonth = !months.has(month);
    months.add(month);

    const year = entry.date ? entry.date.getFullYear() : null;
    const firstOfYear = !years.has(year);
    years.add(year);

    return (
      <MediaItemComponent
        showDay={firstOfDay}
        showMonth={firstOfMonth}
        showYear={firstOfYear}
        key={`${entry.id}${entry.groupName ? entry.groupName.replace(/\s+/g, '') : ''}`}
        media={entry}
      />
    );
  };

  return (
    <ParallaxProvider>
      <div className={styles.container}>
        <div className={styles.sidebar} />
        <div className={styles.title}>
          <h1>Your timeline</h1>
          <p>
            Here&apos;s your viewing timeline of all the
            movies you&apos;ve added to your movie list.
          </p>
        </div>
        {media.map(renderMedia)}
      </div>
    </ParallaxProvider>
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
