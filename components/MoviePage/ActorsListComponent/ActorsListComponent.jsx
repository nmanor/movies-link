import React from 'react';
import { PropTypes } from 'prop-types';
import { Parallax } from 'react-scroll-parallax';
import ActorComponent from '../ActorComponent/ActorComponent';
import styles from './ActorsListComponent.module.css';

function ActorsListComponent({ playersList, accentColor }) {
  return (
    <Parallax
      speed={3}
      className={styles.container}
    >
      {playersList.map((player) => (
        <ActorComponent
          key={player.id}
          player={player}
          accentColor={accentColor}
        />
      ))}
    </Parallax>
  );
}

ActorsListComponent.propTypes = {
  playersList: PropTypes.arrayOf(Object),
  accentColor: PropTypes.string,
};

ActorsListComponent.defaultProps = {
  playersList: [],
  accentColor: '#FFF',
};

export default ActorsListComponent;
