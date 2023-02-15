import extractBrightestColor from '@/utils/colorExtractor';

export default async function handler(req, res) {
  // const { mid } = req.query;

  const posterUrl = 'https://www.themoviedb.org/t/p/original/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg';
  const accentColor = await extractBrightestColor(posterUrl, 5);

  const result = {
    posterUrl,
    accentColor,
    name: 'Thor: Love and Thunder',
    mediaType: 'Movie',
    distributionYear: '2022',
    duration: { hours: 1, minutes: 59 },
    knownActors: [],
  };

  res.json(result);
}
