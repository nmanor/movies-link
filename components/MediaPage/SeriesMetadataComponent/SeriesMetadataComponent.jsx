import React from 'react';
import { PropTypes } from 'prop-types';
import styles from './SeriesMetadataComponent.module.css';
import CalendarSVGComponent from '../../shared/svg/CalendarSVGComponent';
import TvSVGComponent from '../../shared/svg/TvSVGComponent';
import HashSVGComponent from '../../shared/svg/HashSVGComponent';

function SeriesMetadataComponent({
  mediaType, numberOfSeasons, firstAirDate, lastAirDate, accentColor,
}) {
  return (
    <div className={styles.metadataContainer}>
      <div className={styles.metadataItem}>
        <TvSVGComponent className={styles.svgIcon} style={{ fill: accentColor }} />
        <p>{mediaType}</p>
      </div>
      <div className={styles.metadataItem}>
        <CalendarSVGComponent className={styles.svgIcon} style={{ fill: accentColor }} />
        <p>{`${firstAirDate}-${lastAirDate}`}</p>
      </div>
      <div className={styles.metadataItem}>
        <HashSVGComponent className={styles.svgIcon} style={{ fill: accentColor }} />
        <p>
          {`${numberOfSeasons}SE`}
        </p>
      </div>
    </div>
  );
}

SeriesMetadataComponent.propTypes = {
  mediaType: PropTypes.string,
  numberOfSeasons: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  firstAirDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lastAirDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  accentColor: PropTypes.string,
};

SeriesMetadataComponent.defaultProps = {
  mediaType: 'unknown',
  numberOfSeasons: 'unknown',
  firstAirDate: 'unknown',
  lastAirDate: 'unknown',
  accentColor: 'rgba(0, 0, 0, 1)',
};

export default SeriesMetadataComponent;
