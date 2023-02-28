import React from 'react';
import { PropTypes } from 'prop-types';
import { Parallax } from 'react-scroll-parallax';
import ActorComponent from '../ActorComponent/ActorComponent';
import styles from './ActorsListComponent.module.css';

function ActorsListComponent({ actorsList, accentColor }) {
  return (
    <Parallax
      speed={3}
      className={styles.container}
    >
      {actorsList.map((actor) => (
        <ActorComponent
          key={actor.id}
          actor={actor}
          accentColor={accentColor}
        />
      ))}
    </Parallax>
  );
}

ActorsListComponent.propTypes = {
  actorsList: PropTypes.arrayOf(Object),
  accentColor: PropTypes.string,
};

ActorsListComponent.defaultProps = {
  actorsList: [],
  accentColor: '#FFF',
};

export default ActorsListComponent;
