export interface MovieInfo {
  title: string;
  poster_path: string;
  id: number;
  release_date: number;
  backdrop_path: string;
  overview: string;
  media_type: string;
  key: string;
}

export interface MoviesState {
  trending: MovieInfo[];
  nowplaying: MovieInfo[];
  upcoming: MovieInfo[];
}
