import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import PropTypes, { string } from 'prop-types';
import PostersCollageComponent from '../components/LoginPage/PostersCollageComponent/PostersCollageComponent';
import redirectToPage from '../utils/redirectToPage';
import styles from '../styles/Login.module.css';

export default function Login({ images }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current.scrollIntoView();
  }, []);

  return (
    <div className={styles.container}>
      <PostersCollageComponent images={images} />
      <div className={styles.title}>
        <h1>Welcome to Movie Links!</h1>
        <p>
          Here you can easily identify all the movies and actors you know,
          and keep track of the movies you watch.
        </p>
        <Link href="/api/auth/google" ref={bottomRef}>
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/800px-Google_%22G%22_Logo.svg.png"
            width={25}
            height={25}
            alt="Google logo"
          />
          Sign in with Google
        </Link>
      </div>
    </div>
  );
}

Login.propTypes = {
  images: PropTypes.arrayOf(string),
};

Login.defaultProps = {
  images: [],
};

export async function getServerSideProps() {
  try {
    const response = await axios.get(`${process.env.BASE_URL}/api/media/popular-images`);
    return { props: { images: response.data } };
  } catch (e) {
    console.error(e);
    return redirectToPage('/404');
  }
}
