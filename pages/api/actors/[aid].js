import axios from 'axios';

function genderIdToString(gender) {
  if (gender === 1) return 'Female';
  if (gender === 2) return 'Male';
  return 'Other';
}

export default async function handler(req, res) {
  try {
    const { aid } = { aid: 74568 }; // req.query;

    const requests = [
      axios.get(`https://api.themoviedb.org/3/person/${aid}?api_key=${process.env.TMDB_KEY}&language=en-US`),
      axios.get(`https://api.themoviedb.org/3/person/${aid}/external_ids?api_key=${process.env.TMDB_KEY}&language=en-US`)];
    const [{
      data: {
        name, birthday, place_of_birth: placeOfBirth, gender, profile_path: profileUrl,
      },
    },
    {
      data:
            { instagram_id: instagram, facebook_id: facebook, twitter_id: twitter },
    }] = await axios.all(requests);

    const result = {
      id: aid,
      name,
      birthday,
      placeOfBirth: placeOfBirth.split(',').pop().trim(),
      gender: genderIdToString(gender),
      profileUrl: `https://image.tmdb.org/t/p/w780${profileUrl}`,
      instagram: instagram ? `https://www.instagram.com/${instagram}` : null,
      facebook: facebook ? `https://www.facebook.com/${facebook}` : null,
      twitter: twitter ? `https://twitter.com/${twitter}` : null,
      watchedMovies: [
        {
          id: 0,
          posterUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg',
          name: 'Thor: Love and Thunder',
          character: 'Thor Odinson',
          watchDate: 0,
        },
        {
          id: 1,
          posterUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg',
          name: 'Loki',
          character: 'Thor Odinson',
          watchDate: 0,
        },
        {
          id: 2,
          posterUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/dPrUPFcgLfNbmDL8V69vcrTyEfb.jpg',
          name: 'Men in Black: International',
          character: 'Henry / Agent H',
          watchDate: 5,
        },
        {
          id: 3,
          posterUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/ci1QXfBSUBVpLuzxi9A208uwUVi.jpg',
          name: 'The Huntsman: Winter\'s War',
          character: 'The Huntsman',
          watchDate: -5,
        },
      ],
    };

    return res.json(result);
  } catch (e) {
    return res.status(404).end();
  }
}
