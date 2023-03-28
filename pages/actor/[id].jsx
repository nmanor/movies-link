import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import axios from 'axios';
import { ParallaxBanner, ParallaxProvider } from 'react-scroll-parallax';
import extractBrightestColor from '../../utils/colorExtractor';
import ActorMetadataComponent from '../../components/ActorPage/ActorMetadataComponent/ActorMetadataComponent';
import BackButtonComponent from '../../components/shared/BackButtonComponent/BackButtonComponent';
import FacebookSVGComponent from '../../components/shared/svg/FacebookSVGComponent';
import InstagramSVGComponent from '../../components/shared/svg/InstagramSVGComponent';
import TwitterSVGComponent from '../../components/shared/svg/TwitterSVGComponent';
import styles from '../../styles/Actor.module.css';
import getServerSidePropsLoginMiddleware from '../../middlware/getServerSidePropsLoginMiddleware';
import redirectToPage from '../../utils/redirectToPage';
import { MoviesListComponent } from '../../components/shared/ItemsListComponent/ItemsListComponent';

function Actor({
  name,
  birthday,
  deathday,
  placeOfBirth,
  gender,
  profileUrl,
  instagram,
  facebook,
  twitter,
  watchedMovies,
}) {
  const [accentColor, setAccentColor] = useState('#FFF');

  const updateAccentColor = async () => {
    const color = await extractBrightestColor(profileUrl);
    setAccentColor(color);
  };
  useEffect(() => { updateAccentColor(); }, [profileUrl]);

  return (
    <>
      <title>{name}</title>

      <ParallaxProvider>
        <meta name="theme-color" content={accentColor} />
        <BackButtonComponent accentColor={accentColor} />
        <ParallaxBanner
          layers={[{ image: profileUrl, speed: -15 }]}
          className={styles.parallax}
        />
        <article className={styles.container}>
          <div className={styles.containerCorner} />
          <div className={styles.header}>
            <h1>{name}</h1>
            <ActorMetadataComponent
              birthday={birthday}
              deathday={deathday}
              gender={gender}
              placeOfBirth={placeOfBirth}
              accentColor={accentColor}
            />
            <div className={styles.socialButtons}>
              {facebook
                && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noreferrer"
                  style={{ backgroundColor: accentColor }}
                >
                  <FacebookSVGComponent className={styles.svgIcon} />
                </a>
                )}
              {instagram
                && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  style={{ backgroundColor: accentColor }}
                >
                  <InstagramSVGComponent className={styles.svgIcon} />
                </a>
                )}
              {twitter
                && (
                <a
                  href={twitter}
                  target="_blank"
                  rel="noreferrer"
                  style={{ backgroundColor: accentColor }}
                >
                  <TwitterSVGComponent className={styles.svgIcon} />
                </a>
                )}
            </div>
          </div>

          <div className={styles.playersSection}>
            {watchedMovies.length === 0
              ? (
                <p className={styles.errorMessage}>
                  <strong>
                    You haven&apos;t watched any of
                    {' '}
                    {name}
                    &apos;s movies yet.
                  </strong>
                  <br />
                  When you watch, they will appear here.
                </p>
              ) : (
                <MoviesListComponent
                  title="Media you watched"
                  items={watchedMovies.sort((m1, m2) => m2.watchDate - m1.watchDate)}
                  accentColor={accentColor}
                />
              )}
          </div>
        </article>
      </ParallaxProvider>
    </>
  );
}

Actor.propTypes = {
  name: PropTypes.string,
  birthday: PropTypes.string,
  deathday: PropTypes.string,
  placeOfBirth: PropTypes.string,
  gender: PropTypes.string,
  profileUrl: PropTypes.string,
  instagram: PropTypes.string,
  facebook: PropTypes.string,
  twitter: PropTypes.string,
  watchedMovies: PropTypes.arrayOf(Object),
};

Actor.defaultProps = {
  name: 'John Doe',
  birthday: '1900-05-12',
  deathday: '1900-05-12',
  placeOfBirth: 'Nowhere',
  gender: 'Other',
  profileUrl: '',
  instagram: null,
  facebook: null,
  twitter: null,
  watchedMovies: [],
};

export const getServerSideProps = getServerSidePropsLoginMiddleware(async (context) => {
  try {
    const { user } = context.req.session;
    const { id } = context.query;

    const res = await axios.post(`${process.env.BASE_URL}/api/actors/${id}`, { user: user.googleId });
    let data = {};

    if (res.status === 200) {
      data = res.data;
    }

    return { props: { ...data } };
  } catch (e) {
    return redirectToPage('/404');
  }
});

export default Actor;
