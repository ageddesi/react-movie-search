"use client"
import MovieCoverList from "@/components/MovieCoverList";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import { Movie } from "@/types/movie";
import { getMovies, MovieUtilsResponse } from "@/utils/movieDb";
import { useEffect, useState } from "react";


export default function Home() {
  
  const [appLoading, setAppLoading] = useState(false);
  const [appError, setAppError] = useState(null as null | string);
  const [movies, setMovies] = useState([] as Movie[])
  const [filteredMovies, setFilteredMovies] = useState([] as Movie[])
  const [peformedSearch, setPerformedSearch] = useState(false)
  const [currentSearchTerm, setCurrentSearchTerm] = useState("")
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalPages: 0,
    perPage: 9
  })
  const [genres, setGenres] = useState([] as string[])
  const [filterBy, setFilterBy] = useState('none')

  const handleSearchSubmit = async (params: { page: number, limit?: number, search: string, genre?: string }) => {
    setAppLoading(true)
    setCurrentSearchTerm(params.search);
    const movies : MovieUtilsResponse = await getMovies({
      search: params.search, 
      limit: paginationData.perPage, 
      page: paginationData.currentPage
    });
    if(movies.success){
      setMovies(movies.body.movieData)
      setPaginationData({...paginationData, ...{ totalPages: movies.body.totalPages, currentPage : params.page}})
      setPerformedSearch(true)
    } else {
      setAppError(movies.message)
    }
    setAppLoading(false)

  }

  const handlePaginationChange = async (page: number) => {
    setFilterBy('none')
    await handleSearchSubmit({search: currentSearchTerm, page: page})
  }

  useEffect(() => {    
    if(movies.length > 0){
      const uniqueGenres = new Set();
      for (const movie of movies) {
          for (const genre of movie.genres) {
              uniqueGenres.add(genre.title);
          }
      }
      const uniqueGenresArray: string[] = Array.from(uniqueGenres, (genre : any) => genre.toString()); 
      setGenres(uniqueGenresArray)

      if(filterBy !== 'none'){
        const filteredMovies = movies.filter(movie => 
          movie.genres.some(genre => genre.title === filterBy)
        );
        setFilteredMovies(filteredMovies)
      } else {
        setFilteredMovies(movies)
      }

    } else {
      setGenres([])
    }
  }, [movies, filterBy])

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <p className="text-xl text-gray-500 mt-5">Search for a movie</p>
      <SearchBar handleSubmit={(value : string) => {handleSearchSubmit({search: value})}} />
      {genres.length > 0 && (
        <div className="flex gap-2 mt-2"> 
          <div>Filter this pages results by genre:
          </div>
          <select name="cars" id="cars" onChange={(event) => {
              setFilterBy(event.target.value)
            }}>
            <option key={'none'} value="none">No Filter</option>
            {genres.map((genre) => {
              return (
                <option key={genre} value={genre}>{genre}</option>
              )
            })}
          </select>
        </div>
      )}
      {appLoading && (
        <div className="mt-5 bg-white flex px-4 py-2">
          <p>Loading...</p>
        </div>
      )}
      {peformedSearch && movies.length > 0 && (
        <>
          <MovieCoverList movies={filteredMovies} />
          <Pagination 
            total={paginationData.totalPages + paginationData.perPage }
            perPage={paginationData.perPage} 
            currentPage={paginationData.currentPage} callBack={handlePaginationChange} />
        </>
      )}
      {movies.length === 0 && peformedSearch && (
        <div className="mt-5 bg-red flex px-4 py-2">
          <p>No movie found for {currentSearchTerm}, please try again.</p>
        </div>
      )}  
      {appError && (
        <div className="mt-5 bg-red flex px-4 py-2">
          <p>{appError}</p>
        </div>
      )}
    </main>
  );
}
