import React from 'react';
import * as PropTypes from 'prop-types';
import styles from './StatisticsTableComponent.module.css';

export default function StatisticsTableComponent({
  movies, series, moviesTime, numberOfSeasons,
}) {
  const renderMovieTime = (totalMinutes) => {
    let type = 'Hours';
    let total = (totalMinutes / 60).toFixed(1);

    if (totalMinutes < 60) {
      type = 'Minutes';
      total = totalMinutes;
    }

    if (totalMinutes / 60 >= 1000) {
      total = `${((moviesTime / 60) / 1000).toFixed(2)}K`;
    }

    return (
      <>
        <h3>{total}</h3>
        <p>
          Movies
          {' '}
          {type}
        </p>
      </>
    );
  };

  return (
    <div className={styles.statisticsTable}>
      <div>
        <h3>{movies}</h3>
        <p>Movies</p>
      </div>
      <div>
        <h3>{series}</h3>
        <p>TV Shows</p>
      </div>
      <div>
        {renderMovieTime(moviesTime)}
      </div>
      <div>
        <h3>{numberOfSeasons}</h3>
        <p>Seasons</p>
      </div>
    </div>
  );
}

StatisticsTableComponent.propTypes = {
  movies: PropTypes.number,
  series: PropTypes.number,
  moviesTime: PropTypes.number,
  numberOfSeasons: PropTypes.number,
};

StatisticsTableComponent.defaultProps = {
  movies: 0,
  series: 0,
  moviesTime: 0,
  numberOfSeasons: 0,
};
