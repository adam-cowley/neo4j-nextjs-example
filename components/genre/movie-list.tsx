import { useEffect, useState } from "react";
import Genre from "../../types/genre";
import Movie from "../../types/movie";

interface GenreMovieListProps {
  genre: Genre;
}

export default function GenreMovieList({ genre }: GenreMovieListProps) {
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [movies, setMovies] = useState<Movie[]>()
  const [total, setTotal] = useState<number>()

  // Get data from the API
  useEffect(() => {
    fetch(`/api/genres/${genre.name}/movies?page=${page}&limit=${limit}`)
      .then(res => res.json())
      .then(json => {
        setMovies(json.data)
        setTotal(json.total)
      })


  }, [genre, page, limit])


  // Loading State
  if (!movies || !total) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <ul>
        {movies.map(movie => <li key={movie.tmdbId}>{movie.title}</li>)}
      </ul>

      <p>Showing page {page}</p>

      {page > 1 && <button onClick={() => setPage(page - 1)}>Previous</button>}
      {page * limit < total && <button onClick={() => setPage(page + 1)}>Next</button>}
    </div>
  )
}
