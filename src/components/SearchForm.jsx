import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

function SearchForm({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function submit(event) {
    event.preventDefault();
    const value = query.trim();
    if (value.length < 2) return inputRef.current?.focus();
    onSearch(value);
  }

  return <form className="search" onSubmit={submit}><label htmlFor="movie-search">Название фильма</label><div className="search-row"><input ref={inputRef} id="movie-search" value={query} onChange={({ target }) => setQuery(target.value)} placeholder="Название фильма" minLength="2" required /><button type="submit" disabled={loading}>{loading ? 'Ищем...' : 'Найти'}</button></div></form>;
}

SearchForm.propTypes = { onSearch: PropTypes.func.isRequired, loading: PropTypes.bool.isRequired };
export default SearchForm;
