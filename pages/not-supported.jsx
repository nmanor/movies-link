import React from 'react';
import Lottie from 'lottie-react';
import styles from '../styles/NotSupported.module.css';
import animationData from '../public/lotties/mobile.json';

export default function NotSupported() {
  return (
    <>
      <title>Unsupported device</title>
      <div className={styles.container}>
        <Lottie animationData={animationData} className={styles.lottie} loop={0} />
        <div>
          <h1>Sorry,</h1>
          <p>We currently only support cell phones...</p>
        </div>
      </div>
    </>
  );
}
