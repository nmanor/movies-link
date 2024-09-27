'use client'

import React, {SyntheticEvent, useCallback} from 'react';
import Image from 'next/image';
import styles from './PostersCollage.module.css';

const width = 100;
const height = 120;
const gridSize = 4;

type PostersCollageProps = {
    images: string[];
}

export default function PostersCollage({images}: PostersCollageProps) {
    const handleError = useCallback((e: SyntheticEvent<HTMLImageElement>) => {
        const {8: image} = images;
        const target = e.target as HTMLImageElement;
        target.src = image;
    }, [images]);

    const renderImage = (src: string) => (
        <Image
            onError={handleError}
            src={src}
            width={width}
            height={height}
            key={src.slice(48)}
            alt=""
        />
    );

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
