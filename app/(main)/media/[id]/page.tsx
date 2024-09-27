import axios, {HttpStatusCode} from "axios";
import {redirect} from "next/navigation";
import {getIronSession} from "iron-session";
import {SessionData} from "@/definitions/session";
import {cookies} from "next/headers";
import cookiesSettings from "@/utils/cookies";

type MediaProps = {
    params: { id: string };
};

export default async function Media({params: {id}}: MediaProps) {
    const {user} = await getIronSession<SessionData>(cookies(), cookiesSettings);

    let media = {};
    let groups = [];

    try {
        const [mediaResponse, groupsResponse] = await Promise.all([
            axios.post(`${process.env.BASE_URL}/api/media/${id}`, {user: user.googleId}),
            axios.post(`${process.env.BASE_URL}/api/groups/users-group`, {user: user.googleId}),
        ]);

        if (mediaResponse.status === HttpStatusCode.Ok) {
            media = mediaResponse.data;
        }

        if (groupsResponse.status === HttpStatusCode.Ok) {
            groups = groupsResponse.data;
        }
    } catch (err) {
        console.error(err);
        redirect('/404');
    }

    return (
        <p>{media.toString()}</p>
    );
}
