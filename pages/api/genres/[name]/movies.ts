import type { NextApiRequest, NextApiResponse } from 'next'
import { int } from 'neo4j-driver'
import { read } from '../../../../lib/neo4j'
import Genre from '../../../../types/genre';
import Movie from '../../../../types/movie';

interface MovieResult {
  count: string;
  movie: Movie;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{total: number, data: Movie[]}>
) {
  const { name  } = req.query
  const limit = parseInt(req.query.limit as string ?? '10')
  const page = parseInt(req.query.page as string ?? '1')
  const skip = (page - 1) * limit

  const result = await read<MovieResult>(`
    MATCH (m:Movie)-[:IN_GENRE]->(g:Genre {name: $genre})
    RETURN
      g { .* } AS genre,
      toString(size((g)<-[:IN_GENRE]-())) AS count,
      m {
        .tmdbId,
        .title
      } AS movie
    ORDER BY m.title ASC
    SKIP $skip
    LIMIT $limit
  `, {
      genre: name,
      limit: int(limit),
      skip: int(skip)
  })

  res.status(200).json({
    total: parseInt(result[0]?.count) || 0,
    data: result.map(record => record.movie)
  })
}
