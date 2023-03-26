import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import classNames from 'classnames/bind';
import styles from './NavigationBarComponent.module.css';
import FullHomeSVGComponent from '../svg/Home/FullHomeSVGComponent';
import BlankHomeSVGComponent from '../svg/Home/BlankHomeSVGComponent';
import FullUserSVGComponent from '../svg/User/FullUserSVGComponent';
import BlankUserSVGComponent from '../svg/User/BlankUserSVGComponent';
import FullTimelineSVGComponent from '../svg/Timeline/FullTimelineSVGComponent';
import BlankTimelineSVGComponent from '../svg/Timeline/BlankTimelineSVGComponent';
import FullSearchSVGComponent from '../svg/Search/FullSearchSVGComponent';
import BlankSearchSVGComponent from '../svg/Search/BlankSearchSVGComponent';

const cx = classNames.bind(styles);
const initialActivation = {
  home: false,
  profile: false,
  timeline: false,
  user: false,
};

export default function NavigationBarComponent() {
  const router = useRouter();
  const [activePages, setActivePages] = useState(initialActivation);

  useEffect(() => {
    const handleStart = (url) => setActivePages({
      home: url.match(/^\/$/),
      profile: url.match(/^\/(profile|group)/),
      timeline: url.match(/^\/timeline/),
      search: url.match(/^\/(search|media|actor)/),
    });

    router.events.on('routeChangeStart', handleStart);
    handleStart(router.asPath);

    return () => router.events.off('routeChangeStart', handleStart);
  }, []);

  return (
    <nav className={styles.container}>
      <Link href="/">
        {activePages.home
          ? <FullHomeSVGComponent className={styles.checkmark} />
          : <BlankHomeSVGComponent className={styles.checkmark} />}
        <div className={cx(styles.circle, { [styles.invisible]: !activePages.home })} />
      </Link>

      <Link href="/profile">
        {activePages.profile
          ? <FullUserSVGComponent className={styles.checkmark} />
          : <BlankUserSVGComponent className={styles.checkmark} />}
        <div className={cx(styles.circle, { [styles.invisible]: !activePages.profile })} />
      </Link>

      <Link href="/timeline">
        {activePages.timeline
          ? <FullTimelineSVGComponent className={styles.checkmark} />
          : <BlankTimelineSVGComponent className={styles.checkmark} />}
        <div className={cx(styles.circle, { [styles.invisible]: !activePages.timeline })} />
      </Link>

      <Link href="/search">
        {activePages.search
          ? <FullSearchSVGComponent className={styles.checkmark} />
          : <BlankSearchSVGComponent className={styles.checkmark} />}
        <div className={cx(styles.circle, { [styles.invisible]: !activePages.search })} />
      </Link>
    </nav>
  );
}
