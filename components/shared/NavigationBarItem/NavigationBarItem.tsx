import Link from "next/link";
import styles from "./NavigationBarItem.module.css";
import React, {ReactNode} from "react";
import clsx from "clsx";

type NavigationBarItemProps = {
    fullIcon: ReactNode;
    blankIcon: ReactNode;
    href: string;
    isActive: boolean;
}

export default function NavigationBarItem({fullIcon, blankIcon, href, isActive}: NavigationBarItemProps) {
    return (
        <Link href={href}>
            {isActive ? fullIcon : blankIcon}
            <div className={clsx(styles.circle, {[styles.invisible]: !isActive})}/>
        </Link>
    );
}
