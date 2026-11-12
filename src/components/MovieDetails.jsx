import PropTypes from 'prop-types';
import movieShape from '../movieShape';
import { IMAGE_URL } from '../config';

function MovieDetails({ movie, onClose }) {
  const director = movie.credits?.crew?.find((person) => person.job === 'Director')?.name || 'Не указан';
  const actors = movie.credits?.cast?.slice(0, 5).map((person) => person.name).join(', ') || 'Не указаны';
  const genres = movie.genres?.map((genre) => genre.name).join(', ') || 'Не указан';
  return <section className="details" aria-live="polite"><button className="close" type="button" onClick={onClose}>Закрыть</button><div className="detail-poster">{movie.poster_path ? <img src={`${IMAGE_URL}${movie.poster_path}`} alt={`Постер фильма ${movie.title}`} /> : <span>Нет постера</span>}</div><div className="detail-content"><h2>{movie.title}</h2>{movie.original_title !== movie.title && <p className="original">{movie.original_title}</p>}<div className="facts"><p><b>Год</b><span>{movie.release_date?.slice(0, 4) || 'Не указан'}</span></p><p><b>Режиссёр</b><span>{director}</span></p><p><b>Жанр</b><span>{genres}</span></p><p><b>Время</b><span>{movie.runtime ? `${movie.runtime} мин.` : 'Не указано'}</span></p><p><b>В ролях</b><span>{actors}</span></p></div><div className="rating"><strong>{movie.vote_average ? movie.vote_average.toFixed(1) : '—'}</strong><span>рейтинг TMDB</span></div><h3>Описание</h3><p className="plot">{movie.overview || 'Описание на русском языке отсутствует.'}</p></div></section>;
}

MovieDetails.propTypes = { movie: PropTypes.shape({ ...movieShape, overview: PropTypes.string, runtime: PropTypes.number, genres: PropTypes.array, credits: PropTypes.object }).isRequired, onClose: PropTypes.func.isRequired };
export default MovieDetails;
