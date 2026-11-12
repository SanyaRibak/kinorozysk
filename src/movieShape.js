import PropTypes from 'prop-types';

const movieShape = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  original_title: PropTypes.string.isRequired,
  release_date: PropTypes.string,
  poster_path: PropTypes.string,
  vote_average: PropTypes.number.isRequired,
};

export default movieShape;
