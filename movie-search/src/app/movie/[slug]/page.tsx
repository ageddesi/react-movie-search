"use client"
import MovieCoverList from "@/components/MovieCoverList";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import { Movie } from "@/types/movie";
import { useEffect, useState } from "react";

const BASE_MOVIE_API_URL = 'https://0kadddxyh3.execute-api.us-east-1.amazonaws.com'

export default function Home() {
  
  const [appLoading, setAppLoading] = useState(true);
  const [appError, setAppError] = useState(null as null | string);
  const [movies, setMovies] = useState([] as Movie[])
  const [peformedSearch, setPerformedSearch] = useState(false)
  const [currentSearchTerm, setCurrentSearchTerm] = useState('')
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalPages: 0,
    perPage: 9
  })

  const setAppErrorState = () => {
    setAppLoading(false);
    setAppError('Unable to fecth movies at this time, try again later')
  }

  const setupInitApp = async() => {
    if(localStorage.getItem("token")) {
      setAppLoading(false)
      return
    }
    try {
      const response = await fetch(BASE_MOVIE_API_URL + '/auth/token');
      
      if (!response.ok) {
        // Error the application
        setAppErrorState();
        return;
      } 
  
      const json = await response.json();
      localStorage.setItem("token", json.token);
      setAppLoading(false)
      
    } catch (error) {
      setAppErrorState();
    }
  }

  function buildApiMovieUrl(params: { page?: number, limit?: number, search?: string, genre?: string }): string {
    const baseUrl = BASE_MOVIE_API_URL + "/movies";
    const queryParams: string[] = [];
  
    if (params.page) {
      queryParams.push(`page=${params.page}`);
    }
  
    if (params.limit) {
      queryParams.push(`limit=${params.limit}`);
    }
  
    if (params.search) {
      queryParams.push(`search=${encodeURIComponent(params.search)}`); // Encode for URL safety
    }
  
    if (params.genre) {
      queryParams.push(`genre=${encodeURIComponent(params.genre)}`); // Encode for URL safety
    }
  
    if (queryParams.length > 0) {
      return `${baseUrl}?${queryParams.join("&")}`;
    } else {
      return baseUrl;
    }
  }

  const getFullMovieData = async(movieId: string) => {
    const movieApiUrl = BASE_MOVIE_API_URL + `/movies/${movieId}`;
    try {
      const response = await fetch(movieApiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      
      if (!response.ok) {
        // Error the application
        setAppErrorState();
        return;
      } 

      return response.json();
      
    } catch (error) {
      setAppErrorState();
    }
  }     

  const getMovies = async(params: { page?: number, limit?: number, search?: string, genre?: string }) => {
    const movieApiUrl = buildApiMovieUrl(params);
    try {
      const response = await fetch(movieApiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (!response.ok) {
        // Error the application
        setAppErrorState();
        return;
      } 
  
      const json = await response.json();

      const moviePromises = json.data.map(async (movie: any) => await getFullMovieData(movie.id));
      const movieData = await Promise.all(moviePromises);

      setMovies(movieData);
      setAppLoading(false);
      setPaginationData({...paginationData, ...{ totalPages: json.totalPages, page : params.page}})
      setPerformedSearch(true);

    } catch (error) {
      setAppErrorState();
    }
  }

  const handleSearchSubmit = (searchString: string) => {
    setAppLoading(true)
    setCurrentSearchTerm(searchString);
    getMovies({search: searchString, limit: paginationData.perPage, page: paginationData.currentPage});
  }

  const handlePaginationChange = (page: number) => {
    getMovies({search: currentSearchTerm, limit: paginationData.perPage, page: page});
  }

  useEffect(() => {    
    setupInitApp();
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <p className="text-xl text-gray-500 mt-5">Search for a movie</p>
      <SearchBar handleSubmit={handleSearchSubmit} />
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
