import { Movie } from "@/types/movie";

const MovieCoverList = ({ movies }: { movies: Movie[] }) => {
    return (
        <section id="Projects"
            className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
            {movies.length > 0 && movies.map((movie) => (
                <div key={movie.id} className="w-72 group relative bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl overflow-hidden">
                    <img src={movie.posterUrl}
                        className="h-80 w-72 object-cover rounded-t-xl" 
                        alt={movie.title} />
                    <div className="px-4 py-3 w-72">
                        <span className="text-gray-400 mr-3 uppercase text-xs">{movie.genres.map((genre) => {
                            return (
                                <span className="mr-2" key={genre.id}>{genre.title}</span>
                            )
                        })}</span>
                        <p className="text-lg font-bold text-black truncate block capitalize ">{movie.title}</p>
                    </div>
                    <div className="w-72 absolute top-0 left-full  rounded-xl h-full group-hover:left-0">
                        <div className="mt-20 bg-white h-full p-2 overflow-x-auto">
                            <p className="text-sm font-bold text-black ">Rating: {movie.ratingValue}</p>
                            <p className="text-sm font-bold text-black mt-2">{movie.summary}</p>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}

export default MovieCoverList;