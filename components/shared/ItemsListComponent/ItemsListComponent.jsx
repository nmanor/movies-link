import React from 'react';
import { PropTypes } from 'prop-types';
import { Parallax } from 'react-scroll-parallax';
import ActorComponent from '../ActorComponent/ActorComponent';
import MediaComponent from '../MediaComponent/MediaComponent';
import styles from './ItemsListComponent.module.css';

export const ListType = {
  ActorsList: 0,
  MovieList: 1,
};

export default function ItemsListComponent({
  listType, items, title, accentColor,
}) {
  const createItem = (item) => {
    if (listType === ListType.ActorsList) {
      return (
        <ActorComponent
          key={item.id}
          actor={item}
          accentColor={accentColor}
        />
      );
    }

    if (listType === ListType.MovieList) {
      return (
        <MediaComponent
          key={item.id}
          media={item}
          accentColor={accentColor}
        />
      );
    }

    throw new Error('List type doesn\'t match any of the ListType properties');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.listTitle}>{title}</h2>
      <Parallax
        speed={3}
        className={styles.list}
      >
        {items.map(createItem)}
      </Parallax>
    </div>
  );
}

ItemsListComponent.propTypes = {
  listType: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(Object),
  title: PropTypes.string,
  accentColor: PropTypes.string,
};

ItemsListComponent.defaultProps = {
  items: [],
  title: '',
  accentColor: '#FFF',
};

export const ActorsListComponent = ({
  items = [], title = '', accentColor = '#FFF',
}) => ItemsListComponent({
  listType: ListType.ActorsList, items, title, accentColor,
});

export const MoviesListComponent = ({
  items = [], title = '', accentColor = '#FFF',
}) => ItemsListComponent({
  listType: ListType.MovieList, items, title, accentColor,
});
