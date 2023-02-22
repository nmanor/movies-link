import React from 'react';
import { PropTypes } from 'prop-types';
import styles from './ActorMetadataComponent.module.css';
import CalendarSVGComponent from '../../shared/svg/CalendarSVGComponent';
import GlobeSVGComponent from '../../shared/svg/GlobeSVGComponent';
import GenderSVGComponent from '../../shared/svg/GenderSVGComponent';

function dateToAge(date) {
  if (!date) return 'Unknown';

  const [year, day, month] = date.split('-').map(Number);
  const birthday = new Date(year, month - 1, day);
  const ageDate = new Date(Date.now() - birthday);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function ActorMetadataComponent({
  birthday, gender, placeOfBirth, accentColor,
}) {
  return (
    <div className={styles.metadataContainer}>
      <div className={styles.metadataItem}>
        <GenderSVGComponent className={styles.svgIcon} style={{ fill: accentColor }} />
        <p>{gender}</p>
      </div>
      <div className={styles.metadataItem}>
        <CalendarSVGComponent className={styles.svgIcon} style={{ fill: accentColor }} />
        <p>{`${dateToAge(birthday)} y/o`}</p>
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
  gender: PropTypes.string,
  placeOfBirth: PropTypes.string,
  accentColor: PropTypes.string,
};

ActorMetadataComponent.defaultProps = {
  birthday: 'unknown',
  gender: 'unknown',
  placeOfBirth: 'unknown',
  accentColor: 'rgba(0, 0, 0, 1)',
};

export default ActorMetadataComponent;
