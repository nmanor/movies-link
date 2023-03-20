import React from 'react';
import { PropTypes } from 'prop-types';
import styles from './ResultsListComponent.module.css';
import ResultComponent from '../ResultComponent/ResultComponent';

function ResultsListComponent({ resultsList }) {
  return (
    <div className={styles.container}>
      {resultsList.map((entry, i) => (
        <ResultComponent
          key={entry.id}
          data={entry}
          priority={i <= 10}
        />
      ))}
    </div>
  );
}

ResultsListComponent.propTypes = {
  resultsList: PropTypes.arrayOf(Object),
};

ResultsListComponent.defaultProps = {
  resultsList: [],
};

export default ResultsListComponent;
