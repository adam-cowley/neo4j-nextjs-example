import Link from "next/link";
import { read } from "../../lib/neo4j"
import Genre from "../../types/genre";


interface GenreRecord {
    genre: Genre;
}

export async function getStaticProps() {
    const res = await read<GenreRecord>(`
        MATCH (g:Genre)
        WHERE g.name <> '(no genres listed)'

        CALL {
        WITH g
        MATCH (g)<-[:IN_GENRE]-(m:Movie)
        WHERE m.imdbRating IS NOT NULL AND m.poster IS NOT NULL
        RETURN m.poster AS poster
        ORDER BY m.imdbRating DESC LIMIT 1
        }

        RETURN g {
            .*,
            movies: toString(size((g)<-[:IN_GENRE]-(:Movie))),
            poster: poster
        } AS genre
        ORDER BY g.name ASC
    `)

    const genres = res.map(row => row.genre)

    return {
        props: {
            genres,
        }
    }
}

interface GenresListProps {
    genres: Genre[];
}

export default function GenresList({ genres }: GenresListProps) {
    return (
        <div>
            <h1>Genres</h1>

            <ul>
                {genres.map(genre => <li key={genre.name}>
                    <Link href={`/genres/${genre.name}`}>{genre.name} ({genre.movies})</Link>
                </li>)}
            </ul>
        </div>
    )
}
