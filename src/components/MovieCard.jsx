import { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import movieShape from '../movieShape';
import { IMAGE_URL } from '../config';

class MovieCard extends Component {
  static propTypes = { movie: PropTypes.shape(movieShape).isRequired, onSelect: PropTypes.func.isRequired, selected: PropTypes.bool.isRequired };
  state = { imageFailed: false };
  buttonRef = createRef();

  render() {
    const { movie, onSelect, selected } = this.props;
    return <article className={`movie-card${selected ? ' selected' : ''}`}><button ref={this.buttonRef} type="button" onClick={onSelect} aria-label={`Открыть фильм ${movie.title}`}><div className="poster-small">{movie.poster_path && !this.state.imageFailed ? <img src={`${IMAGE_URL}${movie.poster_path}`} alt={`Постер фильма ${movie.title}`} onError={() => this.setState({ imageFailed: true })} /> : <span>Нет постера</span>}</div><div className="card-text"><h3>{movie.title}</h3><div className="card-meta"><p>{movie.release_date?.slice(0, 4) || 'Год не указан'}</p><p className="card-rating">{movie.vote_average ? movie.vote_average.toFixed(1) : '—'}</p></div></div></button></article>;
  }
}

export default MovieCard;
