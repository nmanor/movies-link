import React from 'react';
import { PropTypes } from 'prop-types';
import { Parallax } from 'react-scroll-parallax';
import PlayerComponent from '@/components/MoviePage/PlayerComponent/PlayerComponent';
import styles from './PlayersListComponent.module.css';

function PlayersListComponent({ playersList, accentColor }) {
  return (
    <Parallax
      speed={3}
      className={styles.container}
    >
      {playersList.map((player) => (
        <PlayerComponent
          key={player.pid}
          player={player}
          accentColor={accentColor}
        />
      ))}
    </Parallax>
  );
}

PlayersListComponent.propTypes = {
  playersList: PropTypes.arrayOf(Object),
  accentColor: PropTypes.string,
};

PlayersListComponent.defaultProps = {
  playersList: [],
  accentColor: '#FFF',
};

export default PlayersListComponent;
