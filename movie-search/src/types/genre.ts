import { Movie } from '@/types/movie';

export const GENRE_CONTENT_TYPE = 'genre';

export type Genre = {
	id: string;
	title: string | null;
	movies: Array<Partial<Movie>>;
};