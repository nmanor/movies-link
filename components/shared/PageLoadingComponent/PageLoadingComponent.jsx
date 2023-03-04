import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './PageLoadingComponent.module.css';

export default function PageLoadingComponent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, []);

  return loading && (
    <div className={styles.spinnerWrapper}>
      <p>LOADING...</p>
      <div className={styles.spinner} />
    </div>
  );
}
