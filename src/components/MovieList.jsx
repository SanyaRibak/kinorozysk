import PropTypes from 'prop-types';
import movieShape from '../movieShape';
import MovieCard from './MovieCard';

function MovieList({ movies, onSelect, selectedId }) {
  return <div className="movie-list">{movies.map((movie) => <MovieCard key={movie.id} movie={movie} selected={selectedId === movie.id} onSelect={() => onSelect(movie.id)} />)}</div>;
}

MovieList.propTypes = { movies: PropTypes.arrayOf(PropTypes.shape(movieShape).isRequired).isRequired, onSelect: PropTypes.func.isRequired, selectedId: PropTypes.number };
MovieList.defaultProps = { selectedId: 0 };
export default MovieList;
