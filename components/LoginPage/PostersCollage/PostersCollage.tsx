'use client'

import Image from 'next/image';
import styles from './PostersCollage.module.css';

const width = 100;
const height = 120;
const gridSize = 4;

type PostersCollageProps = {
    images: string[];
}

const renderImage = (src: string) => (
    <Image
        src={src}
        width={width}
        height={height}
        key={src.slice(48)}
        alt=""
    />
);

export default function PostersCollage({images}: PostersCollageProps) {
    return (
        <div className={styles.table}>
            {Array.from({length: gridSize}, (_, i) => (
                <div className={styles.column} key={`column${i}`}>
                    {images.slice(gridSize * i, (gridSize * i) + gridSize).map(renderImage)}
                </div>
            ))}
        </div>
    );
}
