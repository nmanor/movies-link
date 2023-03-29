import React from 'react';
import { PropTypes } from 'prop-types';
import styles from './ActorMetadataComponent.module.css';
import CalendarSVGComponent from '../../shared/svg/CalendarSVGComponent';
import GlobeSVGComponent from '../../shared/svg/GlobeSVGComponent';
import GenderSVGComponent from '../../shared/svg/GenderSVGComponent';
import tmdbDateToJsDate from '../../../utils/dates';

function dateToAge(date1, date2) {
  if (!date1) return 'Unknown age';

  const birthday = tmdbDateToJsDate(date1);
  const ageDate = new Date(Date.now() - birthday);

  if (date2) {
    const deathday = tmdbDateToJsDate(date2);
    return `${birthday.getFullYear()}-${deathday.getFullYear()}`;
  }

  return `${Math.abs(ageDate.getUTCFullYear() - 1970)} y/o`;
}

function ActorMetadataComponent({
  birthday, deathday, gender, placeOfBirth, accentColor,
}) {
  return (
    <div className={styles.metadataContainer}>
      <div className={styles.metadataItem}>
        <GenderSVGComponent className={styles.svgIcon} style={{ fill: accentColor }} />
        <p>{gender}</p>
      </div>
      <div className={styles.metadataItem}>
        <CalendarSVGComponent className={styles.svgIcon} style={{ fill: accentColor }} />
        <p>{dateToAge(birthday, deathday)}</p>
      </div>
      <div className={styles.metadataItem}>
        <GlobeSVGComponent className={styles.svgIcon} style={{ fill: accentColor }} />
        <p>
          {placeOfBirth}
        </p>
      </div>
    </div>
  );
}

ActorMetadataComponent.propTypes = {
  birthday: PropTypes.string,
  deathday: PropTypes.string,
  gender: PropTypes.string,
  placeOfBirth: PropTypes.string,
  accentColor: PropTypes.string,
};

ActorMetadataComponent.defaultProps = {
  birthday: 'unknown',
  deathday: 'unknown',
  gender: 'unknown',
  placeOfBirth: 'unknown',
  accentColor: 'rgba(0, 0, 0, 1)',
};

export default ActorMetadataComponent;
