import React from 'react';
import classNames from 'classnames/bind';
import PropTypes, { string } from 'prop-types';
import styles from './TabsComponent.module.css';

const cx = classNames.bind(styles);

export default function TabsComponent({ tabs, selectedTab, onChange }) {
  return (
    <div className={styles.container}>
      {tabs.map((tab, i) => (
        <button
          key={tab.replace(/\s+/g, '-')}
          type="button"
          onClick={() => onChange(i)}
          className={cx(styles.tab, { [styles.selectedTab]: selectedTab === i })}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

TabsComponent.propTypes = {
  tabs: PropTypes.arrayOf(string),
  selectedTab: PropTypes.number,
  onChange: PropTypes.func,
};

TabsComponent.defaultProps = {
  tabs: [],
  selectedTab: 0,
  onChange: () => {},
};
