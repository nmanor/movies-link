export default function handler(req, res) {
  // const { mid } = req.query;

  const result = {
    posterUrl: 'https://www.themoviedb.org/t/p/original/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg',
    name: 'Thor: Love and Thunder',
    mediaType: 'Movie',
    distributionYear: '2022',
    duration: { hours: 1, minutes: 59 },
    knownActors: [],
  };

  res.json(result);
}
