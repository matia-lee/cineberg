import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import SearchPage from './components/SearchPage';
import MovieRecommender from './components/MovieRecommender';
import Template from './components/Template';
import './static/MovieCard.css';
import './static/MovieCardFlipped.css';
import './static/Homepage.css'
import './static/SearchPage.css'
import './static/MovieRecommender.css'
import './static/Template.css'
  
const App = () => {

  


  // useEffect (() => {
  //   const api_key = process.env.REACT_APP_TMDB_KEY;
  //   const options = {
  //     method: 'GET',
  //     headers: {
  //       accept: 'application/json',
  //       Authorization: 'Bearer ' + api_key
  //     }
  //   };
    
  //   const urlBase = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.asc&vote_count.gte=120&vote_count.lte=1900&with_keywords=258226%20%7C%20313730%20%7C%20263293%20%7C%20315905%20%7C%20314753%20%7C%20323722%20%7C%20319005%20%7C%20321897%20%7C%20324360%20%7C%20315053%20%7C%2011130%20%7C%20305431%20%7C%20276235%20%7C%20302191%20%7C%2011034%20%7C%20314104%20%7C%20247328%20%7C%20319320%20%7C%20237867%20%7C%20321288';

  //   Promise.all([
  //     fetch(`${urlBase}&page=1`, options).then(response => response.json()),
  //     fetch(`${urlBase}&page=2`, options).then(response => response.json())
  //   ])
  //   .then(([data1, data2]) => {
  //     setNiche([...data1.results, ...data2.results]);
  //   })
  //   .catch(err => console.error(err));
  // }, []);
  

  


  return(
    <Router>
      <div className = "app">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/recommender" element={<MovieRecommender />}/>
          <Route path="/toprated" element={<Template endpoint="/movie/top_rated?language=en-US&page=1" subtitle="All Time Top Rated Movies: " />} />
          <Route path="/tipoficeberg" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc" subtitle="Tip of the Iceberg Sh*t: " />} />
          <Route path="/niche" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.asc&vote_count.gte=120&vote_count.lte=1900&with_keywords=258226%20%7C%20313730%20%7C%20263293%20%7C%20315905%20%7C%20314753%20%7C%20323722%20%7C%20319005%20%7C%20321897%20%7C%20324360%20%7C%20315053%20%7C%2011130%20%7C%20305431%20%7C%20276235%20%7C%20302191%20%7C%2011034%20%7C%20314104%20%7C%20247328%20%7C%20319320%20%7C%20237867%20%7C%20321288" subtitle="Niche Sh*t: " />} />
          <Route path="/underground" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.asc&vote_average.gte=6&vote_count.gte=200" subtitle="Underground Sh*t: " />} />

          <Route path="/action" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=28" subtitle="Action: " />} />
          <Route path="/adventure" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=12" subtitle="Adventure: " />} />
          <Route path="/animation" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=16" subtitle="Animated: " />} />
          <Route path="/comedy" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=35" subtitle="Comedy: " />} />
          <Route path="/crime" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=80" subtitle="Crime: " />} />
          <Route path="/documentary" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=99" subtitle="Documentary: " />} />
          <Route path="/drama" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=18" subtitle="Drama: " />} />
          <Route path="/family" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=10751" subtitle="Family: " />} />
          <Route path="/fantasy" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=14" subtitle="Fantasy: " />} />
          <Route path="/history" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=36" subtitle="History: " />} />
          <Route path="/horror" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=27" subtitle="Horror: " />} />
          <Route path="/music" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=10402" subtitle="Music: " />} />
          <Route path="/mystery" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=9648" subtitle="Mystery: " />} />
          <Route path="/romance" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=10749" subtitle="Romance: " />} />
          <Route path="/scifi" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=878" subtitle="Science Fiction: " />} />
          <Route path="/tvmovie" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=10770" subtitle="TV Movie: " />} />
          <Route path="/thriller" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=53" subtitle="Thriller: " />} />
          <Route path="/war" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=10752" subtitle="War: " />} />
          <Route path="/western" element={<Template endpoint="/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=37" subtitle="Western: " />} />
        </Routes>
      </div>
    </Router>
  );
  }

export default App;
