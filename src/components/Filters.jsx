import PropTypes from 'prop-types';

function Filters({ yearFrom, yearTo, minRating, sortBy, onYearFrom, onYearTo, onRating, onSort, onReset }) {
  return <div className="filters"><label>Год от<input type="number" min="1888" max="2100" value={yearFrom} onChange={({ target }) => onYearFrom(target.value)} placeholder="1900" /></label><label>Год до<input type="number" min="1888" max="2100" value={yearTo} onChange={({ target }) => onYearTo(target.value)} placeholder="2026" /></label><label>Рейтинг от<select value={minRating} onChange={({ target }) => onRating(target.value)}><option value="0">Любой</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option></select></label><label>Сортировка<select value={sortBy} onChange={({ target }) => onSort(target.value)}><option value="rating-desc">Рейтинг: высокий</option><option value="rating-asc">Рейтинг: низкий</option><option value="year-desc">Сначала новые</option><option value="year-asc">Сначала старые</option></select></label><button type="button" onClick={onReset}>Сбросить</button></div>;
}

Filters.propTypes = { yearFrom: PropTypes.string.isRequired, yearTo: PropTypes.string.isRequired, minRating: PropTypes.string.isRequired, sortBy: PropTypes.string.isRequired, onYearFrom: PropTypes.func.isRequired, onYearTo: PropTypes.func.isRequired, onRating: PropTypes.func.isRequired, onSort: PropTypes.func.isRequired, onReset: PropTypes.func.isRequired };
export default Filters;
