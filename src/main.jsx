import React, { Component, createRef, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import PropTypes from 'prop-types';
import './style.css';
import './filters.css';

const API_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const movieShape = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  original_title: PropTypes.string.isRequired,
  release_date: PropTypes.string,
  poster_path: PropTypes.string,
  vote_average: PropTypes.number.isRequired,
};

function SearchForm({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function submit(event) {
    event.preventDefault();
    const value = query.trim();
    if (value.length < 2) {
      inputRef.current?.focus();
      return;
    }
    onSearch(value);
  }

  return (
    <form className="search" onSubmit={submit}>
      <label htmlFor="movie-search">Название фильма</label>
      <div className="search-row">
        <input ref={inputRef} id="movie-search" value={query} onChange={({ target }) => setQuery(target.value)} placeholder="Название фильма" minLength="2" required />
        <button type="submit" disabled={loading}>{loading ? 'Ищем...' : 'Найти'}</button>
      </div>
    </form>
  );
}

SearchForm.propTypes = { onSearch: PropTypes.func.isRequired, loading: PropTypes.bool.isRequired };

class MovieCard extends Component {
  static propTypes = {
    movie: PropTypes.shape(movieShape).isRequired,
    onSelect: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
  };

  state = { imageFailed: false };
  buttonRef = createRef();

  render() {
    const { movie: { title, release_date: releaseDate, poster_path: posterPath, vote_average: rating }, onSelect, selected } = this.props;
    const { imageFailed } = this.state;
    return (
      <article className={`movie-card${selected ? ' selected' : ''}`}>
        <button ref={this.buttonRef} type="button" onClick={onSelect} aria-label={`Открыть фильм ${title}`}>
          <div className="poster-small">
            {posterPath && !imageFailed ? <img src={`${IMAGE_URL}${posterPath}`} alt={`Постер фильма ${title}`} onError={() => this.setState({ imageFailed: true })} /> : <span>Нет постера</span>}
          </div>
          <div className="card-text"><h3>{title}</h3><div className="card-meta"><p>{releaseDate?.slice(0, 4) || 'Год не указан'}</p><p className="card-rating">{rating ? rating.toFixed(1) : '—'}</p></div></div>
        </button>
      </article>
    );
  }
}

function MovieList({ movies, onSelect, selectedId }) {
  return <div className="movie-list">{movies.map((movie) => <MovieCard key={movie.id} movie={movie} selected={selectedId === movie.id} onSelect={() => onSelect(movie.id)} />)}</div>;
}

MovieList.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.shape(movieShape).isRequired).isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedId: PropTypes.number,
};
MovieList.defaultProps = { selectedId: 0 };

function Filters({ yearFrom, yearTo, minRating, sortBy, onYearFrom, onYearTo, onRating, onSort, onReset }) {
  return (
    <div className="filters">
      <label>Год от<input type="number" min="1888" max="2100" value={yearFrom} onChange={({ target }) => onYearFrom(target.value)} placeholder="1900" /></label>
      <label>Год до<input type="number" min="1888" max="2100" value={yearTo} onChange={({ target }) => onYearTo(target.value)} placeholder="2026" /></label>
      <label>Рейтинг от<select value={minRating} onChange={({ target }) => onRating(target.value)}><option value="0">Любой</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option></select></label>
      <label>Сортировка<select value={sortBy} onChange={({ target }) => onSort(target.value)}><option value="rating-desc">Рейтинг: высокий</option><option value="rating-asc">Рейтинг: низкий</option><option value="year-desc">Сначала новые</option><option value="year-asc">Сначала старые</option></select></label>
      <button type="button" onClick={onReset}>Сбросить</button>
    </div>
  );
}

Filters.propTypes = {
  yearFrom: PropTypes.string.isRequired,
  yearTo: PropTypes.string.isRequired,
  minRating: PropTypes.string.isRequired,
  sortBy: PropTypes.string.isRequired,
  onYearFrom: PropTypes.func.isRequired,
  onYearTo: PropTypes.func.isRequired,
  onRating: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

function MovieDetails({ movie, onClose }) {
  const director = movie.credits?.crew?.find((person) => person.job === 'Director')?.name || 'Не указан';
  const actors = movie.credits?.cast?.slice(0, 5).map((person) => person.name).join(', ') || 'Не указаны';
  const genres = movie.genres?.map((genre) => genre.name).join(', ') || 'Не указан';
  const year = movie.release_date?.slice(0, 4) || 'Не указан';
  return (
    <section className="details" aria-live="polite">
      <button className="close" type="button" onClick={onClose}>Закрыть</button>
      <div className="detail-poster">{movie.poster_path ? <img src={`${IMAGE_URL}${movie.poster_path}`} alt={`Постер фильма ${movie.title}`} /> : <span>Нет постера</span>}</div>
      <div className="detail-content">
        <h2>{movie.title}</h2>
        {movie.original_title !== movie.title && <p className="original">{movie.original_title}</p>}
        <div className="facts">
          <p><b>Год</b><span>{year}</span></p><p><b>Режиссёр</b><span>{director}</span></p><p><b>Жанр</b><span>{genres}</span></p>
          <p><b>Время</b><span>{movie.runtime ? `${movie.runtime} мин.` : 'Не указано'}</span></p><p><b>В ролях</b><span>{actors}</span></p>
        </div>
        <div className="rating"><strong>{movie.vote_average ? movie.vote_average.toFixed(1) : '—'}</strong><span>рейтинг TMDB</span></div>
        <h3>Описание</h3><p className="plot">{movie.overview || 'Описание на русском языке отсутствует.'}</p>
      </div>
    </section>
  );
}

MovieDetails.propTypes = {
  movie: PropTypes.shape({
    ...movieShape, overview: PropTypes.string, runtime: PropTypes.number, vote_average: PropTypes.number,
    genres: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired })),
    credits: PropTypes.shape({ crew: PropTypes.arrayOf(PropTypes.shape({ job: PropTypes.string, name: PropTypes.string })), cast: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })) }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

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
    const afterStart = !yearFrom || (year && year >= Number(yearFrom));
    const beforeEnd = !yearTo || (year && year <= Number(yearTo));
    return afterStart && beforeEnd && movie.vote_average >= Number(minRating);
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
    setLoading(true); setSelected(null); setMessage('Ищем фильмы...');
    try {
      const data = await request(`/search/movie?query=${encodeURIComponent(query)}&include_adult=false`);
      setMovies(data.results); setMessage(data.results.length ? `Найдено: ${data.total_results}` : 'Фильмы не найдены.');
    } catch {
      setMovies([]); setMessage('Не удалось выполнить поиск. Проверьте ключ TMDB и подключение к интернету.');
    } finally { setLoading(false); }
  }

  async function selectMovie(id) {
    setLoading(true);
    try { setSelected(await request(`/movie/${id}?append_to_response=credits`)); }
    catch { setMessage('Не удалось загрузить информацию о фильме.'); }
    finally { setLoading(false); }
  }

  return (
    <>
      <header className="site-header"><a className="logo" href="/">КИНО<span>РОЗЫСК</span></a><nav aria-label="Основное меню"><a className="active" href="#search">Главная</a><a href="#results">Фильмы</a></nav></header>
      <main>
        <section className="hero" id="search"><div className="hero-inner"><div className="hero-copy"><h1>Найдем даже ваши<br />хоум видео</h1><p>И не только ваши.</p></div><SearchForm onSearch={search} loading={loading} /></div></section>
        <section className="catalog" id="results"><div className="results-head"><h2>Результаты поиска</h2><p className="message" role="status">{message}</p></div>{movies.length > 0 && <Filters yearFrom={yearFrom} yearTo={yearTo} minRating={minRating} sortBy={sortBy} onYearFrom={setYearFrom} onYearTo={setYearTo} onRating={setMinRating} onSort={setSortBy} onReset={() => { setYearFrom(''); setYearTo(''); setMinRating('0'); setSortBy('rating-desc'); }} />}{filteredMovies.length > 0 && <MovieList movies={filteredMovies} onSelect={selectMovie} selectedId={selected?.id} />}{movies.length > 0 && filteredMovies.length === 0 && <p className="no-filter-results">По выбранным фильтрам фильмов нет.</p>}{selected && <div ref={detailsRef} id="details"><MovieDetails movie={selected} onClose={() => setSelected(null)} /></div>}</section>
      </main>
      <footer id="footer">Анекдот: Опытный Соломон Маркович учит молодого соседа:<br />— Лева, слушай сюда и запоминай: женщина — это всегда сюрприз, но не всегда-таки подарок!</footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
