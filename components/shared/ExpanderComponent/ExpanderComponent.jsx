import React from 'react';
import classNames from 'classnames/bind';
import { PropTypes } from 'prop-types';
import styles from './ExpanderComponent.module.css';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

const cx = classNames.bind(styles);

export default function ExpanderComponent({
  isOpen, title, accentColor, onOpen, loading, children,
}) {
  return (
    <div
      className={styles.container}
    >
      <div className={cx(styles.loadingOverlay, { [styles.loading]: loading })} />
      <ButtonComponent
        onClick={onOpen}
        accentColor={accentColor}
        className={cx(styles.button, { [styles.open]: isOpen })}
      >
        {title}
      </ButtonComponent>
      <div className={cx(styles.childrenContainer, { [styles.open]: isOpen })}>
        <div className={styles.childrenWrapper}>
          {children}
        </div>
      </div>
    </div>
  );
}

ExpanderComponent.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  accentColor: PropTypes.string,
  onOpen: PropTypes.func,
  loading: PropTypes.bool,
  children: PropTypes.node,
};

ExpanderComponent.defaultProps = {
  isOpen: false,
  title: 'Title',
  accentColor: '#FFF',
  onOpen: () => {},
  loading: false,
  children: [],
};
