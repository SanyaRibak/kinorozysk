import { useEffect, useRef, useState } from 'react';
import { API_KEY, API_URL } from './config';
import SearchForm from './components/SearchForm';
import Filters from './components/Filters';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';

function App() {
  const [movies, setMovies] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(API_KEY ? 'Введите название фильма.' : 'Добавьте ключ TMDB в файл .env.');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [minRating, setMinRating] = useState('0');
  const [sortBy, setSortBy] = useState('rating-desc');
  const detailsRef = useRef(null);

  const filteredMovies = movies.filter((movie) => {
    const year = Number(movie.release_date?.slice(0, 4));
    return (!yearFrom || year >= Number(yearFrom)) && (!yearTo || year <= Number(yearTo)) && movie.vote_average >= Number(minRating);
  }).sort((first, second) => {
    if (sortBy === 'rating-asc') return first.vote_average - second.vote_average;
    if (sortBy === 'year-desc') return Number(second.release_date?.slice(0, 4) || 0) - Number(first.release_date?.slice(0, 4) || 0);
    if (sortBy === 'year-asc') return Number(first.release_date?.slice(0, 4) || 0) - Number(second.release_date?.slice(0, 4) || 0);
    return second.vote_average - first.vote_average;
  });

  useEffect(() => {
    if (!selected) return undefined;
    const timer = setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    return () => clearTimeout(timer);
  }, [selected]);

  async function request(path) {
    const separator = path.includes('?') ? '&' : '?';
    const response = await fetch(`${API_URL}${path}${separator}api_key=${API_KEY}&language=ru-RU`);
    if (!response.ok) throw new Error();
    return response.json();
  }

  async function search(query) {
    if (!API_KEY) {
      setMessage('Добавьте VITE_TMDB_API_KEY в файл .env и перезапустите сайт.');
      return;
    }
    setLoading(true);
    setSelected(null);
    setMessage('Ищем фильмы...');
    try {
      const data = await request(`/search/movie?query=${encodeURIComponent(query)}&include_adult=false`);
      setMovies(data.results);
      setMessage(data.results.length ? `Найдено: ${data.total_results}` : 'Фильмы не найдены.');
    } catch {
      setMovies([]);
      setMessage('Не удалось выполнить поиск. Проверьте ключ TMDB и подключение к интернету.');
    } finally {
      setLoading(false);
    }
  }

  async function selectMovie(id) {
    setLoading(true);
    try {
      setSelected(await request(`/movie/${id}?append_to_response=credits`));
    } catch {
      setMessage('Не удалось загрузить информацию о фильме.');
    } finally {
      setLoading(false);
    }
  }

  function resetFilters() {
    setYearFrom('');
    setYearTo('');
    setMinRating('0');
    setSortBy('rating-desc');
  }

  return (
    <>
      <header className="site-header"><a className="logo" href="/">КИНО<span>РОЗЫСК</span></a><nav aria-label="Основное меню"><a className="active" href="#search">Главная</a><a href="#results">Фильмы</a></nav></header>
      <main>
        <section className="hero" id="search"><div className="hero-inner"><div className="hero-copy"><h1>Найдем даже ваши<br />хоум видео</h1><p>И не только ваши.</p></div><SearchForm onSearch={search} loading={loading} /></div></section>
        <section className="catalog" id="results">
          <div className="results-head"><h2>Результаты поиска</h2><p className="message" role="status">{message}</p></div>
          {movies.length > 0 && <Filters yearFrom={yearFrom} yearTo={yearTo} minRating={minRating} sortBy={sortBy} onYearFrom={setYearFrom} onYearTo={setYearTo} onRating={setMinRating} onSort={setSortBy} onReset={resetFilters} />}
          {filteredMovies.length > 0 && <MovieList movies={filteredMovies} onSelect={selectMovie} selectedId={selected?.id} />}
          {movies.length > 0 && filteredMovies.length === 0 && <p className="no-filter-results">По выбранным фильтрам фильмов нет.</p>}
          {selected && <div ref={detailsRef} id="details"><MovieDetails movie={selected} onClose={() => setSelected(null)} /></div>}
        </section>
      </main>
      <footer id="footer">Анекдот: Опытный Соломон Маркович учит молодого соседа:<br />— Лева, слушай сюда и запоминай: женщина — это всегда сюрприз, но не всегда-таки подарок!</footer>
    </>
  );
}

export default App;
