import React, { useEffect, useState } from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';
import axios from 'axios';
import PropTypes from 'prop-types';
import styles from '../styles/Timeline.module.css';
import MovieItemComponent from '../components/TimelinePage/MovieItemComponent/MovieItemComponent';
import getServerSidePropsLoginMiddleware from '../middlware/getServerSidePropsLoginMiddleware';
import redirectToPage from '../utils/redirectToPage';

export default function Timeline({ data }) {
  const dates = new Set();
  const months = new Set();
  const years = new Set();

  const [movies, setMovies] = useState([]);
  dates.clear();
  months.clear();
  years.clear();
  useEffect(() => {
    setMovies(data
      .sort((a, b) => b.date - a.date)
      .map((movie) => ({
        ...movie,
        date: movie.date >= 0 ? new Date(movie.date) : null,
      })));
  }, [data]);

  const renderMovie = (movie) => {
    const day = movie.date ? movie.date.getTime() : null;
    const firstOfDay = !dates.has(day);
    dates.add(day);

    const month = movie.date ? new Date(movie.date.getFullYear(), movie.date.getMonth())
      .getTime() : null;
    const firstOfMonth = !months.has(month);
    months.add(month);

    const year = movie.date ? movie.date.getFullYear() : null;
    const firstOfYear = !years.has(year);
    years.add(year);

    return (
      <MovieItemComponent
        showDay={firstOfDay}
        showMonth={firstOfMonth}
        showYear={firstOfYear}
        key={`${movie.id}${movie.groupName ? movie.groupName.replace(/\s+/g, '') : ''}`}
        movie={movie}
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
        {movies.map(renderMovie)}
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
