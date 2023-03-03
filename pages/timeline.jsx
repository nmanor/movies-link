import React, { useCallback, useRef, useState } from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';
import axios from 'axios';
import PropTypes from 'prop-types';
import styles from '../styles/Timeline.module.css';
import MovieItemComponent from '../components/TimelinePage/MovieItemComponent/MovieItemComponent';
import getServerSidePropsLoginMiddleware from '../middlware/getServerSidePropsLoginMiddleware';
import redirectToPage from '../utils/redirectToPage';
import YearsPickerComponent from '../components/TimelinePage/YearsPickerComponent/YearsPickerComponent';

export default function Timeline({ data }) {
  const refs = {};

  const movies = data
    .sort((a, b) => b.date - a.date)
    .map((movie) => ({
      ...movie,
      ref: undefined,
      date: movie.date >= 0 ? new Date(movie.date) : null,
    }));

  const allMoviesYears = movies
    .filter((movie) => movie.date)
    .map((movie) => movie.date.getFullYear());
  const years = [...new Set(allMoviesYears)];

  years.forEach((year) => {
    const firstMovieOfYear = movies
      .find((movie) => movie.date && movie.date.getFullYear() === year);
    refs[year] = useRef(null);
    firstMovieOfYear.ref = refs[year];
  });

  const [currentYear, setCurrentYear] = useState(years[0]);
  const updateCurrentYear = useCallback(async (value) => {
    const ref = refs[value];
    if (ref && ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }

    setCurrentYear(value);
  }, []);

  return (
    <ParallaxProvider>
      <article className={styles.container}>
        <h1>Your timeline</h1>
        <p>
          Here&apos;s your viewing timeline of all the movies you&apos;ve added to your movie list.
        </p>
        <YearsPickerComponent
          years={years}
          currentYear={currentYear}
          onYearClick={updateCurrentYear}
        />
        <div>
          {movies.map((movie, i, arr) => (
            <MovieItemComponent
              key={movie.movieId}
              priority={i <= 4}
              movie={movie}
              noLine={i + 1 === arr.length}
            />
          ))}
        </div>
      </article>
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
