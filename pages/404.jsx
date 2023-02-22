import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../public/lotties/404-error-animation.json';
import styles from '../styles/404.module.css';

export default function Page404() {
  return (
    <div className={styles.container}>
      <Lottie animationData={animationData} loop />
      <h2>Oops...</h2>
      <p>You probably shouldn&apos;t have arrive here</p>
    </div>
  );
}
