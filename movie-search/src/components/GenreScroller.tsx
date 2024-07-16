import { Genre } from "@/types/genre";

const GenreScroller = ({ genre }: { genre: Genre }) => {
    return (
        <div className="movie-cover-list">
            <div>{genre.title}</div>
            {genre.map((movie) => (
                <div key={movie.id}>{movie.title}</div>
            ))}
        </div>
    );
}

export default GenreScroller;