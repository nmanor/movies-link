import React from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';
import axios from 'axios';
import PropTypes from 'prop-types';
import styles from '../styles/Timeline.module.css';
import MovieItemComponent from '@/components/TimelinePage/MovieItemComponent/MovieItemComponent';
import getServerSidePropsLoginMiddleware from '@/middlware/getServerSidePropsLoginMiddleware';
import redirectToPage from '@/utils/redirectToPage';

export default function Timeline({ data }) {
  return (
    <ParallaxProvider>
      <article className={styles.container}>
        <h1>Your timeline</h1>
        <p>
          Here&apos;s your viewing timeline of all the movies you&apos;ve added to your movie list.
        </p>
        <div>
          {[...data, ...data, ...data].map((movie, i, arr) => (
            <MovieItemComponent
              movie={{
                ...movie,
                date: movie.date >= 0 ? new Date(movie.date) : null,
              }}
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

export const getServerSideProps = async (context) => {
  try {
    const res = await axios.post(`${process.env.BASE_URL}/api/timeline/user-timeline`, { user: 123 });
    let data = {};
    if (res.status === 200) {
      data = res.data;
    }

    return { props: { data } };
  } catch (e) {
    return redirectToPage('/404');
  }
};
//     getServerSidePropsLoginMiddleware(async (context) => {
//   try {
//     const { user } = context.req.session;
//
//     const res = await axios.post(`${process.env.BASE_URL}/api/timeline/user-timeline`, { user: user.googleId });
//     let data = {};
//     if (res.status === 200) {
//       data = res.data;
//     }
//
//     return { props: { data, user } };
//   } catch (e) {
//     return redirectToPage('/404');
//   }
// });
