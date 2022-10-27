import { int } from 'neo4j-driver'
import Link from 'next/link';
import GenresList from '.';
import GenreMovieList from '../../components/genre/movie-list';
import { read } from "../../lib/neo4j";
import Genre from '../../types/genre';
import Movie from '../../types/movie';

interface GenreDetailsServerSideProps {
    params: {
        name: string;
    },
    query: {
        page?: string;
    },
}

interface GenreRecord {
    genre: Genre;
    count: number;
}

export async function getServerSideProps({ query, params }: GenreDetailsServerSideProps) {
    const res = await read<GenreRecord>(`
        MATCH (g:Genre {name: $genre})
        RETURN g { .* } AS genre, toString(size((g)<-[:IN_GENRE]-())) AS count
    `, {
        genre: params.name,
    })

    const genre = res[0].genre
    const count = res[0].count

    return {
        props: {
            genre,
            count,
        }
    }
}

interface GenreDetailsProps {
    genre: Genre;
    movies: Movie[];
    count: number;
    skip: number;
    page: number;
    limit: number;
}

export default function GenreDetails({ genre, count }: GenreDetailsProps) {
    return (
        <div>
            <h1>{genre.name}</h1>
            <p>There are {count} movies listed as {genre.name}.</p>

            <GenreMovieList genre={genre} />
        </div>
    )
}
