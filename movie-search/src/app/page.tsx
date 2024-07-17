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
  const [peformedSearch, setPerformedSearch] = useState(false)
  const [currentSearchTerm, setCurrentSearchTerm] = useState("")
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalPages: 0,
    perPage: 9
  })

  const handleSearchSubmit = async (params: { page?: number, limit?: number, search: string, genre?: string }) => {
    setAppLoading(true)
    setCurrentSearchTerm(params.search);
    const movies : MovieUtilsResponse = await getMovies({
      search: params.search, 
      limit: paginationData.perPage, 
      page: paginationData.currentPage
    });
    debugger;
    if(movies.success){
      setMovies(movies.body.movieData)
      setPaginationData({...paginationData, ...{ totalPages: movies.body.totalPages, page : params.page}})
      setPerformedSearch(true)
    } else {
      setAppError(movies.message)
    }
    setAppLoading(false)

  }

  const handlePaginationChange = (page: number) => {
    getMovies({search: currentSearchTerm, limit: paginationData.perPage, page: page});
  }

  useEffect(() => {    
    
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <p className="text-xl text-gray-500 mt-5">Search for a movie</p>
      <SearchBar handleSubmit={(value) => {handleSearchSubmit({search: value})}} />
      {appLoading && (
        <div className="mt-5 bg-white flex px-4 py-2">
          <p>Loading...</p>
        </div>
      )}
      {peformedSearch && movies.length > 0 && (
        <>
          <Pagination 
            total={paginationData.totalPages + paginationData.perPage }
            perPage={paginationData.perPage} 
            currentPage={paginationData.currentPage} callBack={handlePaginationChange} />
          <MovieCoverList movies={movies} />
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
