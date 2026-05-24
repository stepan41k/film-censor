export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  tagline?: string;
}

export interface Review {
  id: number;
  movie_id: number;
  username: string;
  rating: number;
  comment: string;
  createdAt?: string;
}