import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import axios, { HttpStatusCode } from 'axios';
import { PropTypes } from 'prop-types';
import styles from '../styles/Home.module.css';
import getServerSidePropsLoginMiddleware from '../middlware/getServerSidePropsLoginMiddleware';
import redirectToPage from '../utils/redirectToPage';
import { greetByTime } from '../utils/dates';
import BlankSearchSVGComponent from '../components/shared/svg/Search/BlankSearchSVGComponent';
import CameraSVGComponent from '../components/shared/svg/CameraSVGComponent';
import TvSVGComponent from '../components/shared/svg/TvSVGComponent';

export default function Home({ user, trending }) {
  return (
    <>
      <Head>
        <title>Movie Links</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Image
          className={styles.tvImage}
          width={150}
          height={150}
          src="/images/tv.png"
          alt="Illustration of TV and popcorn"
        />
        <h1 className={styles.greeting}>{greetByTime(user.firstName)}</h1>
        <Link className={styles.searchShortcut} href="/search">
          <BlankSearchSVGComponent />
          <p>
            Looking for a movie or TV show?
            <br />
            <span>
              Try the search here
            </span>
          </p>
        </Link>

        <h2 className={styles.trendingTitle}>Trending movies & TV shows</h2>
        <div className={styles.trending}>
          {trending.map(({ id, path, title }, i) => (
            <Link key={id} href={`/media/${id}`} className={styles.mediaCard}>
              <Image
                src={path}
                alt={`Poster of ${title}`}
                width={0}
                height={0}
                priority={i < 3}
              />
              <div className={styles.mediaTitle}>
                {id.startsWith('m')
                  ? <CameraSVGComponent />
                  : <TvSVGComponent />}
                <h3>{title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

Home.propTypes = {
  user: PropTypes.instanceOf(Object),
  trending: PropTypes.arrayOf(Object),
};

Home.defaultProps = {
  user: {},
  trending: [],
};

export const getServerSideProps = getServerSidePropsLoginMiddleware(async (context) => {
  try {
    const { user } = context.req.session;

    const trendingResponse = await axios.get(`${process.env.BASE_URL}/api/media/trending-movies`);

    let trending = {};
    if (trendingResponse.status === HttpStatusCode.Ok) {
      trending = trendingResponse.data;
    }

    return { props: { user, trending } };
  } catch (e) {
    console.error(e);
    return redirectToPage('/404');
  }
});
