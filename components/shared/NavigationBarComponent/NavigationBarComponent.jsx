import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import classNames from 'classnames/bind';
import styles from './NavigationBarComponent.module.css';
import FullHomeSVGComponent from '@/components/shared/svg/Home/FullHomeSVGComponent';
import BlankHomeSVGComponent from '@/components/shared/svg/Home/BlankHomeSVGComponent';
import FullUserSVGComponent from '@/components/shared/svg/User/FullUserSVGComponent';
import BlankUserSVGComponent from '@/components/shared/svg/User/BlankUserSVGComponent';
import FullTimelineSVGComponent from '@/components/shared/svg/Timeline/FullTimelineSVGComponent';
import BlankTimelineSVGComponent from '@/components/shared/svg/Timeline/BlankTimelineSVGComponent';
import FullSearchSVGComponent from '@/components/shared/svg/Search/FullSearchSVGComponent';
import BlankSearchSVGComponent from '@/components/shared/svg/Search/BlankSearchSVGComponent';

const cx = classNames.bind(styles);

export default function NavigationBarComponent() {
  const router = useRouter();
  const [home, setHome] = useState(false);
  const [user, setUser] = useState(false);
  const [timeline, setTimeline] = useState(false);
  const [search, setSearch] = useState(false);

  return (
    <nav className={styles.container}>
      <Link href="/" onClick={() => setHome((val) => !val)}>
        {home ? <FullHomeSVGComponent className={styles.checkmark} />
          : <BlankHomeSVGComponent className={styles.checkmark} />}
        <div className={cx(styles.circle, { [styles.invisible]: !home })} />
      </Link>

      <Link href="/" onClick={() => setUser((val) => !val)}>
        {user ? <FullUserSVGComponent className={styles.checkmark} />
          : <BlankUserSVGComponent className={styles.checkmark} />}
        <div className={cx(styles.circle, { [styles.invisible]: !user })} />
      </Link>

      <Link href="/" onClick={() => setTimeline((val) => !val)}>
        {timeline ? <FullTimelineSVGComponent className={styles.checkmark} />
          : <BlankTimelineSVGComponent className={styles.checkmark} />}
        <div className={cx(styles.circle, { [styles.invisible]: !timeline })} />
      </Link>

      <Link href="/" onClick={() => setSearch((val) => !val)}>
        {search ? <FullSearchSVGComponent className={styles.checkmark} />
          : <BlankSearchSVGComponent className={styles.checkmark} />}
        <div className={cx(styles.circle, { [styles.invisible]: !search })} />
      </Link>
    </nav>
  );
}
