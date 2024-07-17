import { Movie } from "@/types/movie";

const BASE_MOVIE_API_URL = 'https://0kadddxyh3.execute-api.us-east-1.amazonaws.com'

export type MovieUtilsResponse = {
    success: boolean;
    message: string;
    body: any;
}

/**
 * Return a list of headers needed to interact with the movies db api
 */
function getApiHeaders() {
    return {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    }
}

/**
 * Builds up a url with optional parameters to interact with the /movies api endpoint
 */
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

/**
 * Setup the app by getting a token for interacting with the movie api
 */
export async function initMovieDb(): Promise<MovieUtilsResponse> {
    if(localStorage.getItem("token")) {
        return {
            body: {},
            message: '',
            success: true
        }
    }
    try {
        const response = await fetch(BASE_MOVIE_API_URL + '/auth/token');
        
        if (!response.ok) {
            return {
                body: {},
                message: 'There was an error communicating with the server',
                success: false
            }
        } 
    
        const json = await response.json();
        localStorage.setItem("token", json.token);
        return {
            body: {},
            message: '',
            success: true
        }
        
    } catch (error) {
        return {
            body: {},
            message: 'There was an error communicating with the server',
            success: false
        }
    }
}

/**
 * Use the movie api to get a list of movies based on search criteria and pagination
 */
export async function getFullMovieData(movieId: string) : Promise<MovieUtilsResponse> {
    const movieApiUrl = BASE_MOVIE_API_URL + `/movies/${movieId}`;

    try {
        const response = await fetch(movieApiUrl, {
            headers: getApiHeaders(),
        });
        
        if (!response.ok) {
            return {
                body: {},
                message: 'There was an error communicating with the server',
                success: false
            }
        } 
    
        return {
            body: await response.json(),
            message: '',
            success: true
        }
        
    } catch (error) {
        return {
            body: {},
            message: 'There was an error communicating with the server',
            success: false
        }
    }
}

/**
 * Use the movie api to get detailed information on a movie based on id.
 */
export async function getMovies(params: { page?: number, limit?: number, search: string, genre?: string }) : Promise<MovieUtilsResponse> {
    const movieApiUrl = buildApiMovieUrl(params);
    try {
        const response = await fetch(movieApiUrl, {
            headers: getApiHeaders(),
        });
        
        if (!response.ok) {
            return {
                body: {},
                message: 'There was an error communicating with the server',
                success: false
            }
        } 
    
        const json = await response.json();

        const moviePromises = json.data.map(async (movie: any) => await getFullMovieData(movie.id));
        const movieDataWithResponses = await Promise.all(moviePromises);
        const movieData = movieDataWithResponses.map(response => {
            if (response.success) {
                return response.body;
            }
        }).filter(movie => movie !== null);

        return {
            body: {
                movieData,
                totalPages: json.totalPages 
            },
            message: '',
            success: true
        }
        
    } catch (error) {
        return {
            body: {},
            message: 'There was an error communicating with the server',
            success: false
        }
    }
}