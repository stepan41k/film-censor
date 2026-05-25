export interface Movie {
  id: number;
  name: string;
  description?: string;
  year: number;
  poster: {
    url: string;
    previewUrl?: string;
  };
  rating: {
    kp: number;
  };
}

export interface Review {
  id: number;
  movie_id: number;
  username: string;
  rating: number;
  comment: string;
}