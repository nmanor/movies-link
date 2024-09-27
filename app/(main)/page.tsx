import Image from "next/image";
import {greetByTime} from "@/utils/dates";
import Link from "next/link";
import BlankSearchSVGComponent from "@/components/shared/svg/Search/BlankSearchSVGComponent";
import CameraSVGComponent from "@/components/shared/svg/CameraSVGComponent";
import TvSVGComponent from "@/components/shared/svg/TvSVGComponent";
import React from "react";
import styles from './home.module.css';
import axios, {HttpStatusCode} from "axios";
import Trending from "@/definitions/trending";
import {getIronSession} from "iron-session";
import {SessionData} from "@/definitions/session";
import {cookies} from "next/headers";
import cookiesSettings from "@/utils/cookies";

export default async function Home() {
    const {user} = await getIronSession<SessionData>(cookies(), cookiesSettings);

    let trending: Trending[] = [];
    try {
        const trendingResponse = await axios.get(`${process.env.BASE_URL}/api/media/trending-movies`);
        if (trendingResponse.status === HttpStatusCode.Ok) {
            trending = trendingResponse.data;
        }
    } catch (err) {
        console.error(err);
    }

    return (
        <main className={styles.main}>
            <Image
                className={styles.tvImage}
                width={150}
                height={150}
                src="/images/tv.png"
                alt="Illustration of TV and popcorn"
            />
            <h1 className={styles.greeting}>{greetByTime(user.firstName)}</h1>
            <Link className={styles.searchShortcut} href="/search">
                <BlankSearchSVGComponent/>
                <p>
                    Looking for a movie or TV show?
                    <br/>
                    <span>
              Try the search here
            </span>
                </p>
            </Link>

            <h2 className={styles.trendingTitle}>Trending movies & TV shows</h2>
            <div className={styles.trending}>
                {trending.map(({id, path, title}, i) => (
                    <Link key={id} href={`/media/${id}`} className={styles.mediaCard}>
                        <figure className={styles.imageWrapper}>
                            <Image
                                src={path}
                                alt={`Poster of ${title}`}
                                fill
                                priority={i < 3}
                            />
                        </figure>
                        <div className={styles.mediaTitle}>
                            {id.startsWith('m')
                                ? <CameraSVGComponent/>
                                : <TvSVGComponent/>}
                            <h3>{title}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}
