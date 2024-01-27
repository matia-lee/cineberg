import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import SearchPage from './components/SearchPage';
import './static/MovieCard.css';
import './static/MovieCardFlipped.css';
import './static/Homepage.css'
import './static/SearchPage.css'
  


// interface Movie {
//   id: number;
// }

const App = () => {
  // const [niche, setNiche] = useState<Movie[]>([]);
  


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
    <BrowserRouter>
      <div className = "app">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <SearchPage />
        </Routes>
      


          {/* <div className = "subtitle">
            <h2>Niche Sh*t: </h2>
          </div>

          <div className = "container-movie">
            {niche.map((movie) => (
              <div key = {movie.id} onClick={() => handleFlip(movie)}>
                <MovieCard movie={movie}/>
              </div>
            ))}
          </div> */}
        </div>
    </BrowserRouter>
  );
  }

export default App;