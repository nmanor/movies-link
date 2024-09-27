import PostersCollage from "@/components/LoginPage/PostersCollage/PostersCollage";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import styles from './login.module.css';
import axios from "axios";
import {redirect} from "next/navigation";
import googleLogo from '@/public/google-logo.svg'

export default async function Login() {
    let images: string[];
    try {
        const response = await axios.get(`${process.env.BASE_URL}/api/media/popular-images`);
        images = response.data;
    } catch (ex) {
        console.error(ex);
        redirect('/404');
    }

    return (
        <main className={styles.container}>
            <div className={styles.postersCollageWrapper}>
                <PostersCollage images={images}/>
            </div>
            <div className={styles.title}>
                <h1>Welcome to Movie Links!</h1>
                <p>
                    Here you can easily identify all the movies and actors you know,
                    and keep track of the movies you watch.
                </p>
                <Link href="/api/auth/google">
                    <Image
                        src={googleLogo}
                        width={25}
                        height={25}
                        alt="Google logo"
                    />
                    Sign in with Google
                </Link>
            </div>
        </main>
    );
}
