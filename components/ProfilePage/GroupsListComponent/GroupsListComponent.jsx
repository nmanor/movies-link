import React from 'react';
import Link from 'next/link';
import classNames from 'classnames/bind';
import * as PropTypes from 'prop-types';
import styles from './GroupsListComponent.module.css';
import { groupNameToAcronyms } from '../../../utils/utils';

const cx = classNames.bind(styles);

export default function GroupsListComponent({ onNewGroupClick, groups }) {
  return (
    <div className={styles.groups}>
      <button
        type="button"
        onClick={onNewGroupClick}
        className={styles.group}
      >
        <div
          className={cx(styles.groupIcon, styles.createButton)}
        >
          +
        </div>
        Create
      </button>
      {groups.map((group) => (
        <Link
          key={group.id}
          href={`/group/${group.id}`}
          className={styles.group}
        >
          <div
            className={styles.groupIcon}
            style={{ backgroundColor: group.color }}
          >
            {groupNameToAcronyms(group.name)}
          </div>
          {group.name}
        </Link>
      ))}
    </div>
  );
}

GroupsListComponent.propTypes = {
  onNewGroupClick: PropTypes.func,
  groups: PropTypes.arrayOf(Object),
};

GroupsListComponent.defaultProps = {
  onNewGroupClick: () => {},
  groups: [],
};
