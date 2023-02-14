import React from 'react';
import { PropTypes } from 'prop-types';
import styles from './MovieMetadataComponent.module.css';
import CameraSVGComponent from '../../svg/CameraSVGComponent';
import CalendarSVGComponent from '../../svg/CalendarSVGComponent';
import ClockSVGComponent from '../../svg/ClockSVGComponent';

function MovieMetadataComponent({
  mediaType, distributionYear, duration, accentColor,
}) {
  return (
    <div className={styles.metadataContainer}>
      <div className={styles.metadataItem}>
        <CameraSVGComponent className={styles.svgIcon} style={{ fill: accentColor }} />
        <p>{mediaType}</p>
      </div>
      <div className={styles.metadataItem}>
        <CalendarSVGComponent className={styles.svgIcon} style={{ fill: accentColor }} />
        <p>{distributionYear}</p>
      </div>
      <div className={styles.metadataItem}>
        <ClockSVGComponent className={styles.svgIcon} style={{ fill: accentColor }} />
        <p>
          {`${duration.hours}h ${duration.minutes}m`}
        </p>
      </div>
    </div>
  );
}

MovieMetadataComponent.propTypes = {
  mediaType: PropTypes.string,
  distributionYear: PropTypes.string,
  duration: PropTypes.oneOfType(Object),
  accentColor: PropTypes.string,
};

MovieMetadataComponent.defaultProps = {
  mediaType: 'unknown',
  distributionYear: 'unknown',
  duration: { hours: 0, minutes: 0 },
  accentColor: 'rgba(0, 0, 0, 1)',
};

export default MovieMetadataComponent;
