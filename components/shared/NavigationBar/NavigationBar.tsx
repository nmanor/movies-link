'use client'

import React from 'react';
import styles from './NavigationBar.module.css';
import FullHomeSVGComponent from '../svg/Home/FullHomeSVGComponent';
import BlankHomeSVGComponent from '../svg/Home/BlankHomeSVGComponent';
import FullUserSVGComponent from '../svg/User/FullUserSVGComponent';
import BlankUserSVGComponent from '../svg/User/BlankUserSVGComponent';
import FullTimelineSVGComponent from '../svg/Timeline/FullTimelineSVGComponent';
import BlankTimelineSVGComponent from '../svg/Timeline/BlankTimelineSVGComponent';
import FullSearchSVGComponent from '../svg/Search/FullSearchSVGComponent';
import BlankSearchSVGComponent from '../svg/Search/BlankSearchSVGComponent';
import {usePathname} from "next/navigation";
import NavigationBarItem from "@/components/shared/NavigationBarItem/NavigationBarItem";

export default function NavigationBar() {
    const pathname = usePathname();

    return (
        <nav className={styles.container}>
            <NavigationBarItem fullIcon={<FullHomeSVGComponent className={styles.checkmark}/>}
                               blankIcon={<BlankHomeSVGComponent className={styles.checkmark}/>}
                               href="/"
                               isActive={!!pathname?.match(/^\/$/)}/>

            <NavigationBarItem fullIcon={<FullUserSVGComponent className={styles.checkmark}/>}
                               blankIcon={<BlankUserSVGComponent className={styles.checkmark}/>}
                               href="/profile"
                               isActive={!!pathname?.match(/^\/(profile|group)/)}/>

            <NavigationBarItem fullIcon={<FullTimelineSVGComponent className={styles.checkmark}/>}
                               blankIcon={<BlankTimelineSVGComponent className={styles.checkmark}/>}
                               href="/timeline"
                               isActive={!!pathname?.match(/^\/timeline/)}/>

            <NavigationBarItem fullIcon={<FullSearchSVGComponent className={styles.checkmark}/>}
                               blankIcon={<BlankSearchSVGComponent className={styles.checkmark}/>}
                               href="/search"
                               isActive={!!pathname?.match(/^\/(search|media|actor)/)}/>
        </nav>
    );
}
