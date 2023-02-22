export default async function handler(req, res) {
  const { mid } = req.query;

  const result = {
    id: mid,
    posterUrl: 'https://www.themoviedb.org/t/p/original/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg',
    name: 'Thor: Love and Thunder',
    watchedByUser: false,
    mediaType: 'Movie',
    distributionYear: '2022',
    duration: { hours: 1, minutes: 59 },
    knownActors: [
      {
        imageUrl: 'https://www.themoviedb.org/t/p/original/jpurJ9jAcLCYjgHHfYF32m3zJYm.jpg',
        fullName: 'Chris Hemsworth',
        lastMovie: 'Men in Black: International',
        totalNumOfMovies: 5,
        id: 0,
      },
      {
        imageUrl: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2/zE90yInhhU8fLz1HgWpB9KPvGnE.jpg',
        fullName: 'Natalie Portman',
        lastMovie: 'Annihilation',
        totalNumOfMovies: 2,
        id: 1,
      },
      {
        imageUrl: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2/83o3koL82jt30EJ0rz4Bnzrt2dd.jpg',
        fullName: 'Chris Pratt',
        lastMovie: 'Jurassic World: Fallen Kingdom',
        totalNumOfMovies: 6,
        id: 2,
      },
      {
        imageUrl: 'https://www.themoviedb.org/t/p/original/jpurJ9jAcLCYjgHHfYF32m3zJYm.jpg',
        fullName: 'Chris Hemsworth',
        lastMovie: 'Men in Black: International',
        totalNumOfMovies: 5,
        id: 3,
      },
      {
        imageUrl: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2/zE90yInhhU8fLz1HgWpB9KPvGnE.jpg',
        fullName: 'Natalie Portman',
        lastMovie: 'Annihilation',
        totalNumOfMovies: 2,
        id: 4,
      },
      {
        imageUrl: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2/83o3koL82jt30EJ0rz4Bnzrt2dd.jpg',
        fullName: 'Chris Pratt',
        lastMovie: 'Jurassic World: Fallen Kingdom',
        totalNumOfMovies: 6,
        id: 5,
      },
    ],
  };

  res.json(result);
}
