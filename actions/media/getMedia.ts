import {HttpStatusCode} from "axios";
import {getMediaType} from "@/utils/utils";
import EntityType from "@/utils/enums";
import {handleMovie, handleSeries} from "@/dal/media";
import getKnownActors from "@/dal/actors";
import Movie from "@/definitions/movie";

export default async function getMedia(mediaId: string, userId: string) {
    if (!userId) {
        throw new Error('User not logged in');
    }

    if (!mediaId) {
        throw new Error('Media id not specified');
    }

    try {
        const mediaType = getMediaType(mediaId);

        let media;
        let promises;
        if (mediaType === EntityType.Movie) {
            const result = await handleMovie(mediaId, userId);
            media = result.media;
            promises = result.promises;
        } else {
            const result = await handleSeries(mediaId, userId);
            media = result.media;
            promises = result.promises;
        }

        // wait for all the async functions to finish
        await promises;

        let actors = await getKnownActors(userId, mediaId);
        actors = actors.map((actor) => ({
            imageUrl: `https://www.themoviedb.org/t/p/original${actor.profilePath}`,
            fullName: actor.name,
            lastMovie: actor.last,
            totalNumOfMovies: actor.media,
            id: actor.id,
            character: actor.character,
        }));

        const result = {
            ...media,
            id: media.id,
            posterUrl: `${process.env.TMDB_IMAGE_PREFIX}${media.posterUrl}`,
            knownActors: actors,
        };

        if (mediaType === EntityType.Movie) {
            result.duration = {hours: media.duration[0], minutes: media.duration[1]};
        }

        return result;
    } catch (e) {
        console.error(e);
        return null;
    }
}
